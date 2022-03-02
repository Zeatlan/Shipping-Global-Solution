const express = require('express')
const router = express.Router()
const functions = require('../../discordhandling/functions')

router.post('/user', async (req, res) => {
  try {
    await functions.verifyIdentity(req.body.userTAG, req.body.username, req.body.guildID)
    res.status(200).json({ message: `Vérification de ${req.body.userTAG}.` })
  }catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router