const firebase = require('../../initFirebase');
const functions = require('../functions')

module.exports = (client, instance) => {
  client.on("guildMemberAdd", async (member) => {
    const { guild } = member;

    const chNotif = await firebase.firestore.collection('discord-notifications').doc('nouveau-membre').get();

    if(chNotif.empty || !chNotif) return;

    const channel = await guild.channels.fetch(chNotif.data().channel);

    if(!channel) return;

    const body = {
      description: `Bonjour ${member}, l'équipe S.G.S te souhaite la bienvenue sur son Discord 😉👍 !\n\nN'hésite pas à t'inscrire sur notre site web.`,
      image: "https://images-ext-1.discordapp.net/external/cuOfTGIcAHQodEauaEkPxwcLogFmbM1GTxgHmgKdW84/https/cdn-longterm.mee6.xyz/plugins/commands/images/880858431874035752/3ed054a5bdfc8454a14eb2f08295efe615eb965808a65dd0dbcfaf5911aae43e.png"
    }

    const embed = functions.buildEmbed(body)

    channel.send({ embeds: [embed]})
  })
}