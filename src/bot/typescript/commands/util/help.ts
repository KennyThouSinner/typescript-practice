import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { cmds } from "../../index";

export default class help implements IBotCommand {

    private readonly _command = "help";

    help(): string {
        return "Brings up the help embed";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    };

    usage(): string {
        return "?help";
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const help = new MessageEmbed()
            .setColor("WHITE")
            .setTitle(`${client.user.username}'s help menu`)
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setTimestamp();

        for (let i = 0; i < cmds.commands.length; i++) {
            help.addField(cmds.commands[i]._command.split("")[0].toUpperCase() + cmds.commands[i]._command.slice(1), cmds.commands[i].help() + " | Usage: " + ` \`\`${cmds.commands[i].usage()}\`\` `);
        };

        await message.channel.send(help);

    };
};