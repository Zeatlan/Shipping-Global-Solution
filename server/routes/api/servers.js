const express = require('express')
const router = express.Router()
const discordInfo = require('../../discordhandling/discordmain')

// Get all servers
router.get('', (req, res) => {
  try {
    const guilds = discordInfo.client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }))
    res.status(200).json(guilds)
  }catch(err) {
    res.status(500).json(err)
  }
})

// Get specific data from server with ID
router.get('/:serverID', async (req, res) => {
  try {
    const serverID = req.params.serverID
    const guild = await discordInfo.client.guilds.fetch(serverID)

    // Get Members 👪
    const memberlist = await guild.members.fetch()
    const members = memberlist.map(member => ({ id: member.id, idtype: "memberID", name: member.displayName }))

    // Get Channels 📜
    const channellist = await guild.channels.fetch()
    const channels = channellist.map(channel => ({ id: channel.id, idtype: "channelID", name: channel.name, channeltype: channel.type }))
    const channelsModified = channels.filter(channel => channel.channeltype === "GUILD_TEXT")

    // Create response 👍
    const response = { members, channels: channelsModified }
    res.status(200).json(response)
  }catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router;