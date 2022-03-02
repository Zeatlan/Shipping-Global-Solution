const firebase = require('../../initFirebase');
const functions = require('../functions')

module.exports = (client, instance) => {
  client.on("guildMemberRemove", async (member) => {
    const { guild } = member;

    const chNotif = await firebase.firestore.collection('discord-notifications').doc('nouveau-membre').get();

    if(chNotif.empty || !chNotif) return;

    const channel = await guild.channels.fetch(chNotif.data().channel);

    if(!channel) return;

    const body = {
      description: `${member}, l'équipe S.G.S te souhaite une bonne continuation. 👋`,
      color: "DARK_BLUE"
    }

    const embed = functions.buildEmbed(body)

    channel.send({ embeds: [embed]})
  })
}