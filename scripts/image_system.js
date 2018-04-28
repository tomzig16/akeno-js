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
      // TODO
    }
  }
}

function ImageHelp(type){
  let helpMessage = ""
  if(type === "help"){
    helpMessage = "ImageHelp will be here soon";
  }
  else if(type === "add"){
    helpMessage = "Add command info will be here soon";
  }
  else{
    return "sorry, but I know nothing about this command. Please, check `!image help` :c";
  }
  return "here's how you can use !image " + type + ":\n" + helpMessage;
}