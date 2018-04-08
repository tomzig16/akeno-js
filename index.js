require('dotenv').config();
var mysql = require('mysql');
var userCommands = require('./scripts/user_commands.js');
const Discord = require('discord.js');

const prefix = "!";


// Connecting Discord bot
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
client.login(token);

client.on('ready', function() {
  console.log('Bot has been started');
});



// Connecting to database
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});


// Bot commands
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "addserver") {
    userCommands.CMD_AddServer(message, con);
  }

  if(command === "join_h"){
    userCommands.CMD_JoinH(message, con);
  }

  if(command === "status"){
    userCommands.CMD_Status(message, con);
  }

});


client.on("guildCreate", guild => {
  console.log("New guild joined");
});

client.on("guildDelete", guild => {
  console.log("Removed from a guild");
});

// MySQL keeps disconnecting if it is inactive for a period of time,
// In order to avoid that, this function will be pinging it each hour or so
setInterval(function(){
  var sql = "SELECT `name` FROM `users` WHERE `users`.`id` = 1";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    var date = new Date();
    var printMessage =  "[" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() +
                        " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + 
                        "Ping... Selected name: " + result[0].name;
    console.log(printMessage);
  });
}, 14400000); // Pinging each 4 hours

