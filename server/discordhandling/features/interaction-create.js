const { MessageEmbed, Constants } = require('discord.js');
const firebase = require('../../initFirebase');

module.exports = (client, instance) => {
  client.on("interactionCreate", async (interaction) => {
    
    if(!interaction.isButton()) return;
    // Message Embed
    const embed = new MessageEmbed({
      color: "#57F287",
      title: "Bienvenue sur Shipping Global Solution",
      thumbnail: { url: 'attachment://logo.png' },
    });

    if(interaction.deferred) {
      interaction.reply({ contents: 'Nous avons eu un problème interne, réessayez.'});
      await interaction.deferUpdate();
    }

    // --------------
    // Validate ✅  |
    // --------------
    if(interaction.customId === 'validate') {
      // --------------
      // Firestore
      const userSnap = await firebase.firestore.collection('users').where('discord', '==', interaction.user.tag).get();
      const user = userSnap.docs[0];
      const data = user.data();
      data.isValid = true;
      user.ref.update(data);
      // --------------
      
      embed.setDescription('Votre compte a été validé avec succès ! 🎉\nDéconnectez puis reconnectez-vous pour avoir tous les accès.');
    }
    // --------------


    // --------------------
    // Don't validate ❌ |
    // -------------------
    if(interaction.customId === 'cancel') {
      // --------------
      // Firestore
      const userSnap = await firebase.firestore.collection('users').where('discord', '==', interaction.user.tag).get();
      const user = userSnap.docs[0];
      await firebase.auth.deleteUser(user.ref.id);
      user.ref.delete();
      // --------------

      embed.setColor('#5865F2').setTitle('Inscription annulée').setDescription('Nous avons annulé l\'inscription, le compte a été supprimé avec succès. 🛑');
    }
    // --------------------


    // --------------------
    // Reset password ✅  |
    // -------------------
    if(interaction.customId === 'resetPassword') {
      // --------------
      // Firestore
      const userSnap = await firebase.firestore.collection('users').where('discord', '==', interaction.user.tag).get();
      const user = userSnap.docs[0];
      const randomPassword = Math.random().toString(36).slice(-8);
      await firebase.auth.updateUser(user.id, {
        password: randomPassword
      });
      // --------------
      
      embed.setDescription('```Votre mot de passe a été modifié avec succès !\nNouveau mot de passe : '+ randomPassword +'```');
    }
    // --------------


    // ------------------------
    // Don't reset pasword ❌ |
    // -----------------------
    if(interaction.customId === 'cancelResetPassword') {
      embed.setColor('#5865F2').setTitle('Réinitialisation annulée').setDescription('```La réinitialisation du mot de passe a été annulée avec succès.```');
    }
    // --------------------
    
    await interaction.update({ embeds: [embed], components: [] });
  })
}