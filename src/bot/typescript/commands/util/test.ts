import { Message, Client, MessageEmbed, DiscordAPIError } from "discord.js";
import { IBotCommand } from "../../api";
import { isObject, isString } from "util";

export default class test implements IBotCommand {

    readonly _commandKeyWords = ["test"];

    help(): string {
        return "This command does nothing";
    };

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
    };
    usage(): string {
        return "?test";
    };

    adminOnly(): boolean {
        return false;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

    };
};