let serverControl = require('./db_controller.js');

var serverConfigs = {};

module.exports = {

  features:{
    nonowner: 1,
    honors: 2,
    images: 4
  },

  LoadGuilds: function(){
    // Must load discord id as key, admin_role as value, flags
    serverControl.GetServersAndConfigs(guilds =>{
      for(var i = 0; i < guilds.length; i++){
        //console.log(guilds[i]["dscr_id"]);
        serverConfigs[guilds[i]["dscr_id"]] = {
          admin_role: guilds[i]["admin_role"],
          flags: guilds[i]["flags"]
        };
      }
      console.log("Loaded total of " + guilds.length + " guilds");
    });
  },

  UpdateGuildData: function(guildID){
    serverControl.GetSingleServerConfigs(guildID, guild =>{
      serverConfigs[guild[0]["dscr_id"]] = {
        admin_role: guild[0]["admin_role"],
        flags: guild[0]["flags"]
      }
      console.log(guildID + " guild was updated.");
    });
  },

  IsFeatureEnabled: function(feature, serverID){
    if(this.features.hasOwnProperty(feature)){
      if(serverConfigs.hasOwnProperty(serverID)){
        if(this.features[feature] & serverConfigs[serverID]["flags"] > 0){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        throw "Server not found";
      }
    }
    else{
      throw "Feature not found!";
    }

  },


  CMD_AddServer: function(message){
    if(message.author.id === message.guild.ownerID){
      serverControl.AddServer(message.guild).then(result => {
        if(result === true){
          message.reply("good news! Server was added to my database, and your user was created as well!");
          setTimeout(() => { this.UpdateGuildData(message.guild.id); }, 2500);
        }
        else{
          message.reply("looks like this server already exists in my database!");
        }
      }).catch(err => {console.log("Error was encountered during AddServer."); throw err; })
    }
    else{
      return message.reply("Sorry, you don't have permission to do that.");
    }   
  },

  CMD_ManageAkeno: function(message, args){
    //if(message.author.id === message.guild.ownerID){
      if(args.length < 1 || args[0] === "help"){
        message.reply("WIP");
      }
      if(args[0] === "fdisable"){
        if(args.length < 2 || args[1] === "help"){
          message.channel.send("Usage: `!akeno-mng fdisable [feature]`. "+
          "Feature can be command without `!` prefix or as listen in `!akeno-mng features`.\n"+
          "\nExample: `!akeno-mng fdisable honor`");
          return;
        }
      }
      else if(args[0] === "fenable"){
        message.reply("WIP");
      }
      else if(args[0] === "features"){
        message.reply("WIP");
        console.log(this.IsFeatureEnabled("nonowner", message.guild.id));
      }
    //}
  }

};

