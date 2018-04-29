let serverControl = require('./db_controller.js');
var supportedFormats = ["png", "jpg", "jpeg", "gif", "webm"];
var prefixes = ["www", "http://", "https://"];

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
      // In order to avoid problems check that title should not start with a name of an existing command
      let existingCommands = ["add", "help", "remove", "list"];
      for(var i = 0; i < existingCommands.length; i++){
        if(args[1] === existingCommands[i]){
          message.reply("sorry, image title can not start with the same keyword as an existing command, that will confuse me 😖");
          return;
        }
      }
      for(var i = 1; i < args.length - 1; i++){
        imageTitle += args[i] + " ";
      }
      if(imageTitle.length > 32){
        message.reply("oops, title is too long. Please try to stick to 32 symbols long titles ^^");
        return;
      }
      serverControl.InsertNewImage(message.guild.id, message.author.id, imageTitle.trim(), imageLink, status => {
        if(status === "Server not found"){
          message.reply("sorry, seems like I don't know anything about this server...");
        }
        if(status === "Duplicate"){
          message.reply("looks like image with the same title already exists.");
        }
        if(status == 200){
          message.reply("good news! I have successfully added this image to my database!\n" +
          "Now you can post it whenever you like with `!image " + imageTitle.trim() + "` command 😊")
        }
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
      helpMessage += "`\"" + supportedFormats[i] + "\"` ";
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
  let containsFormat = false;
  for(var i = 0; i < supportedFormats.length; i++){
    if(splittedArgument[splittedArgument.length - 1] === supportedFormats[i]){
      containsFormat = true;
      break;
    }
  }
  if(containsFormat === false){
    return false;
  }
  for(var i = 0; i < prefixes.length; i++){
    if(splittedArgument[0].includes(prefixes[i])){
      return true;
    }
  }
  return false;
}
