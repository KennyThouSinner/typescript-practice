import { GuildMember, Message, TextChannel } from "discord.js";
import { member } from "..";

export class Member extends GuildMember {

      async softban(member: { id: string, reason?: string, days?: number }) {

            if (!member.id || !member.id.length) {
                  throw new Error("No member ID parameter was given");
            }

            if (!member.reason.length || !member.reason) {
                  member.reason = "No reason specified";
            }

            if (!member.days || member.days === 0) {
                  member.days = 7;
            }

            if (!this.guild.members.fetch(member.id)) {
                  throw new Error("The specified member was not found in the guild");
            }

            await this.guild.members.ban(member.id, { reason: member.reason, days: member.days });

            return member.days;
      };
};