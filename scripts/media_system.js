let serverControl = require('./db_controller.js');
var supportedImageFormats = ["png", "jpg", "jpeg", "gif"];
var supportedVideoFormats = ["webm", "mp4", "mov"];
var prefixes = ["www", "http://", "https://"];

module.exports = {

  ParseImageParameters: function(message, args){ 
    ParseParameters(message, "image", args);
  }, 
  ParseVideoParameters: function(message, args){ 
    ParseParameters(message, "video", args);
  }
};

function ParseParameters(message, typeName, args){
  let isImage = typeName === "image";
  let supportedFormats = isImage ? supportedImageFormats : supportedVideoFormats;
  for(var i = 0; i < args.length; i++){
    args[i] = args[i].replace("\"", "");
    args[i] = args[i].replace("'", "");
    args[i] = args[i].replace("`", "");
  }

  if(args.length < 1 || args[0] === "help"){
    message.reply(Help("help", typeName, supportedFormats));
    return;
  }
  // Print help for each command
  if(args.length >= 2 && args[1] === "help"){
    message.reply(Help(args[0], typeName, supportedFormats));
    return;
  }
  // List all images or videos available for the server
  if(args[0] == "list"){
    let getMediaFunction = isImage ? serverControl.GetAvailableImages : serverControl.GetAvailableVideos;
    PrintInteractibleList(message, typeName, getMediaFunction);
    return;
  }
  // Add !image args[0] commands here
  if(args[0] === "add"){
    if(args.length < 3){
      message.reply("sorry, you are missing something. Please, peek inside `!" + typeName + " add help`");
      return;
    }
    let imageLink = args[args.length - 1];
    if(!IsURLSupportedMediaFormat(imageLink, supportedFormats)){
      message.reply("looks like last argument was not a link to " + typeName + ".\n" + 
      "**Make sure that link is the last argument and it ends with supported format**" +
      "(for example " + (isImage ? `https://i.imgur.com/Di3z1Mc.gif` : `https://i.imgur.com/Ph8YOTT.mp4`) +  ") you can always consult !" + typeName + " add help ;) ");
      return;
    }
    let imageTitle = "";
    // In order to avoid problems check that title should not start with a name of an existing command
    let existingCommands = ["add", "help", "remove", "list"];
    for(var i = 0; i < existingCommands.length; i++){
      if(args[1] === existingCommands[i]){
        message.reply("sorry, " + typeName + " title can not start with the same keyword as an existing command, that will confuse me 😖");
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
    let insertFunction = isImage ? serverControl.InsertNewImage : serverControl.InsertNewVideo;
    insertFunction(message.guild.id, message.author.id, imageTitle.trim(), imageLink, status => {
      if(status === "Server not found"){
        message.reply("sorry, seems like I don't know anything about this server...");
      }
      if(status === "Duplicate"){
        message.reply("looks like " + typeName + " with the same title already exists.");
      }
      if(status == 200){
        message.reply("good news! I have successfully added this " + typeName + " to my database!\n" +
        "Now you can post it whenever you like with `!" + typeName + " " + imageTitle.trim() + "` command 😊")
      }
    });
  }
  // If none of given commands founds it will search for the image.
  else {
    let title = "";
    for(var i = 0; i < args.length; i++){
      title += args[i] + " ";
    }
    let getMediaFunction = isImage ? serverControl.GetImageURL : serverControl.GetVideoURL;
    getMediaFunction(message.guild.id, title.trim(), result =>{
      if(result === "Server not found"){
        message.reply("sorry, seems like I don't know anything about this server...");
      }
      else if(result == null){
        message.reply("looks like image title you entered does not exist in my database.");
      }
      else {
        if (isImage){
          let embedMessage = GenerateEmbedMessage(message, result.url, result.title);
          message.reply(embedMessage);
        } else {
          let videoMessage = GenerateVideoMessage(message, result.url, result.title);
          message.reply(videoMessage);
        }
      }
    });
  }
}

function Help(type, typeName, supportedFormats){
  let helpMessage = ""
  let typeNameUpperCase = typeName.charAt(0).toUpperCase() + typeName.slice(1);
  if(type === "help"){
    helpMessage = typeNameUpperCase + "Help will be here soon";
  }
  else if(type === "add"){
    helpMessage = "This command adds an " + typeName + " to my database so you later can simply access it by just giving me its title!\n";
    helpMessage += "Command format: `!" + typeName + " add [title] [" + typeName + "url]`\n";
    helpMessage += "I expect you to write direct " + typeName +" URL (should finish with ";
    for(var i = 0; i < supportedFormats.length; i++){
      helpMessage += "`\"" + supportedFormats[i] + "\"` ";
    }
    helpMessage += ") as last parameter so I can parse as long and as many words containing title as you wish 😊\n";
    helpMessage += "If you think that you made a mistake, you can always remove your " + typeName +" (`!" + typeName +" remove help`) and add a new one!\n";
    helpMessage += "\nAh, and yes, you can not add an " + typeName +" which will start with \"help\", \"http://\", \"https://\" or \"www.\" in your title :P. In case you were wondering...";
  }
  else if(type === "list"){
    helpMessage = "This command prints titles of available for your server " + typeName +"s. 10 " + typeName +"s per page and if you have more than 10 " + typeName +"s ";
    helpMessage += "message will automatically contain arrows which would scroll through pages. Only `!" + typeName +" list` author would be able to ";
    helpMessage += "interact with these controls.";
    helpMessage += "After 1 minute controls over that message will be gone, but it will not be removed.";
  }
  else{
    return "sorry, but I know nothing about this command. Please, check `!" + typeName +" help` :c";
  }
  return "here's how you can use !" + typeName +" " + type + ".\n" + helpMessage;
}

function VideoHelp(type){ 
  return Help(type, "video", supportedVideoFormats);
}

function ImageHelp(type){ 
  return Help(type, "image", supportedImageFormats);
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

function GenerateVideoMessage(message, videoUrl, title){
  let videoMessage = `\n${message.author.username} Responded with \"${title}\" video\n\n${videoUrl}`;
  return videoMessage;
}

function IsURLSupportedMediaFormat(lastArgument, supportedFormats){
  try {
    var splittedArgument = lastArgument.split(".");
    let containsFormat = false;
    for(var i = 0; i < supportedFormats.length; i++){
      if(splittedArgument[splittedArgument.length - 1].toLowerCase() === supportedFormats[i]){
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
  } catch (e){
    return false;
  }
  return false;
}

function IsURLSupportedImageFormat(lastArgument){
  return IsURLSupportedMediaFormat(lastArgument, supportedImageFormats);
}

function IsUrlSupportedVideoFormat(lastArgument){
  return IsURLSupportedMediaFormat(lastArgument, supportedVideoFormats);
}

function PrintInteractibleList(message, typeName, getAvailableMediaFunction){
  // Create a reaction collector
  getAvailableMediaFunction(message.guild.id, images => {
    // Generate message
    availableImages = GetStringOfMedia(images, typeName, 0);   
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
          if(images.length > 10){
            if(reaction.emoji.name === '⬅'){
              if(currentPage > 0){ currentPage--; }
            }
            else if(reaction.emoji.name === '➡'){
              if(currentPage < maxPages){ currentPage++; }
            }

            availableImages = GetStringOfMedia(images, typeName, currentPage * 10);
            sentMessage.edit(availableImages);
            // Clean reactions
            reaction.fetchUsers().then(users => {
              var reactedUsers = users.filter( user => { return user.id !== message.client.user.id; });
              reactedUsers.map((element) => reaction.remove(element));
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

function GetStringOfMedia(images, typeName, startIndex){
  var availableImages = "```";
  var lastPrintedIndex = 0;
  
  var maxPerPage = startIndex === 0 ? 10 : (Math.trunc(startIndex / 10) + 1) * 10;
  for(var i = startIndex; i < images.length && i < maxPerPage; i++){
    availableImages += i+1 + " " + images[i].title + "\n";
    lastPrintedIndex = i;
  }
  if(images.length > 10){
    availableImages += "\nTotal " + typeName + "s available: " + images.length;
    var totalPages = Math.trunc(images.length / 10) + 1;
    var currentPage = Math.trunc(lastPrintedIndex / 10) + 1;
    availableImages += "\nPages: " + currentPage + "/" + totalPages;
  }
  availableImages += "```";
  return availableImages;
}
