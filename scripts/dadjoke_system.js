let serverControl = require('./db_controller.js');


module.exports = {

  ParseDadjokeParameters: function(message, args){ 
    ParseParameters(message, args);
  }
};

function ParseParameters(message, args){
  // quick hack to allow only me to subscribe
  serverControl.IsSenderBotAuthor(message.author.id, result => {
    if(result === false) {
      return;
    }
  });

  for(var i = 0; i < args.length; i++){
    args[i] = args[i].replace("\"", "");
    args[i] = args[i].replace("'", "");
    args[i] = args[i].replace("`", "");
  }

  if(args.length < 1 || args[0] === "help"){
    // message.reply(""); for now ignore this (add proper right later on)
    return;
  }
  if(args[0] === "addj" && args.length > 1) {
    serverControl.AddDadjoke(message.content.split(/```/)[1])
  }
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
