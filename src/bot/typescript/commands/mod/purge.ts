import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { HelpHandler } from "../../classes/handlers";

export default class help implements IBotCommand {

    readonly _commandKeyWords = ["purge", "prune"];

    help(): string {
        return "Deletes the specified amount of messages";
    }

    isThisCommand(command: Array<string>): boolean {
        return this._commandKeyWords.some(arr => command.some(cmd => cmd === arr))
    };

    usage(): string {
        return "?purge [amount]";
    }

    adminOnly(): boolean {
        return false;
    }

    devOnly(): boolean {
        return false;
    }

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        let channel;
        let handler = new HelpHandler(message, args);

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            message.reply('you do not have the sufficient permission to execute this action');
            return;
        };

        if (!isNaN(parseInt(args[0])) || !args[0]) {

            let amount = parseInt(args[0]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs)
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages from ${channel}`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        });
                });
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--bots', 'bots'] })) {

            let amount = parseInt(args[1]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.author.bot))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages sent by bots in ${channel}.`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        })
                })
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--me', 'me'] })) {

            let amount = parseInt(args[1]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.author.id === message.author.id))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages sent by **${message.author.tag}** in ${channel}`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        });
                });
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--contains', '--includes', 'contains', 'includes'] })) {

            let keyword = args.slice(1).join(" ").match(/'[^$]+'/g).toString().split("'").join("");
            let amount = parseInt(args.splice(args.findIndex(a => a === keyword), 1)[0]) > 100
                ? 50
                : parseInt(args.splice(args.findIndex(a => a === keyword), 1)[0]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.content.toLowerCase().includes(keyword.toLowerCase())))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages that include **\`\`${keyword}\`\`** in ${channel} `)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        })
                        .catch(err => { console.log(err); message.channel.send(`Woops! I didn't find any messages that include \`\`${keyword}\`\` `) });
                });
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--images', 'images'] })) {

            let amount = parseInt(args[1]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.attachments.size >= 1))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages that include images in ${channel}`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        })
                })
                .catch(err => { console.log(err); message.channel.send(`Woops! I didn't find any messages that include attachments!`) });
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--mentions', 'mentions'] })) {

            let amount = parseInt(args[1]) || 100;
            channel = message.channel || message.mentions.channels.first();

            message.mentions

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.mentions.users.size >= 1 || m.mentions.members.size >= 1))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages that include mentions in ${channel}`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                })
                        })
                })
        }

        else if (handler.compareArgs({ args: args, argsIndex: 0 }, { arguments: ['--embeds', 'embeds'] })) {

            let amount = parseInt(args[1]) || 100;
            channel = message.channel || message.mentions.channels.first();

            channel.messages.fetch({ limit: amount })
                .then(msgs => {
                    msgs.first().channel.bulkDelete(msgs.filter(m => m.embeds.length >= 1))
                        .then(messages => {
                            message.channel.send(`Successfully deleted ${messages.size} messages that include embeds in ${channel}`)
                                .then(msg => {
                                    msg.delete({ timeout: 5000 });
                                });
                        });
                });
        };

        message.delete();
    };
};
