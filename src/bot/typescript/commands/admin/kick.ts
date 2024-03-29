import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";

export default class kick implements IBotCommand {

    readonly _commandKeyWords = ["kick"];

    help(): string {
        return "Kicks the mentioned member from the guild";
    }

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
    };

    usage(): string {
        return "?kick @member [reason]";
    }

    adminOnly(): boolean {
        return true;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const member = await message.guild.members.fetch(message.mentions.members.first() || message.guild.members.get(args[0]));
        const reason = args.slice(1).join(" ") || "No Reason";

        if (!message.member.permissions.has("KICK_MEMBERS")) {
            message.reply('you do not have the sufficient permission to execute this action');
            return;
        }

        if (!args[0]) {
            message.channel.send("Please mention a member to kick");
            return;
        }

        if (!message.guild.members.get(member.id)) {
            message.channel.send("The provided member was not found inside of the guild");
            return;
        }

        if (member && message.guild.members.get(member.id)) {
            const kickEmbed = new MessageEmbed()
                .setColor("WHITE")
                .setTitle(member.displayName + " was kicked from " + member.guild.name)
                .setAuthor(member.displayName, member.user.displayAvatarURL())
                .addField(`Member who was kicked in ${message.guild.name}`, member.displayName)
                .addField(`Member who kicked ${member.displayName}`, message.member.displayName)
                .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
                .setTimestamp();

            member.kick(reason).then(mem => {
                message.channel.send(kickEmbed);
            })
        }

    }
}