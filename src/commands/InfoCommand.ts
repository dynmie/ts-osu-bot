import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, RESTPostAPIChatInputApplicationCommandsJSONBody, EmbedBuilder } from 'discord.js';
import Command from './Command';
import { version } from '../../config.json';

export default class InfoCommand implements Command {

    commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('info')
        .setDescription('Replies with information about this bot.')
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const client = interaction.client;

        const embed = new EmbedBuilder()
            .setTitle('Information')
            .setDescription(`*Running ${client.user!.username} v${version}*\nThis bot is under active development.`)
            .setTimestamp()
            .addFields(
                { name: 'Developer', value: 'Dynmie#1173', inline: true, },
                { name: 'Tag', value: client.user!.tag, inline: true, },
                { name: 'Language', value: 'JavaScript', inline: true, },
                { name: 'Servers', value: `Total servers: ${client.guilds.cache.size}`, inline: true, },
                { name: 'Invite', value: 'Contact Dynmie#1173', inline: true, },
            )
            .setFooter({ text: client.user!.username, iconURL: `https://cdn.discordapp.com/avatars/${client.user!.id}/${client.user!.avatar}.png?size=64`, })
            .setColor('Blue')
            .toJSON()

        await interaction.reply({ embeds: [embed] }).catch(console.error);
    }

}
