module.exports = {
  OnAddServer: function(server, dbConnection){
    var sql = "SELECT * FROM `servers` WHERE `dscr_id` = " + server.id;
    dbConnection.query(sql, function (err, result, fields) {
      if (err) throw err;
      if(result == ""){
        InsertServer(server.id, dbConnection);
      }
      else{
        console.log("Server already exists in database.");
      }
    });
  }
};

function InsertServer(serverID, dbConnection){
  var sqlInsertServConf =  "INSERT INTO `server_conf` (`id`, `admin_role`) VALUES (NULL, NULL);";
  dbConnection.query(sqlInsertServConf, function (err_ins_conf, result_ins_conf) {
    if (err_ins_conf) throw err_ins_conf;
    var sqlInsertServer = "INSERT INTO `servers` (`id`, `dscr_id`, `admin_fk`, `server_conf_fk`) VALUES (NULL, '" + 
                          serverID + "', NULL, '" + result_ins_conf.insertId + "');";
    dbConnection.query(sqlInsertServer, function(err_ins_server, result_ins_server){
      if(err_ins_server) throw err_ins_server;
      console.log("Inserted into servers");
    });
  });

          /*
        INSERT INTO `akeno_debug`.`users` (`id`, `name`, `dscr_id`, `server_fk`) VALUES (NULL, 'Akeno', '429672169203695616', '1');
        INSERT INTO `akeno_debug`.`user_stats` (`id`, `user_fk`, `honored`, `spare_honors`) VALUES (NULL, '1', '0', '15');
        */
}