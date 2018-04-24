var userCommands = require('./scripts/user_commands.js');
const Discord = require('discord.js');

const prefix = "!";


// Connecting Discord bot
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
client.login(token);

client.on('ready', function() {
  console.log('Bot has been started');
  userCommands.ConnectDB();
});


// Bot commands
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "addserver") {
    userCommands.CMD_AddServer(message);
  }
  else if(command === "join_h"){
    userCommands.CMD_JoinH(message);
  }
  else if(command === "status"){
    userCommands.CMD_Status(message);
  }
  else if(command === "collect"){
    userCommands.CMD_Collect(message);
  }
  else if(command === "pat"){
    userCommands.CMD_Honor(message, args, "pat");
  }
  else if(command === "thank"){
    userCommands.CMD_Honor(message, args, "thank");
  }
  else if(command === "honor"){
    userCommands.CMD_Honor(message, args, "honor");
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

client.on("error", (error) => console.error(error));
