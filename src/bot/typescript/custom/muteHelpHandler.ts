import { Message, CollectorFilter } from "discord.js";
import { responses } from "./respones";

class HelpHandler {
    message: Message;
    filter: CollectorFilter;
    args: Array<String>;

    /** 
     * @param message 
     * @param filter 
     * @param args 
     */

    constructor(message, filter, args) {
        this.message = message;
        this.filter = filter;
        this.args = args;
    }

    /**
     * @example
     * // Respond to every message who's second argument is equal to 'help'
     * if (this.message.content.split(" ")[1].toLowerCase() === 'help') {
     *   new HelpHandler(this.message, (m) => m.author.id === message.author.id, this.args).Respond();
     *   return;
     * }
     */

    public Respond = async () => {
        if (this.args[0].toLowerCase() === "help") {
            if (!this.args[1]) {
                this.message.channel.send(`Hi! Did you mean to do "?mute help"? If you didn"t, please write "no", and if you did, please write one of the following categories:
\`\`
missing-permissions\`\`,
\`\`
invalid-member\`\` `)
                    .then(m => {
                        this.message.channel.awaitMessages(this.filter, { max: 1 })
                            .then(async collected => {
                                if (collected.first().content.toLowerCase().includes("no")) {
                                    await this.message.delete();
                                    await m.delete();
                                    collected.first().delete();
                                } else if (collected.first().content.toLowerCase().includes("missing")) {
                                    this.message.channel.send(responses.missing_permissions);
                                } else if (collected.first().content.toLowerCase().includes("invalid")) {
                                    this.message.channel.send(responses.invalid_member);
                                }
                            }).catch(e => console.log(e));
                    })
            } else {
                if (this.args[1].toLowerCase().includes("missing")) {
                    this.message.channel.send(responses.missing_permissions);
                } else if (this.args[1].toLowerCase().includes("invalid")) {
                    this.message.channel.send(responses.invalid_member);
                }
            }
        }
    }
}

export { HelpHandler };