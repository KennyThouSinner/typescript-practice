import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import Mute, { MuteModel } from "../../assets/mongoose/schemas/warns";
import { makeid } from "../../gen";
import punishment, { punishmentModel } from "../../assets/mongoose/schemas/punishments";

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

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const member = message.mentions.members.first();
        const reason = args.slice(1).join(" ").toString() || "No reason specified";
        const muterole = message.guild.roles.find(role => role.name.toLowerCase() === "muted" || role.name.toLowerCase().includes("muted"));
        const retValue = makeid(17);
        const muteEmbed = new MessageEmbed();
        const punishments = await punishment.findOne({
            ID: retValue
        });

        if (!message.member.permissions.has("MANAGE_ROLES")) {
            message.channel.send("Insufficient Permission.");
            return;
        }

        if (!message.mentions.members.first()) {
            message.channel.send(`Please specify a member to mute.`)
            return;
        }

        if (!message.guild.members.fetch(member.id)) {
            message.channel.send(`That member is not inside of this guild.`)
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
                message.guild.members.fetch(member.id).then(member => member.roles.add(role));
            }).catch(ex => { console.log(ex); message.channel.send("Cannot create 'Muted' role. Missing permissions.") })
        } else {
            message.guild.members.fetch(member.id).then(member => member.roles.add(muterole)).catch(e => { console.log(e); message.channel.send(`Unable to add the role to the specified member. Missing permissions.`) })
        }

        await Mute.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, (err, warns) => {

            if (!punishments) {
                muteEmbed.addField("Punishment ID", retValue)
            }
            muteEmbed.setColor("WHITE")
            muteEmbed.setAuthor(member.displayName, member.user.displayAvatarURL())
            muteEmbed.addField(`Punishment for ${member.user.tag} was updated`, "Action: Mute")
            muteEmbed.addField(`Reason for action`, reason)
            muteEmbed.setFooter(`Action ran by ${message.member.displayName}`, message.author.displayAvatarURL())
            muteEmbed.setTimestamp();

            if (err) return console.log(err);

            if (!warns) {
                return new Mute({
                    guildID: message.guild.id,
                    userID: member.id,
                    reason: reason,
                    punishment: retValue
                }).save().catch(e => console.log(e));
            } else {
                return new Mute({
                    guildID: message.guild.id,
                    userID: member.id,
                    reason: reason,
                    punishment: retValue
                }).save().catch(e => console.log(e));
            }
        }).then(() => {
            message.channel.send(muteEmbed);
        })
    }
}