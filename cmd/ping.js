const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["ms"],
  description: "Ping the server",
  async execute(message) {

    var ping = Math.round(message.client.ws.ping);

    let embed = new MessageEmbed()
      .setDescription(`The Arcadia Arcade ping is ${ping} ms!`)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
    return message.channel.send(embed).catch(console.error);

  }
};