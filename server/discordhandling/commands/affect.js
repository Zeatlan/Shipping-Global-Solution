const { MessageEmbed, Constants } = require('discord.js');
const firebase = require('../../initFirebase.js');
const functions = require('../../discordhandling/functions')

// Permet d'affecter des channels pour qu'ils soient notifiés.
// --------------------------
// Liste des notifications :
//      nouveau-membre
//      mission-approuvee
//      mission-speciale
//      mission-contrat
// --------------------------
// /affect mission-speciale #mission-speciale

const LIST_NOTIFICATIONS = [
  'nouveau-membre',
  'mission-approuvee',
  'mission-speciale',
  'mission-contrat'
]

const TEXT_NOTIFICATIONS = [
  'un nouvel utilisateur s\'inscrira sur le site',
  'une mission sera approuvée',
  'une nouvelle mission spéciale sera disponible',
  'une nouvelle mission contrat sera disponible'
]

module.exports = {
  category: 'Utiles',
  description: 'Permet d\'affecter des channels pour qu\'ils soient notifiés lors d\'un ajout sur le site.',

  expectedArgs: '<notification> <channel>',
  minArgs: 2,
  maxArgs: 2,
  syntaxError: 'Usage incorrect! Utilisez par exemple : `/affect mission-speciale #mission-speciale` (notifiez le channel)',

  permissions: ['ADMINISTRATOR'],

  guildOnly: true,
  cooldown: '5s',
  slash: true,
  testOnly: true,

  callback: async ({ args, interaction }) => {
    // Arguments
    const notification = args[0].toLowerCase();
    const channel = functions.getChannelFromMention(args[1]); 
    // Embed
    const errorEmbed = new MessageEmbed({
      title: 'Erreur',
      color: Constants.Colors.RED
    })

    if(!channel) {
      errorEmbed.setDescription(`Erreur dans le channel spécifié, merci de mentionner le channel.`);

      return interaction.reply({embeds: [errorEmbed]})
    }

    if(interaction) {
      const idx = LIST_NOTIFICATIONS.findIndex(el => el === notification);

      if(idx > -1) {   
        // Embed
        const embed = new MessageEmbed({
          title: 'Succès',
          description: `Je vous notifierai quand ${TEXT_NOTIFICATIONS[idx]} dans le channel ${channel}!`,
          color: Constants.Colors.GREEN
        })

        // Firestore
        await firebase.firestore.collection('discord-notifications').doc(notification).set({ channel: channel.id })
        interaction.reply({ embeds: [embed] })
      }else {
        errorEmbed
          .setDescription(`**${args[0]}** n'existe pas en tant que notification, voici les notifications que vous pouvez mettre : ${LIST_NOTIFICATIONS.map(n => '`'+n+'`').join(', ')}`)
        interaction.reply({embeds: [errorEmbed]})
      }
    }
  } 
}