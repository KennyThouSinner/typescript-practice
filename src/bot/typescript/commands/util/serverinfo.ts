import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import { isNull, isNullOrUndefined } from "util";

export default class serverinfo implements IBotCommand {

      readonly _commandKeyWords = ["serverinfo", "si", "server"];

      help(): string {
            return "Shows information about the guild";
      }

      isThisCommand(command: Array<string>): boolean {
            return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
      };

      usage(): string {
            return "?serverinfo";
      }

      adminOnly(): boolean {
            return false;
      }

      devOnly(): boolean {
            return false;
      }

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const guild = message.guild;

            let mem;

            if (guild.memberCount <= 50) {
                  mem = "Low member count"
            } else if (guild.memberCount === 69) {
                  mem = "Nice."
            } else if (guild.memberCount <= 125) {
                  mem = "Average member count"
            } else if (guild.memberCount <= 250) {
                  mem = "Pretty good member count"
            } else if (guild.memberCount < 500) {
                  mem = "Amazing member count"
            } else if (guild.memberCount > 1000) {
                  mem = "Good job :clap:"
            }

            const embed = new MessageEmbed()
                  .setTitle(`Information about ${guild.name}`)
                  .setAuthor(message.member.displayName, message.author.displayAvatarURL())
                  .addField("Guild Created At", guild.createdAt, true)
                  .addField("Guild Member Count", guild.memberCount + " - " + mem, true)
                  .addField("Guild ID", guild.id.split("").splice(0, 9).join("") + "... \n ..." + guild.id.slice(9), true)
                  .addField("Bots", guild.members.filter(member => member.user.bot).size, true)
                  .addField("Humans", guild.members.filter(member => !member.user.bot).size, true)
                  .addField("Owner User Account Tag", guild.owner.user.tag)
                  .addField("Owner ID", guild.owner.id.split("").splice(0, 9).join("") + "... \n ..." + guild.owner.id.slice(9), true)
                  .addField("Owner Username", guild.owner.user.username, true)
                  .addField("Owner Discriminator", "#" + guild.owner.user.discriminator, true)
                  .addField("Nitro Boost Tier", guild.premiumTier, true)
                  .addField("Nitro Boost Count", isNullOrUndefined(guild.premiumSubscriptionCount) ? "No one is boosting this guild" : guild.premiumSubscriptionCount, true)
                  .setThumbnail(guild.iconURL())
                  .setFooter(client.user.tag, client.user.displayAvatarURL())
                  .setTimestamp();

            message.channel.send(embed);
      }
}