import { ChatInputCommandInteraction } from "discord.js";
import App from "../App";
import Command from "./Command";
import InfoCommand from "./InfoCommand";
import PingCommand from "./PingCommand";
import AccuracyCommand from "./AccuracyCommand";
import ProfileCommand from "./ProfileCommand";
import BeatmapCommand from "./BeatmapCommand";
import RankCommand from "./RankCommand";

export default class CommandManager {

    constructor(private _app: App) { }

    private toAdd: Command[] = [
        new AccuracyCommand(this._app.osuApi),
        new ProfileCommand(this._app.osuApi),
        new BeatmapCommand(this._app.osuApi),
        new RankCommand(this._app.osuApi),
        new PingCommand(),
        new InfoCommand(),
    ];

    readonly commands: Map<string, Command> = new Map<string, Command>(
        this.toAdd.map(command => [command.commandInfo.name, command])
    );

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);
        if (command == null) {
            await interaction.reply({
                content: ':x: Uh oh! It seems you\'ve encountered a command that isn\'t supposed to exist! Please contact us at `/info`.',
                ephemeral: true,
            });
            return;
        }

        await command.execute(interaction);
    }

}