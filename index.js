require('dotenv').config();
var mysql = require('mysql');
const Discord = require('discord.js');

const client = Discord.Client();
const token = process.env.BOT_TOKEN;
client.login(token);

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});

client.on('ready', function() {
  console.log('Bot has been started');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});
