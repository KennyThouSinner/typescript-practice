import { Client } from "discord.js";
import { client, commands } from "../index";
import { config } from "../config";
import Balance, { BalanceModel } from "../assets/mongoose/schemas/balance";
import Server, { GuildModel } from "../assets/mongoose/schemas/Guild";
import { handleCommand } from "../custom/handleCommand";
import * as chalk from "chalk";

class superClient extends Client {
    
    constructor(superClient) {
        super(superClient);

        this.on("ready", async () => {

            console.log(chalk.default.green(`Logged in as ${this.user.tag}`));

            for (const [id, guild] of this.guilds) {
                const existing = await Server.findOne({ guildID: id });
                if (!existing) {
                    new Server({
                        guildID: id,
                        prefix: config.prefix
                    }).save();
                }
            }
        })

        this.on("message", message => {

            console.log(message.content);

            if (message.author.bot) { return; }

            if (message.channel.type === "dm") { return; }

            Server.findOne({
                guildID: message.guild.id
            }, (err, conf) => {
                if (err) return console.error(err);

                if (!conf) {
                    new Server({
                        guildID: message.guild.id,
                        prefix: config.prefix
                    }).save();

                } else {
                    if (!conf.prefix) {
                        conf.prefix = config.prefix;
                        return conf.save();
                    }
                }

                const moneyToGive = Math.floor(Math.random() * 100);
                Balance.findOne({
                    guildID: message.guild.id,
                    userID: message.member.id
                }, (err, bal) => {
                    if (err) return console.error(err);

                    if (message.content.split(" ").slice(1).length <= 0) { return; }

                    if (!bal) {
                        return new Balance({
                            guildID: message.guild.id,
                            userID: message.member.id,
                            balance: moneyToGive
                        }).save().catch(e => console.log(e));
                    } else {
                        bal.balance += moneyToGive
                        bal.save().catch(e => console.log(e));
                    }
                    if (!message.content.toLowerCase().startsWith(conf.prefix) || message.content.slice(conf.prefix.length).length <= 0) { return; }
                });
            });
            handleCommand(message);
        });

        this.login(config.token);
    };
};

export { superClient };