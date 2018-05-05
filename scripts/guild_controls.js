let serverControl = require('./db_controller.js');

var serverConfigs = {};

module.exports = {

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

  IsFeatureEnabled: function(feature, serverID, callback){

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

  CMD_ManageAkeno: function(message, args){
    //if(message.author.id === message.guild.ownerID){
      if(args.length < 1 || args[0] === "help"){
        message.reply("WIP");
      }
      if(args[0] === "fdisable"){
        if(args.length < 2 || args[1] === "help"){
          message.channel.send("Usage: '!akeno-mng fdisable [feature]`. "+
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
      }
    //}
  }

};

