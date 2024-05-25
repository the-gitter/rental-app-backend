import mongoose, { Schema } from "mongoose";
export interface INotification {
  user: string;
  message: string;
  read: boolean;
  type: string;
}
const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["info", "warning", "alert"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("notifications", NotificationSchema);
