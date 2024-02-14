import { ActivityType, ChatInputCommandInteraction, EmbedBuilder, InteractionType } from "discord.js";
import App from "../App";

export default class ListenerManager {
    constructor(private _app: App) { }

    register() {
        const client = this._app.client;

        client.on('ready', async client => {
            client.user.setActivity('the latest', { type: ActivityType.Listening });
            client.user.setStatus('online');

            console.log(`Now ready with the user ${client.user.tag}.`);
        })

        client.on('interactionCreate', async interaction => {
            switch (interaction.type) {
                case InteractionType.ApplicationCommand: {
                    console.log(`Recieved new command interaction from ${interaction.user.tag} for ${interaction.commandName}`);
                    await this._app.commandManager.execute(interaction as ChatInputCommandInteraction);
                    break;
                }
            }
        })

        client.on('messageCreate', async message => {
            if (message.author.bot) return;
            const user = client.user!;

            if (message.mentions.members!.has(user.id) && message.content === `<@${user.id}>`) {
                const embed = new EmbedBuilder()
                    .setTitle('You seem to be lost...')
                    .setDescription('Want to find your way? Type `/` for a list of commands.')
                    .setColor('Blue')
                    .setTimestamp()
                    .setFooter({ text: user.username, iconURL: `https://cdn.discordapp.com/avatars/${client.user!.id}/${client.user!.avatar}.png?size=64`, })

                const newMessage = await message.reply({
                    embeds: [embed],
                    allowedMentions: {
                        repliedUser: false
                    },
                });
            }
        })
    }
}