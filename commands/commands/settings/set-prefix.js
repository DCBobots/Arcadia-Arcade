require('dotenv').config()
const fs = require('fs')

const { MessageEmbed } = require('discord.js')
const embed = new MessageEmbed()

module.exports = {
    commands: ['setprefix'],
    description: `Change the prefix of the bot.`,
    expectedArgs: `<new prefix>`,
    cooldown: 15,
    minArgs: 1,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    callback: async (message, arguments, text, client, cache) => {
        const { author, guild } = message

        cache[`prefix-${guild.id}`] = text

        let info = {
            name: guild.name,
            id: guild.id,
            prefix: text
        }

        let data = JSON.stringify(info)
        fs.writeFileSync(`./servers/${guild.id}.json`, data)

        embed.setColor('RANDOM')
            .setDescription(`The new bot prefix is "${text}".`)
            .setTimestamp()

        message.channel.send({ 
            content: `> **Prefix • [** ${author.username}#${author.discriminator} **]**`,
            embed: embed 
        })
    }
}