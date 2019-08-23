import { Client, Guild } from "discord.js";
import { IBotCommand } from "./api";
import * as mongoose from "mongoose";
import { Member } from "./classes/member";
import { loader } from "./classes/loader";
import { superClient } from "./classes/superClient";

mongoose.connect("mongodb://localhost:27017/typescript", { useNewUrlParser: true });

export const client: Client = new Client();

export const commands: IBotCommand[] = [];

const guild = new Guild(client, {});

export const member = new Member(client, {}, guild);

new loader().loadCmds(`${__dirname}/commands`);

new superClient().Handler();