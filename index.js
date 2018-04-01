require('dotenv').config();
var mysql = require('mysql');
var serverControl = require('./scripts/server_control.js');
var botCommand = require('./scripts/bot_commands.js')
const Discord = require('discord.js');


// Connecting Discord bot
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
client.login(token);

client.on('ready', function() {
  console.log('Bot has been started');
  client.user.setActivity(`over ${client.guilds.size} server`, "WATCHING");
});



// Connecting to database
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});



// Bot commands
client.on("message", message => {
  if (message.content === "!addusr") {
    serverControl.OnAddUserCMD();
  }
});

client.on("guildCreate", guild => {
  serverControl.OnBotAdded(client, guild);
});

client.on("guildDelete", guild => {
  serverControl.OnBotRemoved(client, guild);
});
