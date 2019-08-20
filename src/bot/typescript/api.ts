import * as Discord from "discord.js";

export interface IBotCommand {
    [_command: string]: any;
    help(): string;
    isThisCommand(command: string): boolean;
    usage(): string;
    adminOnly(): boolean;
    devOnly(): boolean;
    runCommand(args: string[], message: Discord.Message, client: Discord.Client): Promise<void>;
}