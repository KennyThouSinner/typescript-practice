import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import Balance, { BalanceModel } from "../../assets/mongoose/schemas/balance";

export default class balance implements IBotCommand {

      private readonly _command = "balance";

      help(): string {
            return "Checks the mentioned member's balance";
      }

      isThisCommand(command: string): boolean {
            return command === this._command;
      };

      usage(): string {
            return "?balance @member";
      }

      adminOnly(): boolean {
            return false;
      }

      devOnly(): boolean {
            return false;
      }

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
            const balance = await Balance.findOne({
                  guildID: message.guild.id,
                  userID: member.id || message.member.id
            })
            const balEmbed = new MessageEmbed()
                  .setTitle(`${member.displayName || message.member.displayName}'s balance in ${message.guild.name}`)
                  .addField("Balance", `$${balance.balance > 0 ? balance.balance : "No money"}`)
                  .setFooter(client.user.username, client.user.displayAvatarURL())
                  .setTimestamp();

            message.channel.send(balEmbed);

      }
}