import { Model, model, Document, Schema } from "mongoose";

export interface BalanceModel extends Document { 
      guildID?: string,
      userID?: string,
      balance?: number
}

const Balance: Schema = new Schema({
      guildID: String,
      userID: String,
      balance: Number
});

export default model<BalanceModel>("Balance", Balance);