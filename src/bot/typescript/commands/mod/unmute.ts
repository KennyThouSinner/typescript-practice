import { Message, Client } from "discord.js";
import { IBotCommand } from "../../api";
import Mute, { MuteModel } from "../../assets/mongoose/schemas/warns";

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

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const member = message.mentions.members.first();
        const muterole = message.guild.roles.find(role => role.name.toLowerCase() === "muted" || role.name.toLowerCase().includes("muted"))

        if (!message.member.permissions.has("MANAGE_ROLES")) {
            message.channel.send("Insufficient Permission.");
            return;
        }

        if (!muterole) {
            message.channel.send(`There was no role found called 'muted'`);
            return;
        }

        if (!member) {
            message.channel.send(`Please mention a member.`);
            return;
        }

        if (!message.guild.members.fetch(member.id)) {
            message.channel.send(`The member was not found inside of the guild.`);
            return;
        }

        if (!member.roles.has(muterole.id)) {
            message.channel.send("This member is not muted.");
            return;
        }

        if (muterole && member && member.roles.has(muterole.id)) {
            message.guild.members.fetch(member.id).then(mem => mem.roles.remove(muterole).then(() => message.channel.send(`Successfully unmuted ${mem.displayName}`))).catch(e => console.log(e));
        }
    }
}