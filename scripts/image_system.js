let serverControl = require('./db_controller.js');
var supportedFormats = ["png", "jpg", "jpeg", "gif", "webm"];
var prefixes = ["www", "http://", "https://"];

module.exports = {

  ParseParameters: function(message, args){
    for(var i = 0; i < args.length; i++){
      args[i] = args[i].replace("\"", "");
      args[i] = args[i].replace("'", "");
      args[i] = args[i].replace("`", "");
    }

    if(args.length < 1 || args[0] === "help"){
      message.reply(ImageHelp("help"));
      return;
    }
    // Print help for each command
    if(args.length >= 2 && args[1] === "help"){
      message.reply(ImageHelp(args[0]));
      return;
    }
    // List all images available for the server
    if(args[0] == "list"){
      PrintInteractibleList(message);
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
      let title = "";
      for(var i = 0; i < args.length; i++){
        title += args[i] + " ";
      }
      serverControl.GetImageURL(message.guild.id, title.trim(), result =>{
        if(result === "Server not found"){
          message.reply("sorry, seems like I don't know anything about this server...");
        }
        else if(result == null){
          message.reply("looks like image title you entered does not exist in my database.");
        }
        else {
          let embedMessage = GenerateEmbedMessage(message, result.url, title.trim());
          message.reply(embedMessage);
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
  return embedMessage;
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

function PrintInteractibleList(message){
  // Create a reaction collector
  serverControl.GetAvailableImages(message.guild.id, images => {
    // Generate message
    availableImages = GetStringOfImages(images, 0);   
    const activeDuration = 60000;
    message.channel.send(availableImages).then(
      sentMessage => {
        if(images.length > 10){
          sentMessage.react('⬅').then(sentMessage.react('➡'));
        }
        const filter = (reaction, user) => {
          return (reaction.emoji.name === '⬅' ||  reaction.emoji.name === '➡') 
          && user.id === message.author.id;
        };
        const collector = sentMessage.createReactionCollector(filter, { time: activeDuration });
        var maxPages = Math.trunc(images.length / 10);
        var currentPage = 0;
        collector.on('collect', (reaction, reactionCollector) => {
          console.log(`Collected ${reaction.emoji.name}`);
          if(images.length > 10){
            if(reaction.emoji.name === '⬅'){
              if(currentPage > 0){ currentPage--; }
            }
            else if(reaction.emoji.name === '➡'){
              if(currentPage < maxPages){ currentPage++; }
            }

            availableImages = GetStringOfImages(images, currentPage * 10);
            sentMessage.edit(availableImages);
            sentMessage.clearReactions()
            .then(() => {
              sentMessage.react('⬅');
              sentMessage.react('➡');
            });
          }
        });
        collector.on('end', collected => {
          sentMessage.clearReactions();
        });  
      }
    );
  });

}

function GetStringOfImages(images, startIndex){
  var availableImages = "```";
  var lastPrintedIndex = 0;
  
  var maxPerPage = startIndex === 0 ? 10 : (Math.trunc(startIndex / 10) + 1) * 10;
  for(var i = startIndex;
     i < images.length && i < maxPerPage; i++){
    availableImages += i+1 + " " + images[i].title + "\n";
    lastPrintedIndex = i;
  }
  if(images.length > 10){
    availableImages += "\nTotal images available: " + images.length;
    var totalPages = Math.trunc(images.length / 10) + 1;
    var currentPage = Math.trunc(lastPrintedIndex / 10) + 1;
    availableImages += "\nPages: " + currentPage + "/" + totalPages;
  }
  availableImages += "```";
  return availableImages;
}
