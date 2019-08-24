import { Message, Client } from "discord.js";

export interface IBotCommand {
    _command: string;
    help(): string;
    isThisCommand(command: string): boolean;
    usage(): string;
    adminOnly(): boolean;
    devOnly(): boolean;
    runCommand(args: string[], message: Message, client: Client): Promise<void>;
}