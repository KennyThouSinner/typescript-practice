import { Message, CollectorFilter, MessageEmbed } from "discord.js";
import { responses } from "../custom/respones";
import { commands } from "../index";
import { IBotCommand } from "../api";
import { GenericMessageEmbedPageHandler } from "../generichRichEmbedPageHandler";

class HelpHandler {
    message: Message;
    args: Array<String>;

    /** 
     * @param message 
     * @param args 
     */

    constructor(message, args) {
        this.message = message;
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

    public Respond = async (filter: CollectorFilter) => {

        if (this.args[0].toLowerCase() === "help") {
            if (!this.args[1]) {
                this.message.channel.send(responses.initial_response)
                    .then(m => {
                        this.message.channel.awaitMessages(filter, { max: 1 })
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

    public helpRespond = async () => {

        if (!this.message.content.split(" ").slice(1)[0]) {
            let embed = new MessageEmbed()
                .setTitle("List of all the commands");

            let sent = (await this.message.channel.send(embed)) as Message;

            if (Array.isArray(this.message)) {
                this.message = this.message[0];
            }

            let itemHandler = (embed: MessageEmbed, data: Array<IBotCommand>) => {
                data.forEach(item => {
                    embed.addField(`${item._commandKeyWords[0][0].toUpperCase() + item._commandKeyWords[0].slice(1)}`, `${item.help()} | Usage: ${item.usage()} || Admin Only: ${item.adminOnly()}`);
                })
                return embed;
            }

            let handler = new GenericMessageEmbedPageHandler<IBotCommand>(commands, 5, itemHandler, embed, sent)

            return handler.startCollecting(this.message.author.id, sent);

        } else {
            const foundCmd = commands.find(arr => arr._commandKeyWords[0].toLowerCase() === this.message.content.split(" ").slice(1)[0].toLowerCase());

            return this.message.channel.send(`Command: \`\`${foundCmd._commandKeyWords[0].toUpperCase() + foundCmd._commandKeyWords[0][0].slice(1)}\`\`, \nAliases: \`${foundCmd._commandKeyWords.slice(1).length >= 1 ? foundCmd._commandKeyWords.slice(1) : "No aliases for this command!"}\`, \nUsage: \`\`${foundCmd.usage()}\`\`,
\n\`Admin Only\`: 
\`\`\`
${foundCmd.adminOnly()}
\`\`\`
\`Developer Only\`: 
\`\`\`
${foundCmd.devOnly()}
\`\`\` `);
        }
    }

    public aliasesRespond = () => {

        const embed = new MessageEmbed().setTimestamp();
        const foundCmd = commands.find(arr => arr._commandKeyWords[0].toLowerCase() === this.args[0].toLowerCase());
        const foundAlias = commands.find(arr => arr._commandKeyWords.slice(1).some(keyword => keyword.toLowerCase() === this.args[0].toLowerCase()))

        if (foundCmd) {
            embed
                .setTitle(`Aliases for \`\`${foundCmd._commandKeyWords[0]}\`\` `)
            !(foundCmd._commandKeyWords.slice(1).length <= 0) ? embed.addField(`Aliases:`, ` \`\`${foundCmd._commandKeyWords.slice(1).join('\n')}\`\` `) : embed.addField("Aliases: ", "No aliases for this command!")
            this.message.channel.send(embed);
            return;
        } else if (foundAlias) {

            this.message.channel.send(`I didn't find the original command name, but I found it's alias... \nOriginal Command Name: \n**\`\`${foundAlias._commandKeyWords[0]}\`\`** \nIt's aliases: \n\`\`${foundAlias._commandKeyWords.slice(1).join("\n")}\`\` `)

            return;
        } else if (!foundCmd && !foundAlias) {

            this.message.channel.send(`I couldn't find that command, sorry!`);
            return;
        }
    }
}

export { HelpHandler };