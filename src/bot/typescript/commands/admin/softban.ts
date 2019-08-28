import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { Member } from "../../classes/member";

export default class softban implements IBotCommand {

      readonly _commandKeyWords = ["softban"];

      help(): string {
            return "Softbans the mentioned member";
      };

      isThisCommand(command: Array<string>): boolean {
            return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
      };

      usage(): string {
            return "?softban @member [days] [reason]";
      };

      adminOnly(): boolean {
            return true;
      }

      devOnly(): boolean {
            return false;
      }

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const mentionedMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

            if (!message.member.permissions.has("BAN_MEMBERS")) {
                  message.reply('you do not have the sufficient permission to execute this action');
                  return;
            }

            if (!args[0]) {
                  message.channel.send("You must either mention a member or supply a member ID");
                  return;
            }

            new Member(client, {}, message.guild)
                  .softban({ id: mentionedMember.id }).then(es => {
                        message.channel.send(`Successfully soft-banned ${mentionedMember.user.tag} from ${message.guild.name}. Removed messages that are ${es} day(s) old`)
                  })
      };
};