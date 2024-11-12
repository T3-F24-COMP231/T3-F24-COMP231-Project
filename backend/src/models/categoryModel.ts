import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
