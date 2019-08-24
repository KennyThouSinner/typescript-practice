import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../index";
import { GenericMessageEmbedPageHandler } from "../../generichRichEmbedPageHandler";
import { responses } from "../../custom/respones";
import { HelpHandler } from "../../classes/muteHelpHandler";

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

        const handler = new HelpHandler(message, args);

        handler.helpRespond();
            
    };
};