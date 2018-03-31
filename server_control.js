function OnBotAdded(botClient, serverData){
    console.log(`New guild joined: ${serverData.name} (id: ${serverData.id}). This guild has ${serverData.memberCount} members!`);
    botClient.user.setGame(`on ${botClient.guilds.size} servers`);
}

function OnBotRemoved(serverData){
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
}

function OnAddUserCMD(){
    console.log("Attempting to add user");
}