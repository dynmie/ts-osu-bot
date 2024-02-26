import { Routes, REST } from 'discord.js';
import { token, clientId, guildId } from '../config.json'
import App from './App';

const app = new App();
const commands = app.commandManager.commands;

const rest = new REST({ version: '10' }).setToken(token);

const cmds = [...commands.values()].map(command => command.commandInfo);

function deployCommands() {
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: cmds })
        .then(data => console.log(`Registered ${data} commands.`))
        .catch(console.error);
}

deployCommands();