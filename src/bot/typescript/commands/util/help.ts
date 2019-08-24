import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../index";
import { GenericMessageEmbedPageHandler } from "../../generichRichEmbedPageHandler";

export default class help implements IBotCommand {

    readonly _commandKeyWords = ["help", "commands", "list"];

    help(): string {
        return "Brings up the help embed";
    }

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
    };

    usage(): string {
        return "?help";
    }

    adminOnly(): boolean {
        return false;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        let embed = new MessageEmbed()
            .setTitle("List of all the commands");

        let sent = (await message.channel.send(embed)) as Message;


        if (Array.isArray(message)) {
            message = message[0];
        }

        let itemHandler = (embed: MessageEmbed, data: Array<IBotCommand>) => {
            data.forEach(item => {
                embed.addField(`${item._commandKeyWords[0][0].toUpperCase() + item._commandKeyWords[0].slice(1)}`, `${item.help()} | Usage: ${item.usage()} || Admin Only: ${item.adminOnly()}`);
            })
            return embed;
        }

        let handler = new GenericMessageEmbedPageHandler<IBotCommand>(commands, 5, itemHandler, embed, sent)

        handler.startCollecting(message.author.id, sent);
    };
};