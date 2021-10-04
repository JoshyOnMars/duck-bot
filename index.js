const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, GuildMember } = require('discord.js');
require("dotenv").config();
const fetch = require("node-fetch")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();
client.cooldowns = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`${command.name}.js loaded!`);
}

client.on('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async message => {
	client.prefix = "-";
	if (!message.content.startsWith(client.prefix) || message.author.bot) return;

	const args = message.content.slice(client.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
	
	if(!command) return;
	
	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
    	cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    		if (now < expirationTime) {
        	const timeLeft = (expirationTime - now) / 1000;
        	return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
    		}
 	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		client.commands.get(commandName).execute(message, args, client)
		
		console.log(`Command: ${commandName} has been used.`)
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
	});

client.login(process.env.DISCORD_TOKEN);
