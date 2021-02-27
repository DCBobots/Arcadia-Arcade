module.exports = {
    commands: [],
    description: `Default description.`,
    expectedArgs: `<arg 1> <arg 2>`,
    cooldown: -1,
    minArgs: 0,
    maxArgs: null,
    permissions: [],
    roles: [],
    callback: async (message, arguments, text, client, cache) => {
        message.channel.send(`Command Template`)
    }
}