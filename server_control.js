module.exports = {
  OnBotAdded: function(botClient, serverData){
    console.log(`New guild joined: ${serverData.name} (id: ${serverData.id}). This guild has ${serverData.memberCount} members!`);
    botClient.user.setGame(`on ${botClient.guilds.size} servers`);
  },
  OnBotRemoved: function(serverData){
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
  },
  OnAddUserCMD: function(){
    console.log("Attempting to add user");
  }
};
