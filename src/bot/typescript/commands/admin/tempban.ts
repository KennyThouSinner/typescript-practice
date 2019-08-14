import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { Member } from "../../class/member";

export default class tempban implements IBotCommand {

      private readonly _command = "tempban";

      help(): string {
            return "This command does nothing";
      };

      isThisCommand(command: string): boolean {
            return command === this._command;
      };

      usage(): string {
            return "?tempban @member [days] [reason]";
      };

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const mentionedMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

            if (!message.member.permissions.has("BAN_MEMBERS")) {
                  message.channel.send(`You do not have the sufficient permission.`);
                  return;
            }

            if (!mentionedMember) {
                  message.channel.send("You must either mention a member or supply a member ID");
                  return;
            }

            new Member(client, {}, message.guild)
                  .tempban({ id: mentionedMember.id }).then(es => {
                        message.channel.send(`Successfully banned ${mentionedMember.user.tag} from ${message.guild.name}. Removed messages that are ${es} day(s) old`)
                        console.log(es);
                  })
      };
};