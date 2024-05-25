import mongoose, { Schema, Document } from "mongoose";

export interface IPostDocument extends Document {
  userId: string;
  caption: string;
  images: {
    secure_url: string;
    public_id: string;
    mime_type: string;
  }[];
  likes: mongoose.Types.ObjectId[];
  shares: number;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  caption: { type: String, required: true },
  images: [
    {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
      mime_type: { type: String, required: true },
      _id: false,
    },
  ],
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model<IPostDocument>("Post", PostSchema);
