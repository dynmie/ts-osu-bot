import App from "src/App";
import Command from "./Command";
import { RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";

export default class AccuracyCommand implements Command {

    constructor(private _app: App) { }

    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName('accuracy')
        .setDescription('Get the accuracy for a player')
        .addStringOption(option => option
            .setRequired(true)
            .setName('player')
            .setDescription('The player to search for'))
        .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const osuApi = this._app.osuApi;
        
        const player = interaction.options.getString('player')!;

        await interaction.deferReply().catch(console.error);

        await osuApi.getUser({ u: player }).then(async user => {
            await interaction.editReply({ content: `:dart: ${user.name}'s accuracy is \`${Math.round((user.accuracy || 0) * 100) / 100}%\`.` }).catch(console.error)
        }).catch(async () => {
            interaction.editReply({ content: ':x: That player was not found.' }).catch(console.error)
        })
    }

}