let serverControl = require('./db_controller.js');
module.exports = {
  CMD_AddServer: function(message, con){
    if(message.author.id === message.guild.ownerID){
      serverControl.AddServer(message.guild, con, function(result){
        if(result === true){
          message.reply("good news! Server was added to my database, and your user was created as well!");
        }
        else{
          message.reply("looks like this server already exists in my database!");
        }
      });
    }
    else{
      return message.reply("Sorry, you don't have permission to do that.");
    }
  },

  CMD_JoinH: function(message, con){
    serverControl.AddUser(message.guild.id, message.author.id, con, function(result){
      if(result === "User already exists"){
        message.reply("seems like you already exist...");
      }
      else if(result === "Server not found"){
        message.reply("oof! This server does not exist in my memory.");
      }
      else if(result === "OK"){
        message.reply("Yay! I have added you to my database!\nYou can check your status with !status command");
      }
      else{
        console.log("Unknown callback message?");
      }
    });
  },  
    
  CMD_Status: function(message, con){
    serverControl.GetServerFK(message.guild.id, con, serverFK => {
      if(serverFK < 0) {
        message.reply("sorry, but seems like I don't know anything about this server...");
      }
      else {
        serverControl.DoesUserExistInDB(message.author.id, message.guild.id, con, exists => {
          if(exists === false){
            message.reply("seems like I don't know anything about you :c. Join our team - `!join_h`!");
          }
          else{
            serverControl.GetUserStats(message.author.id, message.guild.id, con, results => {
              if(results == null){
                message.reply("sorry, something went wrong...");
                console.log("Failed reading user's stats. User dscr_id: " + message.author.id);
              }
              else{
                message.reply("gotcha! Let's see...\nHere's what I remember - " +
                "You were honored " + results.honored + " times and now you can honor someone for up to " + results.spare_honors + " honor points.");
              }
            });
          }
        });
      }
    });
  }

};