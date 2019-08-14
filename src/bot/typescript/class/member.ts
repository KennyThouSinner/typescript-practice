import { GuildMember } from "discord.js";

export class Member extends GuildMember {

      async tempban(member: { id: string, reason?: string, days?: number }) {

            if(!member.id || member.id === "") {
                  throw new Error("No member ID parameter was given");
            }

            if(member.reason === "" || !member.reason) { 
                  member.reason = "No reason specified";
            }

            if(!member.days || member.days === 0) { 
                  member.days = 1;
            }

            if(!this.guild.members.fetch(member.id)) { 
                  throw new Error("The specified member was not found in the guild");
            }

            this.guild.members.ban(member.id, { reason: member.reason, days: member.days });

            return member.days;
      }
}