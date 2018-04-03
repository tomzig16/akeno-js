module.exports = {
  OnAddServer: function(server, dbConnection){
    var sql = "SELECT * FROM `servers` WHERE `dscr_id` = " + server.id;
    dbConnection.query(sql, function (err, result, fields) {
      if (err) throw err;
      if(result == ""){
        InsertServer(server, dbConnection);
      }
      else{
        console.log("Server already exists in database.");
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
    var sqlInsertUStats = "INSERT INTO `user_stats` (`id`, `user_fk`, `honored`, `spare_honors`) " +
    "VALUES (NULL, '" + result_ins_usr.insertId + "', '0', '15');";
    dbConnection.query(sqlInsertUStats, function (err_ins_ustats, result_ins_ustats) {
      if (err_ins_ustats) throw err_ins_ustats;
      console.log("User stats row was added to DB.");
    });
  });
}
