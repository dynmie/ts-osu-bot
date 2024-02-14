import { ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

export default interface Command {
    readonly commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}