import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";

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

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        message.guild.fetchAuditLogs().then(logs => {
            message.channel.send(logs.entries.first(), { code: "json" });
            console.log(logs.entries.first().toJSON());
        })
    };
};