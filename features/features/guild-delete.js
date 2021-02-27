module.exports = async (client, cache) => {
    client.on('guildDelete', async (guild) => {
        console.log(`Left a guild: ${guild.name} (${guild.id})`)
    })
}