require('module-alias/register')
require('dotenv').config()

const { Client } = require('discord.js')

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

const commandBase = require('@root/commands/command-base')
const initCommands = require('@root/commands/init-commands')
const initFeatures = require('@root/features/init-features')

const cache = {}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`)

    await commandBase.loadPrefixes(client, cache)
    await initCommands(client, cache)
    await initFeatures(client, cache)
})

// client.setMaxListeners(11)
client.login(process.env.DISCORD_TOKEN)