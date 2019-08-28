import { Message, Client, MessageEmbed, GuildMember } from "discord.js";
import { IBotCommand } from "../../api";
import { parse } from "path";
import { Collection } from "mongoose";

export default class ban implements IBotCommand {

    readonly _commandKeyWords = ["ban"];

    help(): string {
        return "Bans the mentioned member from the guild";
    }

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
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

        let member;

        message.mentions.users.size >= 1 
        ? member = message.guild.member(message.mentions.users.first())
        : member = await message.guild.members.fetch(args[0]);
        
        const reason = args.slice(1).join(" ") || "No Reason";

        if (!message.member.permissions.has("BAN_MEMBERS")) {
            message.reply('you do not have the sufficient permission to execute this action');
            return;
        }

        if (!args[0]) {
            message.channel.send("Please provide a member to ban");
            return;
        }

        if (args[0] && !isNaN(parseInt(args[0])) && !(await message.guild.members.fetch(args[0]))) {
            message.channel.send("The provided member ID did not match any member inside of the guild.");
            return;
        }

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
        });
    }
}