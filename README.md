# Akeno

Akeno is a lovely bot who is ready to track your users ratings. You can invite this bot to your server by following [this link](https://discordapp.com/oauth2/authorize?client_id=429672169203695616&scope=bot)! 

**Warning: bot is still in development, which means that any data saved durnig WIP time may and most likely will be lost**.

## About Akeno

At this very moment Akeno keeps ranking of the server members. If you invite bot to your server, make sure to add your server to the database. You can do that by typing `!addserver` command. Every server member has to manually join the system by typing `!join_h` command. 

### User honoring system

System uses points, which are called "_honor points_" to rank each user. User can get honor points only from other users. If user wants to honor any server member he can do it with several commands (watch commands section). **Both, sender and receiver, must be registered in the database**. I decided not to force anyone and not to save any data without anyone's aknowledgement, so **each member in order to honor or be honored has to join the system manually, by typing** `!join_h` **command**. 

Each user has three pools for honors: pats, thanks and honors - how many time user was honored and what type of honor, and one more pool of how many spare honors he can give to others. Only _pats_, _thanks_ and _honors_ are added when printing total number honor. These can not be used as _spare honors_ to spend in order to honor other people. Spare honors never mix into previously mentioned honors as well. 

![Akeno responds to !status](https://media.discordapp.net/attachments/435533207371251737/435539135441403925/unknown.png)

When user gives someone honor points those points are removed from sender's "_spare points_" pool and given to receiver's "_honor points_" pool.

User can add spare points to share on daily basis by typing `!collect` command.

### Future

As this bot is still in development, more features are about to be added. You can track Akeno development state in [This trello link](https://trello.com/b/UhXzC8sp/akeno-discord-bot-progress)

## Currently available commands

There are a lot of commands and features planned to be made. Here are some you currently can try out yourself!

### Management

* `!addserver` - adds server to the database. This command is esential and can be executed only by server owner
* `!join_h` - adds user to the database. User can not honor and be honored if he or honoring target is not registered in database

### Honor sharing

All honoring commands accept both - mention (`!pat @The Sith#4143`) and name string (`!pat sith`).
* `!pat [user]` -  gives _[user]_ **1** honor point
* `!thank [user]` - gives _[user]_ **5** honor points
* `!honor [user] [amount]` - gives _[user]_ certain _[amount]_ of points
* `!collect` - get _spare honor points_ which are used for honoring others 

### Misc

* `!help` - shows list of available commands (not implemented yet)
* `!status` - Akeno tells how many honor points you have and how many honor points you can give

#

## Other questions and info

Here are some details which might be interesting. 
* Bot is currently running on my raspberry pi and it is located in Easter Europe. Keep that in mind if you experience any latency.
* Bot is written in [Discord.js](https://discord.js.org) and uses MySQL database
* Q: What data is actually stored?</br>
  A: Database does not save any private information. All the information is accessible to user, server owner and Akeno developers.<br/>Database is created with this code: [/creating_db.ddl file](https://github.com/tomzig16/akeno-js/blob/master/creating_db.ddl). Here's a picture of tables and columns:
  ![Data relations](https://media.discordapp.net/attachments/435533207371251737/435533221795463169/unknown.png)<br/>
  Although, with new features and changes introduced in bot's functionality, this graph may and most likely will be changed later.
