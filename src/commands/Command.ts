import { ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

export default interface Command {
    commandInfo: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}