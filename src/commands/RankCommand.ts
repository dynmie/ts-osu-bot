import App from "src/App";
import Command from "./Command";
import { RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";

export default class RankCommand implements Command {

    constructor(private _app: App) { }

    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get the current rank for the specified player')
        .addStringOption(option => option
            .setRequired(true)
            .setName('player')
            .setDescription('The player to search for'))
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const osuApi = this._app.osuApi;

        const playerName = interaction.options.getString('player')!;

        await interaction.deferReply();

        const player = await osuApi.getUser({ u: playerName }).catch(() => null);
        if (player == null) {
            await interaction.editReply({ content: ':x: That player was not found.' });
            return;
        }

        await interaction.editReply({ content: `:dart: **${player.name}**'s rank is **${player.pp.rank != null ? '#' + player.pp.rank : 'Unranked'}**.` });
    }

}