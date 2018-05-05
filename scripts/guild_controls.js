let serverControl = require('./db_controller.js');

module.exports = {
  CMD_AddServer: function(message){
    if(message.author.id === message.guild.ownerID){
      serverControl.AddServer(message.guild, function(result){
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

  CMD_ManageAkeno: function(message, args){
    if(message.author.id === message.guild.ownerID){
      if(args[0] === "fdisable"){
        message.reply("WIP");
      }
      else if(args[0] === "fenable"){
        message.reply("WIP");
      }
      else if(args[0] === "help"){
        message.reply("WIP");
      }
      else if(args[0] === "features"){
        message.reply("WIP");
      }
    }
  }

};