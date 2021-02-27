require('dotenv').config()
const fs = require('fs')

module.exports = async (client, cache) => {
    client.on('guildCreate', async (guild) => {
        // let info = {
        //     name: guild.name,
        //     id: guild.id,
        //     prefix: process.env.PREFIX
        // }

        // let data = JSON.stringify(info)
        // fs.writeFileSync(`servers/${guild.id}.json`, data)

        console.log(`Joined a guild: ${guild.name} (${guild.id})`)
    })
}