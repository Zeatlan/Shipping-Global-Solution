const { MessageActionRow, MessageButton, MessageEmbed, Constants } = require('discord.js');
const discord = require('./discordmain');

// Verify user identity
async function verifyIdentity(userTag, username, guildID) {
  try{
    const guild = await discord.client.guilds.fetch(guildID);
    const guildMembers = await guild.members.fetch();
    const user = guildMembers.find(gm => gm.user.tag === userTag).user;

    // Message Embed
    // const attachment = new MessageAttachment('~/assets/img/logo.png');
    
    const embed = new MessageEmbed({
      color: "#EB459E",
      title: "Bienvenue sur Shipping Global Solution",
      description: `Vous vous êtes inscrit sur **Shipping Global Solution** sous le pseudo de **${username}**, pour terminer votre inscription merci de valider ce message.`,
    });

    // Create interaction button
    const row = new MessageActionRow().addComponents([
      new MessageButton().setCustomId('validate').setLabel(`Valider le compte`).setStyle('SUCCESS'),
      new MessageButton().setCustomId('cancel').setLabel(`Ne pas valider`).setStyle('DANGER'),
    ]);

    // create DM
    const mpChannel = await user.createDM();
    await mpChannel.send({ 
      embeds: [embed],
      components: [row],
    });
  }catch(err) {
    console.error(err);
    throw err
  }
}

// Reset password
async function resetPasswordConfirmation(discordUser, user, profileUrl) {
  try{
    // Message Embed
    const embed = new MessageEmbed({
      color: "#EB459E",
      title: "Shipping Global Solution",
      description: '```Bonjour '+ user.username +', vous avez fait une demande de réinitialisation de votre mot de passe sur notre site web, merci de confirmer votre action ci-dessous.```',
      author: {
        name: user.username,
        url: profileUrl,
        avatar: user.avatar
      }
    });

    // Create interaction button
    const row = new MessageActionRow().addComponents([
      new MessageButton().setCustomId('resetPassword').setLabel(`Réinitialiser mon mot de passe`).setStyle('SUCCESS'),
      new MessageButton().setCustomId('cancelResetPassword').setLabel(`Annuler`).setStyle('DANGER'),
    ]);

    // create DM
    const mpChannel = await discordUser.createDM();
    await mpChannel.send({ 
      embeds: [embed],
      components: [row],
    });
  }catch(err) {
    console.error(err);
    throw err
  }

}

function getChannelFromMention(mention) {
  if(!mention) return;

  if(mention.startsWith('<#') && mention.endsWith('>')) {
    mention = mention.slice(2, -1)
    
    return discord.client.channels.cache.get(mention);
  }
}

// body = req.body
function buildEmbed(body) {
  const embed = new MessageEmbed({ 
    description: body.description,
    color: body.color ? Constants.Colors[body.color] : Constants.Colors.AQUA,
  })

  if(body.title) embed.setTitle(body.title);
  if(body.thumbnail) embed.setThumbnail(body.thumbnail);
  if(body.url) embed.setURL(body.url)
  if(body.author) {
    embed.setAuthor({
      name: body.author.name,
      iconURL: (body.author.avatar) ? body.author.avatar : null,
      url: (body.author.url) ? body.author.url : null,
    })
  }
  if(body.footer){ 
    embed.setFooter({
      text: body.footer.value, 
      iconURL: (body.footer.link) ? body.footer.link : null,
    })
  } 
  if(body.image) embed.setImage(body.image)

  if(body.fields) {
    body.fields.forEach(field => {
      let inline = true;
      if(field.isOneBlock) inline = false;

      embed.addField(field.name, field.value, inline);
    })
  }

  return embed;

}

// Send message to channel
async function sendMessage(channelID, msg) {
  try {
    const channel = await discord.client.channels.fetch(channelID)
    await channel.send(msg)
  }catch(err) {
    console.error(err)
    throw err
  }
}

// Send embed
async function sendEmbed(embed, { channelID, userID }) {
  try {
    // Send to channel
    if(channelID) {
      const channel = await discord.client.channels.fetch(channelID);
      await channel.send({ embeds: [embed] })
    }

    // Send to user
    if(userID) {
      const user = await discord.client.users.fetch(userID);
      await user.send({ embeds: [embed] })
    }
  }catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = {
  verifyIdentity,
  resetPasswordConfirmation,
  getChannelFromMention,
  buildEmbed,
  sendMessage,
  sendEmbed,
}