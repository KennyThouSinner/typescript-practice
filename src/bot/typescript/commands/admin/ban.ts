import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";

export default class ban implements IBotCommand {

    private readonly _command = "ban";

    help(): string {
        return "Bans the mentioned member from the guild";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    };

    usage(): string {
        return "?ban @member [reason]";
    }

    adminOnly(): boolean {
        return true;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        const reason = args.slice(1).join(" ") || "No Reason";

        if (!args[0]) {
            message.channel.send("Please provide a member to ban.")
            return;
        }

        if (!message.guild.members.fetch(args[0])) {
            message.channel.send("That member is not inside of the guild.")
            return;
        }

        if (member && message.guild.members.get(member.id)) {
            const banEmbed = new MessageEmbed()
                .setColor("WHITE")
                .setTitle(member.displayName + " was banned from " + member.guild.name)
                .setAuthor(member.displayName, member.user.displayAvatarURL())
                .addField(`Member who was banned in ${message.guild.name}`, member.displayName)
                .addField(`Member who banned ${member.displayName}`, message.member.displayName)
                .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
                .setTimestamp();

            member.ban({ days: 2, reason: reason }).then(ban => {
                message.channel.send(banEmbed);
            })
        }

    }
}