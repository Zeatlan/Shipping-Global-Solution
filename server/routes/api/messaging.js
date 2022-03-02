const express = require('express')
const router = express.Router()
const functions = require('../../discordhandling/functions')

// Send simple message in channel
router.post('/message/:channelID', async (req, res) => {
  try {
    const channelID = req.params.channelID

    await functions.sendMessage(channelID, req.body.message)
    res.status(200).json({ message: 'Message Posted' })
  }catch(err) {
    res.status(500).json(err)
  }
})

// Send embed in channel
router.post('/embed/:channelID', async (req, res) => {
  try{
    const channelID = req.params.channelID 

    const embed = functions.buildEmbed(req.body);
    
    await functions.sendEmbed(embed, { channelID })
    res.status(200).json({ message: 'Embed Posted' })
  } catch(err) {
    res.status(500).json(err)
  }
})

// Send embed to user
router.post('/embed/user/:userID', async (req, res) => {
  try {
    const userID = req.params.userID
    const embed = functions.buildEmbed(req.body)

    await functions.sendEmbed(embed, { userID })

    res.status(200).json({ message: 'Private embed posted'})
  }catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router;