module.exports = {
  OnBotAdded: function(botClient, serverData){
    console.log(`New guild joined: ${serverData.name} (id: ${serverData.id}). This guild has ${serverData.memberCount} members!`);
    botClient.user.setGame(`on ${botClient.guilds.size} servers`);
  },
  OnBotRemoved: function(botClient, serverData){
    console.log(`I have been removed from: ${serverData.name} (id: ${serverData.id})`);
    botClient.user.setGame(`on ${botClient.guilds.size} servers`);
  },
  OnAddUserCMD: function(){
    console.log("Attempting to add user");
  }
};
