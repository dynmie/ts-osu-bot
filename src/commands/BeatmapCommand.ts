import Command from "./Command";
import { RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction, CacheType, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { Api as OsuApi } from "node-osu";
import { sanitize } from "@utils/message-utils";

export default class BeatmapCommand implements Command {

    constructor(private _osuApi: OsuApi) { }

    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName("beatmap")
        .setDescription("Get info about a beatmap")
        .addStringOption(option => option
            .setRequired(true)
            .setName('id')
            .setDescription('The map ID to get information from'))
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const client = interaction.client;

        const mapId = interaction.options.getString('id')!;
        await interaction.deferReply().catch(console.error);

        const beatmaps = await this._osuApi.getBeatmaps({ b: mapId }).catch(() => null);
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
            );

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Beatmap Download')
                    .setURL(`https://osu.ppy.sh/beatmapsets/${beatmap.beatmapSetId}#osu/${beatmap.id}`)
                    .setEmoji({ id: '1023464297331957840', animated: false, })
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.editReply({ embeds: [embed], components: [actionRow], });

    }

}