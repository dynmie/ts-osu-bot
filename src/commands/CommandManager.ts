import { ChatInputCommandInteraction } from "discord.js";
import App from "../App";
import Command from "./Command";
import InfoCommand from "./InfoCommand";
import OsuCommand from "./OsuCommand";
import PingCommand from "./PingCommand";

export default class CommandManager {

    constructor(private _app: App) {}

    private toAdd: Command[] = [
        new OsuCommand(this._app),
        new PingCommand(),
        new InfoCommand(),
    ];

    commands: Map<string, Command> = new Map<string, Command>(this.toAdd.map(command => [command.commandInfo.name, command]));

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);
        if (command == null) {
            interaction.reply({
                content: ':x: Uh oh! It seems you\'ve encountered a command that isn\'t supposed to exist! Please contact us at `/info`.',
                ephemeral: true,
            }).catch(console.error)
            return;
        }

        await command.execute(interaction);
    }
}