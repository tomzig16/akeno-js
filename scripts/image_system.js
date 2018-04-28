let serverControl = require('./db_controller.js');
var supportedFormats = ["png", "jpg", "jpeg", "gif", "webm"];

module.exports = {



  ParseParameters: function(message, args){
    if(args.length < 1 || args[0] === "help"){
      message.reply(ImageHelp("help"));
      return;
    }
    // Print help for each command
    if(args.length === 1 || (args.length >= 2 && args[1] === "help")){
      message.reply(ImageHelp(args[0]));
      return;
    }
    // Add !image args[0] commands here
    if(args[0] === "add"){
      if(args.length < 3){
        message.reply("sorry, you are missing something. Please, peek inside `!image add help`");
        return;
      }
      let imageLink = args[args.length - 1];
      if(!IsURLSupported(imageLink)){
        message.reply("looks like last argument was not a link to image.\n" + 
        "**Make sure that link is the last argument and it ends with supported format**" +
        "(for example `https://i.imgur.com/Di3z1Mc.gif`) you can always consult !image add help ;) ");
        return;
      }
      let imageTitle = "";
      for(var i = 1; i < args.length - 2; i++){
        imageTitle += args[i] + " ";
      }
      serverControl.InsertNewImage(message.guild.id, imageTitle.trim(), imageLink, status => {
        if(status === "Server not found"){
          message.reply("sorry, seems like I don't know anything about this server...");
          return;
        }
        if(status === "Duplicate"){
          message.reply("looks like image with the same title already exists.");
          return;
        }
        // if(status == 200) ...
      });
    }
    // If none of given commands founds it will search for the image.
    else {
      
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
    helpMessage += "I expect you to write direct image URL (should finish with ";
    for(var i = 0; i < supportedFormats.length; i++){
      helpMessage += supportedFormats[i] + " ";
    }
    helpMessage += ") as last parameter so I can parse as long and as many words containing title as you wish 😊\n";
    helpMessage += "If you think that you made a mistake, you can always remove your image (`!image remove help`) and add a new one!\n";
    helpMessage += "\nAh, and yes, you can not add an image which will start with \"help\", \"http://\", \"https://\" or \"www.\" in your title :P. In case you were wondering...";
  }
  else{
    return "sorry, but I know nothing about this command. Please, check `!image help` :c";
  }
  return "here's how you can use !image " + type + ".\n" + helpMessage;
}

function GenerateEmbedMessage(message, imageURL, title){
  let embedColor = 10070709;
  if(message.guild.me.displayColor !== 0){
    embedColor = message.guild.me.displayColor;
  }
  var embedMessage = { 
    embed:
      {
        color: embedColor,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        title: "Responded with \"" + title +"\" image",
        image: {
          url: imageURL,
          height: 720,
          width: 1280
        }
    }
  };
}

function IsURLSupported(lastArgument){
  var splittedArgument = lastArgument.split(".");
  for(var i = 0; i < supportedFormats.length; i++){
    if(lastArgument.includes(supportedFormats[i])){
      return true;
    }
  }
}
