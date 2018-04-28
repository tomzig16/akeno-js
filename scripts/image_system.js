let serverControl = require('./db_controller.js');

module.exports = {
  ParseParameters: function(message, args){
    if(args.length < 1 || args[0] === "help"){
      message.reply(ImageHelp("help"));
      return;
    }
    // Print help for each command
    if(args.length < 3 || args[1] === "help"){
      message.reply(ImageHelp(args[0]));
      return;
    }
    // Add !image args[0] commands here
    if(args[0] === "add"){
      
    }
    else if(args[0] === "show"){
      let testingImageURL = "https://i.imgur.com/Di3z1Mc.gif";
      message.channel.send({
        content: "*posted by " + message.author.username + "*",
        embed: {
          color: message.guild.me.displayColor,
          author: {
            name: message.client.user.username,
            icon_url: message.client.avatarURL
          },
          title: "writtenCommandHere",
          url: testingImageURL,
          image: {
            url: testingImageURL,
          },
          thumbnail: {
            url: message.author.avatarURL
          }
        }
      });
    }
  }
}

function ImageHelp(type){
  let helpMessage = ""
  if(type === "help"){
    helpMessage = "ImageHelp will be here soon";
  }
  else if(type === "add"){
    helpMessage = "This command adds an image to my database so you later can simply access it by just giving me its title!\n";
    helpMessage += "Command format: `!image add [title] [image url]`\n";
    helpMessage += "I expect you to write direct image URL (should finish with .png, .jpg, .gif) as last parameter so I can parse as long and as many words containing title as you wish 😊\n";
    helpMessage += "If you think that you made a mistake, you can always remove your image (`!image remove help`) and add a new one!\n";
    helpMessage += "\nAh, and yes, you can not add an image which will start with \"help\", \"http://\", \"https://\" or \"www.\" in your title :P. In case you were wondering...";
  }
  else{
    return "sorry, but I know nothing about this command. Please, check `!image help` :c";
  }
  return "here's how you can use !image " + type + ".\n" + helpMessage;
}
