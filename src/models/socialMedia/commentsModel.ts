import mongoose, { Schema, Document } from 'mongoose';

export interface ICommentDocument extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: mongoose.Types.ObjectId, ref: 'posts', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const CommentModel = mongoose.model<ICommentDocument>('comments', CommentSchema);
