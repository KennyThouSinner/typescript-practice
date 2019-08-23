import { Message, Client } from "discord.js";
import { IBotCommand } from "../../api";
import Mute, { MuteModel } from "../../assets/mongoose/schemas/warns";
import Roles, { RolesModel } from "../../assets/mongoose/schemas/roles";

export default class unmute implements IBotCommand {

    private readonly _command = "unmute"

    help(): string {
        return "This command does nothing";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    };

    usage(): string {
        return "?unmute @member";
    }

    adminOnly(): boolean {
        return undefined;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        const muterole = message.guild.roles.find(role => role.name.toLowerCase() === "muted" || role.name.toLowerCase().includes("muted"))

        if (!message.member.permissions.has("MANAGE_ROLES")) {
            message.channel.send("Insufficient Permission.");
            return;
        }

        if (!args[0]) {
            message.channel.send(`Please mention a member or provide a member id.`);
            return;
        }

        if (args[0].startsWith("<@") && !message.guild.members.fetch(member.id)) {
            message.channel.send(`The member was not found inside of the guild.`);
            return;
        }

        if (!muterole) {
            message.channel.send(`There was no role found called 'muted'`);
            return;
        }

        if (!member.roles.has(muterole.id)) {
            message.channel.send("This member is not muted.");
            return;
        }

        Roles.findOne({
            guild: message.guild.id,
            member: member.id
        }, (err, roles) => {
            if (err) return console.log(err);

            member.roles.set(roles.roles).then(() => {
                message.channel.send(`Successfully unmuted **${member.displayName}**.`);
            });
        }).catch(e => console.log(e));
    }
}