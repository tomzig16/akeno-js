const Discord = require("discord.js");
const dotenv = require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

//const serverControl = require("./scripts/db_controller.js");
//const honoringSystem = require("./scripts/honoring_system.js");
//const guildControls = require("./scripts/guild_controls.js");
//const imageSystem = require("./scripts/image_system.js");

const defaultPrefix = "!";

// Start the systems
const client = new Discord.Client();


registeredCommands = {
    admin: {},
    moderator: {},
    default: {}
}

AddNewCommand = (command, type, cmdUsage, cmdDescription, callback) => {
    registeredCommands[type][command] = {};
    registeredCommands[type][command]["usage"] = cmdUsage;
    registeredCommands[type][command]["description"] = cmdDescription;
    registeredCommands[type][command]["execute"] = callback;
};
module.exports.AddNewCommand = AddNewCommand;

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

    // TODO Execute commands
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