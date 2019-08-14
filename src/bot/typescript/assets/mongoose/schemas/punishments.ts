import { Model, model, Document, Schema } from "mongoose";

export interface punishmentModel extends Document {
      ID: string
}

const punishment: Schema = new Schema({
      ID: String
})

export default model<punishmentModel>("punishment", punishment);