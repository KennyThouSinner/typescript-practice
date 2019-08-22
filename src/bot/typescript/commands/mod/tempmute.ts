import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import Mute, { MuteModel } from "../../assets/mongoose/schemas/warns";
import { makeid } from "../../gen";
import punishment, { punishmentModel } from "../../assets/mongoose/schemas/punishments";

export default class tempmute implements IBotCommand {

      private readonly _command = "tempmute";

      help(): string {
            return "Temporarily mutes the mentioned member for the given amount of time. (in minutes)";
      }

      isThisCommand(command: string): boolean {
            return command === this._command
      };

      usage(): string {
            return "?tempmute @member [time] [reason]";
      }

      adminOnly(): boolean {
            return undefined;
      }

      devOnly(): boolean {
            return false;
      }

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
            const givenTime = parseInt(args[1]) || 5;
            const muterole = message.guild.roles.find(role => role.name.toLowerCase() === "muted" || role.name.toLowerCase().includes("mute"));
            const reason = args.slice(2).join(" ") || "No reason specified";
            const actualTime = givenTime * 1000;
            const punishmentID = makeid(17);
            const muteEmbed = new MessageEmbed();
            const punishments = await punishment.findOne({
                  ID: punishmentID
            });

            if (!message.member.hasPermission("MANAGE_ROLES")) {
                  message.channel.send("Insufficient Permission");
                  return;
            }

            if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                  message.channel.send("Client does not have the sufficient permission");
                  return;
            }

            if (!muterole) {
                  message.guild.roles.create({
                        "data": {
                              "name": "Muted",
                              "permissions": 0,
                              "position": 0
                        },
                        "reason": "No muted role was found inside of the guild"
                  }).then(role => {
                        if (member.roles.has(role.id)) {
                              message.channel.send(`This member is already muted`);
                              return;
                        }
                        message.guild.members.fetch(member.id).then(member => member.roles.add(role));
                  }).catch(ex => { console.log(ex); message.channel.send("Cannot create 'Muted' role. Missing permissions.") })
            } else {
                  if (member.roles.has(muterole.id)) {
                        message.channel.send(`This member is already muted`);
                        return;
                  }
                  message.guild.members.fetch(member.id).then(member => member.roles.add(muterole)).catch(e => { console.log(e); message.channel.send(`Unable to add the role to the specified member. Missing permissions.`) })
            }

            Mute.findOne({
                  guildID: message.guild.id,
                  userID: member.id
            }, (err, mutes) => {
                  if (err) return console.log(err);

                  if (!punishments) {
                        muteEmbed.addField("Punishment ID", punishmentID);
                  }

                  muteEmbed.setTitle(`Successfully muted ${member.displayName}`);
                  muteEmbed.setAuthor(message.member.displayName, message.author.displayAvatarURL());
                  muteEmbed.addField("Punishment Reason", reason);
                  muteEmbed.addField("Punishment made by", message.author.tag);
                  muteEmbed.addField("Member who received the punishment", member.displayName);
                  muteEmbed.setFooter(client.user.tag, client.user.displayAvatarURL());
                  muteEmbed.setTimestamp();

                  if (!mutes) {
                        new Mute({
                              guildID: message.guild.id,
                              userID: member.id,
                              reason: reason,
                              punishment: punishmentID
                        }).save().catch(e => console.log(e));
                  } else if (mutes && !punishments) {
                        return new Mute({
                              guildID: message.guild.id,
                              userID: member.id,
                              reason: reason,
                              punishment: punishmentID
                        }).save().catch(e => console.log(e));
                  }
            }).then(() => {
                  message.channel.send(muteEmbed);
            })
      }
}