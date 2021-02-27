const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Display all commands and descriptions",
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle("Arcadia Arcade Help")
            .setColor("#F8AA2A");

        commands.forEach((cmd) => {
            helpEmbed.addField(
                `**${global.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
                `${cmd.description}`,
                true
            );
        });

        helpEmbed.setTimestamp();

        return message.channel.send(helpEmbed).catch(console.error);
    }
};