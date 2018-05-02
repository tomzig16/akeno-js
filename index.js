let serverControl = require('./scripts/db_controller.js');
const Discord = require('discord.js');

var honoringSystem = require('./scripts/honoring_system.js');
var guildControls = require('./scripts/guild_controls.js');
var imageSystem = require('./scripts/image_system.js');

const defaultPrefix = "!";


// Connecting Discord bot
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
client.login(token);

client.on('ready', function() {
  console.log('Bot has been started');
  serverControl.StartServerPokingRoutine();
  console.log("Database started.");
});


// Bot commands
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(defaultPrefix) !== 0) return;

  const args = message.content.slice(defaultPrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "addserver") {
    guildControls.CMD_AddServer(message);
  }
  else if(command === "join_h"){
    honoringSystem.CMD_JoinH(message);
  }
  else if(command === "status"){
    honoringSystem.CMD_Status(message);
  }
  else if(command === "collect"){
    honoringSystem.CMD_Collect(message);
  }
  else if(command === "pat"){
    honoringSystem.CMD_Honor(message, args, "pat");
  }
  else if(command === "thank"){
    honoringSystem.CMD_Honor(message, args, "thank");
  }
  else if(command === "honor"){
    honoringSystem.CMD_Honor(message, args, "honor");
  }
  // Images
  else if(command === "image"){
    imageSystem.ParseParameters(message, args);
  }
  // Decided to ignore any unknown command
  // in case people are trying to call another bot
  /*else{
    message.reply("sorry, I don't really understand you. `!help` will tell you more!");
  }*/

});


client.on("guildCreate", guild => {
  console.log("New guild joined");
});


client.on("guildDelete", guild => {
  console.log("Removed from a guild");
});

client.on("error", (error) => console.log("Error was encountered. Continuing..."));
