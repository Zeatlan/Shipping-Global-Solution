// --------------
// Setup Discord
const path = require('path')
const WOKCommands = require('wokcommands')
const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
// --------------
const firebase = require('../initFirebase.js');

// --------------
// id
// [ TEST ]
const guildId = "868516388883554325";
// [ OFFICIAL ]
// const guildId = "880858431874035752";
// --------------

// onReady
client.on('ready', async () => {

  /* eslint-disable */
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: '868516388883554325'
  })

  // Cache users in guild
  const guild = await client.guilds.fetch(guildId);  
  await guild.members.fetch();
  console.log('\x1b[35m', guild.name, '\x1b[0m', `> Mise en cache des membres du serveur`)
  
  console.log('\x1b[1m', client.user.tag, '\x1b[32m', ' est en ligne !', '\x1b[0m'); 

});

client.login(process.env.BOTKEY);

exports.client = client;