// Diswyn, a general-purpose, modular and self-hostable Discord bot
// Copyleft: 2021, Lintine
// License: GPLv3
//
// This file is part of Diswyn.
//
// Diswyn is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Diswyn is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Diswyn.  If not, see <https://www.gnu.org/licenses/>.
//
//------------------------------------------------------------------------------
const Discord = require('discord.js');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const { DISCORD_TOKEN, ADDITIONAL_OWN_PERMS } = require('./env.json');
const { status } = require('./data.json');

const client = new Discord.Client();
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log("Logged in as");
    console.log(`| Username: ${client.user.username}`);
    console.log(`| ID: ${client.user.id}`);
    console.log(`| Status: ${status}`);
    console.log("-------------------------------");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Connecting to the Discord API
client.login(token);