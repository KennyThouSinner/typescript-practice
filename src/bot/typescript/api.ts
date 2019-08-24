import { Message, Client } from "discord.js";

export interface IBotCommand {
    _commandKeyWords: Array<string>;
    help(): string;
    isThisCommand(command: Array<string>): boolean;
    usage(): string;
    adminOnly(): boolean;
    devOnly(): boolean;
    runCommand(args: string[], message: Message, client: Client): Promise<void>;
}