import { Schema, model, Document, Model } from "mongoose";

export interface GuildModel extends Document {
    guildID: string;
    prefix: string;
};

const Server: Schema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: "?"
    }
});

export default model<GuildModel>("Server", Server);