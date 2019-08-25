import { Client, Message } from "discord.js";
import { client, commands } from "../index";
import { config } from "../config";
import Server, { GuildModel } from "../assets/mongoose/schemas/Guild";
import { handleCommand } from "../custom/handleCommand";
import * as chalk from "chalk";

export class superClient {

    Handler() {

        client.once("ready", async () => {

            console.log(chalk.default.green(`Logged in as ${client.user.tag}`));

            for (const [id, guild] of client.guilds) {
                const existing = await Server.findOne({ guildID: id });
                if (!existing) {
                    new Server({
                        guildID: id,
                        prefix: config.prefix
                    }).save();
                }
            }
        });

        client.on("message", message => {

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

                if (!message.content.toLowerCase().startsWith(conf.prefix) || message.content.slice(conf.prefix.length).length <= 0) { return; }
            });
            handleCommand(message);
        });

        client.login(config.token);
    }
}
