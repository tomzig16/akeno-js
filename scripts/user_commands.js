let serverControl = require('./db_controller.js');
module.exports = {

  honorsAndValues: {
    pat: 1,
    thank: 5,
    colect: 20
  },

  ConnectDB: function(){
    serverControl.dbConnect();
    serverControl.StartServerPokingRoutine();
  },

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

  CMD_JoinH: function(message){
    serverControl.AddUser(message.guild.id, message.author.id, function(result){
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
    
  CMD_Status: function(message){
    serverControl.GetServerFK(message.guild.id, serverFK => {
      if(serverFK < 0) {
        message.reply("sorry, but seems like I don't know anything about this server...");
      }
      else {
        serverControl.DoesUserExistInDB(message.author.id, message.guild.id, exists => {
          if(exists === false){
            message.reply("seems like I don't know anything about you :c. Join our team - `!join_h`!");
          }
          else{
            serverControl.GetUserStats(message.author.id, message.guild.id, results => {
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
  },

  CMD_Pat: function(message, args){
    if(args.length != 1){
      message.reply(" if you want to pat someone, use `!pat [target name]`");
      return;
    }

    serverControl.DoesUserExistInDB(message.author.id, message.guild.id, doesExist =>{
      if(doesExist === false){
        message.reply("sorry, but I don't know anything about you yet... Let's be friends! `!join_h`");
      }
      else{
        if(message.mentions.members.size != 0){
          let discord_id = args[0].replace("<@", "");
          discord_id = discord_id.replace(">", "");
          discord_id = discord_id.replace("!", ""); // if user has username
          serverControl.DoesUserExistInDB(discord_id, message.guild.id, targetExists =>{
            if(targetExists === true){
              serverControl.GiveHonorPoints(message.author.id, discord_id, message.guild.id, this.honorsAndValues["pat"]);
            }
            else{
              message.reply("looks like your friend does not exist...");
            }
          });
        }
        else{
          //SELECT `name` FROM `users` WHERE `name` LIKE '%2%' 
        }

      }
    });
  }

};