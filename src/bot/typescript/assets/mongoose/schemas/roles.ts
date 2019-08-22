import { Document, Schema, Model, model } from "mongoose";

export interface RolesModel extends Document {
    guild?: string,
    member?: string,
    roles?: Array<string>
}

const Roles: Schema = new Schema({
    guild: String,
    member: String,
    roles: Array
});

export default model<RolesModel>("Roles", Roles);