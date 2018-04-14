let serverControl = require('./db_controller.js');
module.exports = {

  honorTypesAndValues: {
    pat: 1,
    thank: 5,
    collect: 20
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

  CMD_Honor: function(message, args, type){
    if(type == "honor"){
      if(args.length != 2){
        message.reply(" if you want to honor someone, use `!honor [target name] [amount]`");
        return;
      }
    }
    else if(!this.honorTypesAndValues.hasOwnProperty(type)){
      throw "type not found.";
    }
    else if(args.length != 1){
      message.reply(" if you want to " + type + " someone, use `!" + type + " [target name]`");
      return;
    }

    serverControl.DoesUserExistInDB(message.author.id, message.guild.id, doesExist =>{
      if(doesExist === false){
        message.reply("sorry, but I don't know anything about you yet... Let's be friends! `!join_h`");
      }
      else{
        var receiver_id = "";
        if(message.mentions.members.size != 0){
          receiver_id = args[0].replace("<@", "");
          receiver_id = receiver_id.replace(">", "");
          receiver_id = receiver_id.replace("!", ""); // if user has username  
        }
        else{
          for(var entry of message.guild.members.entries()){
            if(entry[1].user.bot) { continue; }
            if(entry[1].nickname != null && entry[1].nickname.toLowerCase().includes(args[0].toLowerCase())){
              receiver_id = entry[0];
              break;
            }
            if(entry[1].user.tag.toLowerCase().includes(args[0].toLowerCase()) ){
              receiver_id = entry[0];
              break;
            }
          }
        }

        if(receiver_id == ""){
          message.reply("looks like a person you entered does not exist in this server...\nThe most reliable way of honoring someone is by mentioning them ^.^");
        }
        if(receiver_id === message.author.id){
          message.reply("you are already the most honorable for me, you don't have to honor yourself <3");
          return;
        }
        serverControl.DoesUserExistInDB(receiver_id, message.guild.id, targetExists =>{
          if(targetExists === true){
            let amount = 0;
            if(type === "honor"){
              amount = args[1];
            }
            else{
              amount = this.honorTypesAndValues[type];
            }
            if(amount === 0){
              message.reply("uhm... Well, I could give hime those zero points, I guess...");
              return;
            }
            serverControl.GiveHonorPoints(message.author.id, receiver_id, message.guild.id, amount, status =>{
              if(status === "NotEnoughSparePoints"){
                message.reply("looks like you don't have enough spare points to give :/.\nYou can check your amount of spare points using `!status` command!");
              }
              else if(status === "OK"){
                message.channel.send("<@" + receiver_id + ">, you were honored for " + amount + " points!\nYou can always check your status with `!status`");
              }
            });
          }
          else{
            message.reply("looks like your friend does not exist in my database...");
          }
        });

      }
    });
  }

};