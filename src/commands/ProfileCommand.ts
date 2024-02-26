import Command from "./Command";
import { RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction, CacheType, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { sanitize } from "@utils/message-utils";
import { Api as OsuApi } from "node-osu";

export default class ProfileCommand implements Command {

    constructor(private _osuApi: OsuApi) { }

    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get info for a player.')
        .addStringOption(option => option
            .setRequired(true)
            .setName('player')
            .setDescription('The player to search for'))
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const client = interaction.client;

        const playerName = interaction.options.getString('player')!;

        await interaction.deferReply();

        const user = await this._osuApi.getUser({ u: playerName }).catch(() => null);

        if (user == null) {
            await interaction.editReply({ content: ':x: That player was not found.' });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Purple)
            .setThumbnail(`https://s.ppy.sh/a/${user.id}`)
            .setTimestamp()
            .setTitle(`${sanitize(user.name)}'s Profile`)
            .setFooter({ text: client.user!.username, iconURL: `https://cdn.discordapp.com/avatars/${client.user!.id}/${client.user!.avatar}.png?size=64`, })
            .addFields(
                { name: 'Performance', value: `${Math.round((user.pp.raw || 0).valueOf())}pp`, inline: true },
                { name: 'Rank', value: `Global: ${user.pp.rank != null ? '#' + user.pp.rank : 'Unranked'}\nCountry: ${user.pp.countryRank != null ? '#' + user.pp.countryRank : 'Unranked'}`, inline: true },
                { name: 'Country', value: `:flag_${user.country.toLocaleLowerCase()}: ${user.country}`, inline: true },
                {
                    name: 'Gameplay',
                    inline: true,
                    value: `Total Plays: ${user.counts.plays || 0}\nSSH: ${user.counts.SSH || 0}\nSS: ${user.counts.SS || 0}\nSH: ${user.counts.SH || 0}\nS: ${user.counts.S || 0}\nA: ${user.counts.A || 0}`
                },
                { name: 'Level', value: `Level ${Math.floor(user.level)}`, inline: true },
                { name: 'Accuracy', value: Math.round((user.accuracy || 0) * 100) / 100 + '%', inline: true },
                { name: 'Score', value: `Ranked: ${user.scores.ranked || 0}\nTotal: ${user.scores.total || 0}`, inline: true },
                { name: 'More Info', value: `ID: ${user.id}`, inline: true },
            );

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('osu! Profile')
                    .setURL(`https://osu.ppy.sh/users/${user.id || 2}`)
                    .setEmoji({ id: '1023464297331957840', animated: false, })
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.editReply({ embeds: [embed], components: [actionRow], });
    }

}