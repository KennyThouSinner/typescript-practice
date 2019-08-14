import * as Discord from "discord.js";

export interface IBotCommand {
    [_command: string]: any;
    help(): string;
    isThisCommand(command: string): boolean;
    usage(): string;
    runCommand(args: string[], message: Discord.Message, client: Discord.Client): Promise<void>;
}