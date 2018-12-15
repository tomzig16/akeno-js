const Discord = require("discord.js");
const dotenv = require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

const defaultPrefix = "!";

// Start the systems
const client = new Discord.Client();

registeredCommands = {
    admin: {},
    moderator: {},
    default: {}
}

module.exports.AddNewCommand = (command, type, cmdUsage, cmdDescription, callback) => {
    registeredCommands[type][command] = {};
    registeredCommands[type][command]["usage"] = cmdUsage;
    registeredCommands[type][command]["description"] = cmdDescription;
    registeredCommands[type][command]["execute"] = callback;
};

var commands = fs.readdirSync("./commands/");
commands.forEach((script) => {
    if (script.substring(script.length - 3, script.length) === '.js') {
        var req = require('./commands/' + script)
    }
});


client.on("ready", () => {
    console.log("Bot has been started");
});

client.on("message", async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(defaultPrefix) !== 0) return;
  
    const args = message.content.slice(defaultPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

});

client.on("guildCreate", (guild) => {
    // TODO probably should print more information about the server joined
    console.log("New guild joined");
});
  
  
client.on("guildDelete", (guild) => {
    // TODO probably should print more information about the server exited
    console.log("Removed from a guild");
});

// TODO handle errors properly (should log them somewhere)
client.on("error", (error) => console.log("Error was encountered. Continuing..."));
  
//client.login(process.env.BOT_TOKEN);