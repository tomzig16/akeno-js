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
  }  
    
};