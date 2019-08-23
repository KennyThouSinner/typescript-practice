import { Message, Client, MessageEmbed, GuildMemberRoleStore } from "discord.js";
import { IBotCommand } from "../../api";
import Mute, { MuteModel } from "../../assets/mongoose/schemas/warns";
import { makeid } from "../../gen";
import punishment, { punishmentModel } from "../../assets/mongoose/schemas/punishments";
import Roles, { RolesModel } from "../../assets/mongoose/schemas/roles";
import { HelpHandler } from "../../custom/muteHelpHandler";

export default class mute implements IBotCommand {

    private readonly _command = "mute";

    help(): string {
        return "Mutes the mentioned member";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    };

    usage(): string {
        return "?mute @member [reason]";
    }

    adminOnly(): boolean {
        return undefined;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        let reason;
        const muterole = message.guild.roles.find(role => role.name.toLowerCase() === "muted" || role.name.toLowerCase().includes("mute"))
        const muteEmbed = new MessageEmbed().setFooter(message.guild.me.displayName, client.user.displayAvatarURL());
        const handler = new HelpHandler(message, (m) => m.author.id === message.author.id, args);

        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            message.channel.send(`You do not have enough authorization to do this`);
            return;
        }

        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            message.channel.send(`Error: **${client.user.username}** does not have the 'MANAGE_ROLES' permission`);
            return;
        }

        if(message.content.split(" ")[1].toLowerCase() === "help") {
            handler.Respond();
            return;
        }

        if (!args[0]) {
            message.channel.send("Please mention a member or provide a member ID");
            return;
        }

        if (!args[0].startsWith("<@") && isNaN(parseInt(args[0]))) {
            message.channel.send(`Please provide an ID that is a number.`);
            return;
        }

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

        if (member.roles.has(muterole.id)) {
            message.channel.send(`This member is already muted.`);
            return;
        }

        muteEmbed
            .addField("Muted", member.displayName)
            .addField("Action by", message.member.displayName)

        Roles.findOne({
            guild: message.guild.id,
            member: member.id
        }, (err, roles) => {
            if (err) return console.log(err);

            if (!isNaN(parseInt(args[1]))) {

                reason = args.slice(2).join(" ") || "No reason specified";

                muteEmbed
                    .addField("Muted for", args[1] + " milliseconds")
                    .addField("Reason", reason);

                if (!roles) {
                    new Roles({
                        guild: message.guild.id,
                        member: member.id,
                        roles: member.roles.keyArray()
                    }).save().catch(e => console.log(e));
                } else {
                    roles.roles = member.roles.keyArray();
                    roles.save().catch(e => console.log(e));
                }

                member.roles.set([muterole.id]).then(role => {
                    message.channel.send(muteEmbed);
                    setTimeout(function () {
                        member.roles.set(roles.roles);
                        message.channel.send(`Successfully unmuted ${member.displayName}`)
                    }, parseInt(args[1]));
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`Oops, something went wrong whilst muting ${member.displayName}. I'm sorry for the inconvenience! \nPlease use the \`\`?mute help missing-perms\`\` commands for further information on what to do in order to resolve this issue. `);
                });

            } else {

                reason = args.slice(1).join(" ") || "No reason specified";

                muteEmbed
                    .addField("Reason", reason);

                if (!roles) {
                    new Roles({
                        guild: message.guild.id,
                        member: member.id,
                        roles: member.roles.keyArray()
                    }).save().catch(e => console.log(e));
                } else {
                    roles.roles = member.roles.keyArray();
                    roles.save().catch(e => console.log(e));
                }

                member.roles.set([muterole.id]).then(role => {
                    message.channel.send(muteEmbed);
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`Oops, something went wrong whilst muting ${member.displayName}. I'm sorry for the inconvenience! \nPlease re-check my permissions.`);
                });;
            }
        });
    }
}