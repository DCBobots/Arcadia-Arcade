const {
    MessageEmbed
} = require("discord.js");
require('dotenv').config();
const fs = require('fs');

module.exports = {
    name: "settings",
    aliases: ["s"],
    description: "Change the settings of the bot",
    execute(message, args) {
        console.log(args[2]);
        var cmd = args[1];
        if(args[2] != undefined) {
            var input = args[2].trim();
        }

        if (cmd == "prefix") {
            console.log(input);
            if(input != undefined) {
                let serverInfo = { 
                    name: message.guild.name,
                    id: message.guild.id,
                    prefix: input
                };
                let data = JSON.stringify(serverInfo);
                fs.writeFileSync('./config/' + message.guild.id + '.json', data);

                let embed = new MessageEmbed()
                    .setDescription("The New Bot Prefix is [" + input + "].")
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
                
                return message.channel.send(embed).catch(console.error);
            } else {
                let rawdata = fs.readFileSync('config/'+ message.guild.id + '.json');
                let serverinfodata = JSON.parse(rawdata);

                let embed = new MessageEmbed()
                    .setDescription("The Current Bot Prefix is [" + serverinfodata.prefix + "]. \n To change it please type your desired prefix at the same command. \n Ex: `!settings prefix <yourdesiredprefix>`")
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
                return message.channel.send(embed).catch(console.error);
            }
        }
    }
};