import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, RESTPostAPIChatInputApplicationCommandsJSONBody, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import Command from './Command'
import App from '../App';
import { sanitize } from '../utils/message-utils';

export default class OsuCommand implements Command {

    constructor(private app: App) {}

    commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('osu')
        .setDescription('Gets information about osu! related things.')
        .addSubcommandGroup(group => group
            .setName('player')
            .setDescription('Gets information about a player.')
            .addSubcommand(subcommand => subcommand
                .setName('accuracy')
                .setDescription('Get the accuracy for a player.')
                .addStringOption(option => option
                    .setRequired(true)
                    .setName('player')
                    .setDescription('The player to search for')))
            .addSubcommand(subcommand => subcommand
                .setName('info')
                .setDescription('Get info for a player.')
                .addStringOption(option => option
                    .setRequired(true)
                    .setName('player')
                    .setDescription('The player to search for'))))
        .addSubcommandGroup(group => group
            .setName("beatmap")
            .setDescription("Gets information about a beatmap.")
            .addSubcommand(subcommand => subcommand
                .setName("info")
                .setDescription("Gets info about a beatmap.")
                .addStringOption(option => option
                    .setRequired(true)
                    .setName('id')
                    .setDescription('The map ID to get information from'))))
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const osuApi = this.app.osuApi;
        const client = this.app.client;

        switch (interaction.options.getSubcommandGroup()) {
            case 'player': {

                // GET PLAYER NAME
                const player = interaction.options.getString('player')!

                // SWITCH
                switch (interaction.options.getSubcommand()) {
                    case 'accuracy': {
                        await interaction.deferReply().catch(console.error)

                        osuApi.getUser({ u: player }).then(async user => {
                            await interaction.editReply({ content: `:dart: ${user.name}'s accuracy is \`${Math.round(user.accuracy * 100) / 100}%\`.` }).catch(console.error)
                        }).catch(async () => {
                            interaction.editReply({ content: ':x: That player was not found.' }).catch(console.error)
                        })
                        break
                    }

                    case 'info': {
                        await interaction.deferReply().catch(console.error)

                        osuApi.getUser({ u: player }).then(async user => {
                            const embed = new EmbedBuilder()
                                .setColor(Colors.Purple)
                                .setThumbnail(`http://s.ppy.sh/a/${user.id}`)
                                .setTimestamp()
                                .setTitle(`${sanitize(user.name)}'s Profile`)
                                .setFooter({ text: client.user!.username, iconURL: `https://cdn.discordapp.com/avatars/${client.user!.id}/${client.user!.avatar}.png?size=64`, })
                                .addFields(
                                    { name: 'Performance', value: `${Math.round((user.pp.raw || 0).valueOf())}pp`, inline: true },
                                    { name: 'Rank', value: `Global: #${user.pp.rank || 'Unranked'}\nCountry: #${user.pp.countryRank}`, inline: true },
                                    { name: 'Country', value: `:flag_${user.country.toLocaleLowerCase()}: ${user.country}`, inline: true },
                                    {
                                        name: 'Gameplay',
                                        inline: true,
                                        value: `Total Plays: ${user.counts.plays}\nSSH: ${user.counts.SSH}\nSS: ${user.counts.SS}\nSH: ${user.counts.SH}\nS: ${user.counts.S}\nA: ${user.counts.A}`
                                    },
                                    { name: 'Level', value: `Level ${Math.round(user.level)}`, inline: true },
                                    { name: 'Accuracy', value: user.accuracyFormatted, inline: true },
                                    { name: 'Score', value: `Ranked: ${user.scores.ranked}\nTotal: ${user.scores.total}`, inline: true },
                                    { name: 'More Info', value: `ID: ${user.id}`, inline: true },
                                )

                            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel('osu! Profile')
                                        .setURL(`https://osu.ppy.sh/users/${user.id || 2}`)
                                        .setEmoji({ id: '1023464297331957840', animated: false, })
                                        .setStyle(ButtonStyle.Link)
                                );

                            await interaction.editReply({ embeds: [embed], components: [actionRow], });
                        }).catch(async () => {
                            await interaction.editReply({ content: ':x: That player was not found.' });
                        })
                        break
                    }
                }
                break
            }

            case 'beatmap': {
                const mapId = interaction.options.getString('id')!

                switch (interaction.options.getSubcommand()) {
                    case 'info': {
                        await interaction.deferReply().catch(console.error)
                        const beatmaps = await osuApi.getBeatmaps({ b: mapId }).catch(() => null);

                        if (beatmaps == null) {
                            await interaction.editReply({ content: ':x: No beatmap with that id was found.', });
                            return;
                        }
                        const beatmap = beatmaps[0];

                        const embed = new EmbedBuilder()
                            .setTitle(`${sanitize(beatmap.title)} (${Math.round(beatmap.difficulty.rating * 100) / 100}:star:)`)
                            .setColor(Colors.Purple)
                            .setTimestamp()
                            .setFooter({ text: client.user!.username, iconURL: `https://cdn.discordapp.com/avatars/${client.user!.id}/${client.user!.avatar}.png?size=64`, })
                            .setDescription(`Artist: ${beatmap.artist || 'Unknown'}\nVersion: ${beatmap.version || 'Unknown'}`)
                            .setThumbnail(`https://b.ppy.sh/thumb/${beatmap.beatmapSetId}l.jpg`)
                            .addFields(
                                { name: 'Creator', value: (beatmap.creator || 'Unknown'), inline: true, },
                                //{ name: 'Status', value: (beatmap.approvalStatus || 'Unknown'), inline: true, },
                                { name: 'Song', value: `Length: ${beatmap.length.total || 0}s\nBPM: ${beatmap.bpm || 'Unknown'}`, inline: true, },
                                { name: 'Map', value: `Mode: ${beatmap.mode || 'Unknown'}\nCircles: ${beatmap.objects.normal || 'Unknown'}\nSliders: ${beatmap.objects.slider || 'Unknown'}\nSpinners: ${beatmap.objects.spinner || 'Unknown'}`, inline: true, },
                                { name: 'More Info', value: `Map ID: ${beatmap.id || 'Unknown'}\nSet ID: ${beatmap.beatmapSetId || 'Unknown'}`, inline: true, },
                            )

                        const actionRow = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Beatmap Download')
                                    .setURL(`https://osu.ppy.sh/beatmapsets/${beatmap.beatmapSetId}#osu/${beatmap.id}`)
                                    .setEmoji({ id: '1023464297331957840', animated: false, })
                                    .setStyle(ButtonStyle.Link)
                            )

                        await interaction.editReply({ embeds: [embed], components: [actionRow], });
                        break
                    }
                }
                break
            }
        }
    }

}

