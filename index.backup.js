const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const {
    join
} = require("path");
const client = new Discord.Client();
global.prefix = undefined;

var mysql = require("mysql"),
db = mysql.createConnection({
    host:  process.env.MYSQL_SERVER,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    charset: "utf8mb4"
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", guild => {
    let serverInfo = { 
        name: guild.name,
        id: guild.id,
        prefix: "!"
    };
    let data = JSON.stringify(serverInfo);
    fs.writeFileSync('config/' + guild.id + '.json', data);

    console.log("Joined a new guild: " + guild.name);
    console.log("Joined a new guild: " + guild.id);
});

client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    console.log("Left a guild: " + guild.id);
})

client.on('message', message => {
    let rawdata = fs.readFileSync('config/'+ message.guild.id + '.json');
    let serverinfodata = JSON.parse(rawdata);
    global.prefix = serverinfodata.prefix;

    // to prevent dm cmd exec
    if (message.channel.type == "dm") {
        message.reply(`<@${message.author.id}>, bawal DM yan kapatid. - PotatoRuisu`);
        return;
    };

    if (message.author.bot) return;
    if (message.content.startsWith(global.prefix) == false || !message.content.slice(global.prefix.length).trim().split(/ +/g).shift().toLowerCase() == true) return;

    const args = message.content.slice(global.prefix.length).trim().split(/ +/g);
    const commandname = args[0].toLowerCase();


    const commandFiles = fs.readdirSync(join(__dirname, "cmd")).filter((file) => file.endsWith(".js"));
    client.commands = new Discord.Collection();
    for (const file of commandFiles) {
        const command = require(join(__dirname, "cmd", `${file}`));
        client.commands.set(command.name, command);
    }

    const command =
        client.commands.get(commandname) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandname));

    try {
        command.execute(message, args);
    } catch (error) {
        message.reply("Command Not Found.").catch(console.error);
    }
});

client.login();