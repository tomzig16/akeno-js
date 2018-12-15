require('dotenv').config();
const mysql = require('mysql');

dbConnection = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

module.exports = {
    
    // Returns discord servers (their IDs), admin_role, flags for that specific server
    GetServersAndConfigs: (guildsCallback) => {
        var sql = "SELECT `servers`.`dscr_id`, `server_conf`.`admin_role`, `server_conf`.`flags` FROM `servers`, `server_conf` "+
        "WHERE `server_conf`.`id` = `servers`.`server_conf_fk`";
        dbConnection.query(sql, (err, result, fields) => {
            if (err) throw err;
            guildsCallback(result);
        });
    },
  
    // Accepts guildID - certain server snowflake
    // Returns admin_role, and flags
    GetSingleServerConfigs: (guildID, guildCallback) => {
        var sql = "SELECT `server_conf`.`admin_role`, `server_conf`.`flags` FROM `servers`, `server_conf` "+
        "WHERE `servers`.`dscr_id` = '" + guildID + "' AND `server_conf`.`id` = `servers`.`server_conf_fk`";
        dbConnection.query(sql, (err, result, fields) => {
            if (err) throw err;
            guildCallback(result);
      });
    },
  
    // Accepts guildID - certain server snowflake, newFlag - new flag to add (old one is overriten)
    UpdateServerFlags: (guildID, newFlag) => {
        let sql = "UPDATE `server_conf`, `servers` " +
        "SET `flags` = " + newFlag + " "+
        "WHERE `servers`.`dscr_id` = '" + guildID + "' AND `server_conf`.`id` = `servers`.`server_conf_fk`;";
        dbConnection.query(sql, (err, result) => {
            if (err) throw err;
        });
    },
  
    // Adds new server (aka guild) to the database
    // Accepts server - guild returned by discord.js api
    // Returns a boolean whether or not server was added
    AddServer: (server) => {
        return new Promise((resolve, reject) => {
            var sql = "SELECT * FROM `servers` WHERE `dscr_id` = " + server.id;
            dbConnection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                if(result == "") {
                    InsertServer(server);
                    return resolve(true)
                }
                else {
                    console.log("Server already exists in database.");
                    return resolve(false);
                }
            });
        });
    },
  
    // Adds new user to the database
    // Accepts serverID - certain server snowflake, userID - new user which is about to be added snowflake
    // Returns string with result (3 possibilities): "OK", "User already exists", "Server not found" 
    AddUser: (serverID, userID, ResultCallback) => {
        // Get server FK ID. If server does not exist, FK will be -1
        this.GetServerFK(serverID, FK => {
            if(FK >= 0) {
                this.DoesUserExistInDB(userID, serverID, userExists => {
                    if(userExists === true) {
                        ResultCallback("User already exists");
                    }
                    else {
                        AddUserToDB(userID, FK);
                        ResultCallback("OK"); 
                    }
                });
            }
            else {
                console.log("Tried accessing server which does not exist in database.");
                ResultCallback("Server not found");
            }
        });
    },
  
    // Gets server ID in database
    // Accepts serverID - unique snowflake returned by discord.js api
    // Returns server ID which is given by database. returns -1 if server was not found
    GetServerFK: (serverID, CallbackFK) => {
        var sqlServerID = "SELECT `id` FROM `servers` WHERE `dscr_id` = " + serverID;
        dbConnection.query(sqlServerID, function (err, result, fields) {
            if (err) throw err;
            if(result != "") {
                CallbackFK(result[0].id);
            }
            else {
                CallbackFK(-1);
            }
        });
    },
    
    // Returns a boolean whether or not user exists in database
    // Accepts userID and serverID - unique snowflakes returned by discord.js api
    DoesUserExistInDB: (userID, serverID, ExistsCallback) => {
        var sql = "SELECT `users`.`id` FROM `users`, `servers` WHERE `servers`.`dscr_id` = " + serverID + 
        " AND `users`.`server_fk` = `servers`.`id` AND `users`.`dscr_id` = " + userID;
        dbConnection.query(sql, function (err, result, fields) {
            if (err) throw err;
            if(result == "") {
                ExistsCallback(false);
            }
            else{
                ExistsCallback(true);
            }
        });
    },
  
    // Accepts userID and serverID - unique user and guild snowflakes returned by discord.js api
    // Returns user stats object (fields: id, pats, thanks, honors, spare_honors)
    // or null if not found
    GetUserStats: (userID, serverID, ResultsCallback) => {
        var sql = "SELECT `user_stats`.`id`, `user_stats`.`pats`, `user_stats`.`thanks`, `user_stats`.`honors`, `user_stats`.`spare_honors` " + 
                  "FROM `users`, `servers`, `user_stats` " +
                  "WHERE `servers`.`dscr_id` = " + serverID + " " +
                  "AND `users`.`server_fk` = `servers`.`id` " + 
                  "AND `users`.`dscr_id` = " + userID + " " +
                  "AND `user_stats`.`user_fk` = `users`.`id`";
        dbConnection.query(sql, (err, result, fields) => {
            if (err) throw err;
            if(result != "") {
                ResultsCallback(result[0]);
            }
            else{
                ResultsCallback(null);
            }
        });
    },
  
    // Gives honor points
    // Accepts:
    //  senderID - a person who is invoking the command unique snowflake
    //  receiverID - a person who is about to receive honor points unique snowflake
    //  serverID - server in which transfer is about to happen (unique snowflake)
    //  htype - type of points being transfered (pat, honor, thank)
    //  amount - amount of points to transfer
    // Returns status - "OK" or "NotEnoughSparePoints"
    GiveHonorPoints: (senderID, receiverID, serverID, htype, amount, statusCallback) => {
        this.GetUserStats(senderID, serverID, senderStats => {
            this.GetUserStats(receiverID, serverID, receiverStats => {
                // at this point, both stats should exist.
                if(senderStats.spare_honors < amount) {
                    statusCallback("NotEnoughSparePoints");
                }
                else {
                    let honorTypeColumn = htype + "s";
                    var sqlGivePoints = "UPDATE `user_stats` SET `" + honorTypeColumn + "` = " + (receiverStats[honorTypeColumn] + parseInt(amount)) + " WHERE `user_stats`.`id` = " + receiverStats.id + ";"; 
                    var sqlTakePoints = "UPDATE `user_stats` SET `spare_honors` = " + (senderStats.spare_honors - parseInt(amount)) + " WHERE `user_stats`.`id` = " + senderStats.id + ";";
                    dbConnection.query(sqlGivePoints, function (err, result) {
                        if (err) throw err;
                    });
                    dbConnection.query(sqlTakePoints, function (err, result){
                        if (err) throw err;
                    });
                    console.log(receiverID + " has been honored");
                    statusCallback("OK");
                }
            });
        });
    },
  
    // Gives spare_honors for a user (without sender!)
    // Accepts receiverID and serverID - unique snowflakes returned by discord.js api
    GiveSparePoints: (receiverID, serverID, amount) => {
        this.GetUserStats(receiverID, serverID, receiverStats => {
            var sqlGivePoints = "UPDATE `user_stats` SET `spare_honors` = " + (receiverStats.spare_honors + parseInt(amount)) + " WHERE `user_stats`.`id` = " + receiverStats.id + ";";
            dbConnection.query(sqlGivePoints, (err, result) => {
                if (err) throw err;
            });
            console.log(receiverID + " has collected points");
        });
    },
  
  
    // Image management
  
    // Inserts new image to the database
    // Accepts:
    //  serverID - unique server snowflake returned by discord.js api
    //  authorID - unique user snowflake returned by discord.js api
    //  title - image title
    //  url - image URL
    // Returns status: "Server not found", "Duplicate" and 200 (actual integer for OK status)
    InsertNewImage: (serverID, authorID, title, url, statusCallback) => {
        this.GetServerFK(serverID, serverFK => {
            if(serverFK < 0) {
                statusCallback("Server not found");
            }
            else {
                DoesTitleAlreadyExist(serverID, title, status => {
                    if(status === true) {
                        statusCallback("Duplicate");
                    }
                    else {
                        var sqlInsertImage =  "INSERT INTO `images` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`)  VALUES " +
                        "(NULL, '" + serverFK + "', '" + authorID + "', '" + title + "', '" + url + "', '0');";
                        dbConnection.query(sqlInsertImage, (error, result) => {
                            if (error) throw error;
                            console.log("New image was added to images table.");
                        });
                        statusCallback(200);
                    }
                });
            }
        });
    },
    
    // Returns image URL, "Server not found" - if server is not found, null if image is not found
    // Accepts: 
    //  serverID - server unique snowflake where the command is invoked from
    //  title - image title
    GetImageURL: (serverID, title, resultCallback) => {
        this.GetServerFK(serverID, serverFK => {
            if(serverFK < 0){
                resultCallback("Server not found");
            }
            else {
                var sql = "SELECT `images`.`url`, `images`.`title` FROM `images` " +
                "WHERE `images`.`server_fk` = '" + serverFK + "' AND `images`.`title` LIKE '%" + title + "%'";
                dbConnection.query(sql, (err, result, fields) => {
                    if (err) throw err;
                    if(result != "") {
                        resultCallback(result[0]);
                    }
                    else {
                        var sql = "SELECT `images`.`url`, `images`.`title` FROM `images`" +
                        "WHERE `images`.`title` LIKE '%" + title + "%' AND `images`.`is_global` = 1";
                        dbConnection.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            if(result != "") {
                                resultCallback(result[0]);
                            }
                            else {
                                resultCallback(null);
                            }
                        });
                    }
                });
            }
        });
    },
  
    // Returns an array of jsons with all available images for the certain server
    // json structure: {"length", {"id", "title"}}
    // Accepts serverID - unique server snowflake returned by discord.js api 
    GetAvailableImages: (serverID, resultCallback) => {
        var data = {}; 
        this.GetServerFK(serverID, server_fk => {
            var sql = "SELECT `images`.`id`, `images`.`title` FROM `images`, `servers` " +
            "WHERE `server_fk` = '" + server_fk + "' OR `is_global` = 1 GROUP BY `images`.`id`";
            dbConnection.query(sql, (err, result, fields) => {
                if (err) throw err;
                var counter = 0;
                for(var key in result){
                    counter++;
                    data[key] = {
                        "id": result[key].id,
                        "title": result[key].title
                    };
                }
                data["length"] = counter;
                resultCallback(data);
            });
        });
    }
  
  
  };