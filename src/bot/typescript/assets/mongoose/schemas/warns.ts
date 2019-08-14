import { Model, model, Document, Schema } from "mongoose";

export interface MuteModel extends Document { 
    guildID: string;
    userID: string;
    reason?: string;
    punishment?: string;
};

const Mute: Schema = new Schema({
    guildID: String,
    userID: String,
    reason: String,
    punishment: String
});

export default model<MuteModel>("Mute", Mute);
