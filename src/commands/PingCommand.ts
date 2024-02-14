import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import Command from './Command'

export default class PingCommand implements Command {

    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!')
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const client = interaction.client;
        await interaction.reply(`:ping_pong: Pong! Latency is \`${Date.now() - interaction.createdTimestamp}ms\`. Discord API latency is \`${client.ws.ping}ms\`.`)
    }

}
