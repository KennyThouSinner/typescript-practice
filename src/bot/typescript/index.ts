import { Message, Client, Guild } from "discord.js";
import { IBotCommand } from "./api";
import { config } from "./config";
import Server, { GuildModel } from "./assets/mongoose/schemas/Guild";
import * as mongoose from "mongoose";
import { Model, model } from "mongoose";
import Balance, { BalanceModel } from "./assets/mongoose/schemas/balance";
import * as fs from "fs";
import * as chalk from "chalk";

mongoose.connect("mongodb://localhost:27017/typescript", { useNewUrlParser: true });

const client: Client = new Client();

const commands: IBotCommand[] = [];

export let cmds = {
    commands: commands
};

loadAdmin(`${__dirname}/commands/admin`);
loadMod(`${__dirname}/commands/mod`);
loadEco(`${__dirname}/commands/eco`);
loadUtil(`${__dirname}/commands/util`);

client.on("ready", async () => {
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
                bal.balance += moneyToGive //bal.balance = bal.balance + moneyToGive
                bal.save().catch(e => console.log(e));
            }
            if (!message.content.toLowerCase().startsWith(conf.prefix) || message.content.slice(conf.prefix.length).length <= 0) { return; }
        })
    })
    handleCommand(message);
});

async function handleCommand(message: Message) {

    let command = message.content.split(" ")[0].replace(config.prefix, "").toLowerCase();
    let args = message.content.split(" ").slice(1);

    for (const cmd of commands) {

        try {
            if (!cmd.isThisCommand(command)) {
                continue;
            }

            await cmd.runCommand(args, message, client);
        } catch (e) {
            console.log(e);
        }
    }
}

function loadAdmin(commandsPath: string) {

    if (!config || (config.commands.admin as string[]).length === 0) { return; }

    for (const cmdName of config.commands.admin as string[]) {

        const cmdclass = require(`${commandsPath}/${cmdName}`).default;

        const cmd = new cmdclass() as IBotCommand;

        commands.push(cmd);
    }
}

function loadMod(commandsPath: string) {

    if (!config || (config.commands.mod as string[]).length === 0) { return; }

    for (const cmdName of config.commands.mod as string[]) {

        const cmdclass = require(`${commandsPath}/${cmdName}`).default;

        const cmd = new cmdclass() as IBotCommand;

        commands.push(cmd);
    }
}

function loadEco(commandsPath: string) {

    if (!config || (config.commands.eco as string[]).length === 0) { return; }

    for (const cmdName of config.commands.eco as string[]) {

        const cmdclass = require(`${commandsPath}/${cmdName}`).default;

        const cmd = new cmdclass() as IBotCommand;

        commands.push(cmd);
    }
}

function loadUtil(commandsPath: string) {

    if (!config || (config.commands.util as string[]).length === 0) { return; }

    for (const cmdName of config.commands.util as string[]) {

        const cmdclass = require(`${commandsPath}/${cmdName}`).default;

        const cmd = new cmdclass() as IBotCommand;

        commands.push(cmd);
    }
}

client.login(config.token);
