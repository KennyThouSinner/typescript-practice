import { GuildMember, Message, TextChannel } from "discord.js";
import { member } from "..";

export class Member extends GuildMember {

      async softban(member: { id: string, reason?: string, days?: number }) {

            if (!member.id || member.id === "") {
                  throw new Error("No member ID parameter was given");
            }

            if (member.reason === "" || !member.reason) {
                  member.reason = "No reason specified";
            }

            if (!member.days || member.days === 0) {
                  member.days = 1;
            }

            if (!this.guild.members.fetch(member.id)) {
                  throw new Error("The specified member was not found in the guild");
            }

            await this.guild.members.ban(member.id, { reason: member.reason, days: member.days });

            return new Promise((res, rej) => {
                  res(member.days);
                  rej(member.days);
            });
      };

      async massban(members: { ids: Array<string>, reason?: string, days?: number }) {

            if (!members.ids.length) {
                  throw new Error("An empty array was provided")
            }

            if (members.ids.length) {
                  for (let i = 0; i < members.ids.length; i++) {
                        if (!this.guild.members.fetch(members.ids[i])) throw new Error(`I was unable to find the specified member`);

                        this.guild.members.fetch(members.ids[i]).then(member => {
                              if (member.user.bot) { return; }
                              this.guild.members.ban(member, { reason: (members[i].reason || "No reason"), days: (members[i].days || 5) })
                                    .catch(e => console.log(e));
                        }).catch(e => (member.guild.channels.get("609664277292384277") as TextChannel).send(e))
                  };
            }

            return new Promise((res, rej) => {
                  res(this);
                  rej(this);
            });
      }
};