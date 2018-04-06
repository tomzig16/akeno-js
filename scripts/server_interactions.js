module.exports = {
  OnBotAdded: function(botClient, serverData){
    console.log(`New guild joined: ${serverData.name} (id: ${serverData.id}). This guild has ${serverData.memberCount} members!`);
    botClient.user.setActivity(`over ${botClient.guilds.size} servers`, { type: "WATCHING" } );
  },

  OnBotRemoved: function(botClient, serverData){
    console.log(`I have been removed from: ${serverData.name} (id: ${serverData.id})`);
    botClient.user.setActivity(`over ${botClient.guilds.size} servers`, { type: "WATCHING" });
  },

  OnAddServer: function(server, dbConnection, ResultCallback){
    var sql = "SELECT * FROM `servers` WHERE `dscr_id` = " + server.id;
    dbConnection.query(sql, function (err, result, fields) {
      if (err) throw err;
      if(result == ""){
        InsertServer(server, dbConnection);
        ResultCallback(true);
      }
      else{
        console.log("Server already exists in database.");
        ResultCallback(false);
      }
    });
  },

  OnAddUser: function(serverID, userID, dbConnection, ResultCallback){
    // Get server FK ID. If server does not exist, FK will be -1
    GetServerFK(serverID, dbConnection, FK => {
      if(FK >= 0){
        DoesUserExistInDB(userID, serverID, dbConnection, userExists => {
          if(userExists === true){
            ResultCallback("User already exists");
          }
          else{
            AddUserToDB(userID, FK, dbConnection);
            ResultCallback("OK"); 
          }
        });
      }
      else{
        console.log("Tried accessing server which does not exist in database.");
        ResultCallback("Server not found");
      }
    });
  }
};






function InsertServer(server, dbConnection){
  var sqlInsertServConf =  "INSERT INTO `server_conf` (`id`, `admin_role`) VALUES (NULL, NULL);";
  dbConnection.query(sqlInsertServConf, function (err_ins_conf, result_ins_conf) {
    if (err_ins_conf) throw err_ins_conf;

    var sqlInsertServer = "INSERT INTO `servers` (`id`, `dscr_id`, `admin_fk`, `server_conf_fk`) VALUES (NULL, '" + 
                          server.id + "', NULL, '" + result_ins_conf.insertId + "');";

    dbConnection.query(sqlInsertServer, function(err_ins_server, result_ins_server){
      if(err_ins_server) throw err_ins_server;
      console.log("Server was added to database.");

      InsertServerOwner(server.owner, result_ins_server.insertId, dbConnection);
    });
  });
}

function InsertServerOwner(serverOwner, serverTableID, dbConnection){
  // Might do user insert inside AddUser function, but it needs a callback.
  // I am leaving it as is for now
  var sqlInsertServConf =  "INSERT INTO `users` (`id`, `name`, `dscr_id`, `server_fk`) VALUES " +
  "(NULL, '" + serverOwner.user.tag + "', '" + serverOwner.id + "', '" + serverTableID + "');";
  dbConnection.query(sqlInsertServConf, function (err_ins_usr, result_ins_usr) {
    if (err_ins_usr) throw err_ins_usr;
    console.log("Main admin was added to DB.");

    // Update server admin fk
    var sqlUpdateServ = "UPDATE `servers` SET `admin_fk` = '" + result_ins_usr.insertId + "' WHERE `servers`.`id` = " + serverTableID;
    dbConnection.query(sqlUpdateServ, function (err_upd_serv, result_upd_serv) {
      if (err_upd_serv) throw err_upd_serv;
      console.log(result_upd_serv.affectedRows + " record(s) updated");
    });

    // Insert into user_stats table
    AddUserStatsRow(result_ins_usr.insertId, dbConnection);
  });
}

function GetServerFK(serverID, dbConnection, CallbackFK){
  var sqlServerID = "SELECT `id` FROM `servers` WHERE `dscr_id` = " + serverID;
  dbConnection.query(sqlServerID, function (err, result, fields) {
    if (err) throw err;
    if(result != ""){
      CallbackFK(result[0].id);
    }
    else{
      CallbackFK(-1);
    }
  });
  

}

function DoesUserExistInDB(userID, serverID, dbConnection, ExistsCallback){
  var sql = "SELECT `users`.`id` FROM `users`, `servers` WHERE `servers`.`dscr_id` = " + serverID + 
  " AND `users`.`server_fk` = `servers`.`id` AND `users`.`dscr_id` = " + userID;
  dbConnection.query(sql, function (err, result, fields) {
    if (err) throw err;
    if(result == ""){
      ExistsCallback(false);
    }
    else{
      ExistsCallback(true);
    }
  });
}

function AddUserToDB(userID, serverID, dbConnection){
  var sqlInsertUser =  "INSERT INTO `users` (`id`, `name`, `dscr_id`, `server_fk`) VALUES " +
  "(NULL, '" + userID + "', '" + userID + "', '" + serverID + "');";
  dbConnection.query(sqlInsertUser, function (error, result) {
    if (error) throw error;
    AddUserStatsRow(result[0].id, dbConnection);
    console.log("New user was added to users DB.");
  });
}

function AddUserStatsRow(userFK, dbConnection){
  var sqlInsertUStats = "INSERT INTO `user_stats` (`id`, `user_fk`, `honored`, `spare_honors`) " +
  "VALUES (NULL, '" + userFK + "', '0', '15');";
  dbConnection.query(sqlInsertUStats, function (err_ins_ustats, result_ins_ustats) {
    if (err_ins_ustats) throw err_ins_ustats;
  });
}

