import { Message, Client, MessageEmbed, DiscordAPIError } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../index";
import { HelpHandler } from "../../classes/handlers";

export default class aliases implements IBotCommand {

    readonly _commandKeyWords = ["aliases"];

    help(): string {
        return "Shows all the aliases of the specified command";
    };

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
    };
    usage(): string {
        return "?aliases <command_name>";
    };

    adminOnly(): boolean {
        return false;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const handler = new HelpHandler(message, args);
        
        handler.aliasesRespond();

    };
};