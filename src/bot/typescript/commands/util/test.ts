import { Message, Client, MessageEmbed, DiscordAPIError } from "discord.js";
import { IBotCommand } from "../../api";
import { isObject, isString } from "util";

export default class test implements IBotCommand {

    private readonly _command = "test";

    help(): string {
        return "This command does nothing";
    };

    isThisCommand(command: string): boolean {
        return command === this._command;
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

        const array = ["603096765490790412", "603044257632354307"];

        if(array.some(r => message.member.roles.has(r))) { 
            console.log("true");
        } else { 
            console.log("false");
        }

    };
};