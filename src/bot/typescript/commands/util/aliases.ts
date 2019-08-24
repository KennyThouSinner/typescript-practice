import { Message, Client, MessageEmbed, DiscordAPIError } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../index";

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

        const embed = new MessageEmbed().setTimestamp();
        const foundCmd = commands.find(arr => arr._commandKeyWords.some(keyword => keyword.toLowerCase() === args[0]));

        if (foundCmd) {
            embed
                .setTitle(`Aliases for \`\`${foundCmd._commandKeyWords[0]}\`\` `)
            !(foundCmd._commandKeyWords.slice(1).length <= 0) ? embed.addField(`Aliases:`, ` \`\`${foundCmd._commandKeyWords.slice(1).join('\n')}\`\` `) : embed.addField("Aliases: ", "No aliases for this command!")
            message.channel.send(embed);
            return;
        } else {
            message.channel.send(`I couldn't find that command, sorry!`);
            return;
        }

    };
};