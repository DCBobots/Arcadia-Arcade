const path = require('path')
const fs = require('fs')

const { MessageEmbed } = require('discord.js')
const embed = new MessageEmbed()

const defaultPrefix = process.env.PREFIX

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) throw new Error(`Unknown permission node "${permission}"`)
    }
}

module.exports = (client, options, cache) => {
    let cacheCooldownCommands = []
    
    let {
        commands,
        expectedArgs,
        permissionError = `You do not have enough permission to run this command!`,
        cooldown = -1,
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        roles = [],
        servers = [],
        channels = [],
        callback
    } = options

    if (typeof commands === `string`) commands = [commands]

    if (permissions.length) {
        if (typeof permissions === `string`) permissions = [permissions]
        validatePermissions(permissions)
    }

    if (roles.length) {
        if (typeof roles === `string`) roles = [roles]
    }

    client.on('message', async (message) => {
        const { author, member, content, channel, guild } = message
        if (author.bot || !message.guild) return
        let prefix = cache[`prefix-${guild.id}`] || defaultPrefix

        for (const command of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${command.toLowerCase()}`)) {

                // Check permission and roles
                if (!roles.length) {
                    if (permissions.length) {
                        for (const permission of permissions) {
                            if (!member.hasPermission(permission)) {
                                embed.setDescription(permissionError)

                                channel.send({
                                    content: `> **No Permission • [** ${author.username}#${author.discriminator} **]**`,
                                    embed: embed
                                })

                                return
                            }
                        }
                    }
                } else {
                    for (const role of roles) {
                        const r = guild.roles.cache.find(r => r.name === role)

                        if (!r) {
                            embed.setDescription(`Something went wrong please contact daishitie#4585!`)

                            channel.send({
                                content: `> **Internal Error • [** ${author.username}#${author.discriminator} **]**`,
                                embed: embed
                            })

                            return
                        }

                        if (permissions.length) {
                            for (const permission of permissions) {
                                if (!member.hasPermission(permission) && !member.roles.cache.has(r.id)) {
                                    embed.setDescription(permissionError)

                                    channel.send({
                                        content: `> **No Permission • [** ${author.username}#${author.discriminator} **]**`,
                                        embed: embed
                                    })
        
                                    return
                                }
                            }
                        } else {
                            if (!member.roles.cache.has(r.id)) {
                                embed.setDescription(`You must have the "${role}" role to use this command!`)

                                channel.send({
                                    content: `> **Missing Role • [** ${author.username}#${author.discriminator} **]**`,
                                    embed: embed
                                })
    
                                return
                            }
                        }
                    }
                }

                // Command cooldown
                // Format: guildid-memberid-command
                let cooldownId = `${guild.id}-${member.id}-${commands[0]}`
                if (cooldown > 0 && typeof cacheCooldownCommands[cooldownId] !== `undefined`) {
                    let time = new Date().getTime()
                    let seconds = cooldown - ((time - cacheCooldownCommands[cooldownId]) / 1000)

                    embed.setDescription(`You're using this command too often! Try again in ${seconds.toFixed(2)} seconds!`)

                    channel.send({
                        content: `> **Command Cooldown • [** ${author.username}#${author.discriminator} **]**`,
                        embed: embed
                    })

                    return
                }

                const arguments = content.split(/[ ]+/)
                arguments.shift()

                if (
                    arguments.length < minArgs ||
                    (
                        maxArgs !== null &&
                        arguments.length > maxArgs
                    )
                ) {
                    embed.setDescription(`Use ${prefix}${command} ${expectedArgs}`)

                    channel.send({
                        content: `> **Incorrect Syntax • [** ${author.username}#${author.discriminator} **]**`,
                        embed: embed
                    })

                    return
                }

                if (cooldown > 0) {
                    cacheCooldownCommands[cooldownId] = message.createdTimestamp
                    setTimeout(() => {
                        cacheCooldownCommands.splice(cooldownId, 1)

                        cacheCooldownCommands = cacheCooldownCommands.filter((string) => {
                            string !== cooldownId
                        })
                    }, 1000 * cooldown)
                }

                callback(
                    message,
                    arguments,
                    arguments.join(` `),
                    client,
                    cache
                )

                return
            }
        }
    })
}

module.exports.loadPrefixes = async (client, cache) => {
    const readPrefixes = dir => {
        fs.readdirSync(path.join(__dirname, dir)).forEach(file => {
            let rawresult = fs.readFileSync(path.join(__dirname, dir, file))
            let result = JSON.parse(rawresult)

            if (result.id !== undefined && result.prefix !== undefined) {
                cache[`prefix-${result.id}`] = result.prefix
                console.log(`${result.name} (${result.id}): ${result.prefix}`)
            }
        })
    }

    readPrefixes(path.join(`..`, `servers`))
}