const express = require('express')
const router = express.Router()
const firebase = require('../../initFirebase.js');
const discordInfo = require('../../discordhandling/discordmain')
const functions = require('../../discordhandling/functions');

// Get Discord data from user
router.get('/:userID', async (req, res) => {
  try {
    const snapUser = await firebase.firestore.collection('users').doc(req.params.userID).get();
    if(snapUser.empty) {
      return res.status(200).json({ message: 'Nous n\'avons pas pas pu vous retrouver dans notre base de donnée.' })
    }

    const userData = snapUser.data();

    const discordUser = discordInfo.client.users.cache.find(u => u.tag.toLowerCase() === userData.discord.toLowerCase());
    
    if(discordUser) {
      res.status(200).json(discordUser)
    }else {
      res.status(200).json({ message: 'Vous n\'êtes pas présent sur notre serveur Discord.' })
    }
  }catch(err) {
    res.status(500).json(err)
  }
})

// Reset Password confirmation
router.post('/reset/:guildID', async (req, res) => {
  try {
    const guild = await discordInfo.client.guilds.fetch(req.params.guildID)
    const discordUser = guild.members.cache.find(member => member.user.tag === req.body.user.discord)

    await functions.resetPasswordConfirmation(discordUser, req.body.user, req.body.profile)
    res.status(200).json({ message: `Reset password` })
  }catch(err) {
    res.status(500).json(err)
  }
})

// Edit password
router.post('/password', async (req, res) => {
  try {
    await firebase.auth.updateUser(req.body.userID, {
      password: req.body.newPassword
    });
    res.status(200).json({ message: `${req.params.userID} a mis à jour son mot de passe.` })
  }catch(err) {
    res.status(500).json(err)
  }
})

// Delete user
router.post('/delete/', async (req, res) => {
  try {
    await firebase.auth.deleteUser(req.body.userID);
    res.status(200).json({ message: `${req.body.userID} a été supprimé de la base de donnée.` })
  }catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router