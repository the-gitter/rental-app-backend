import mongoose, { Schema } from "mongoose";
export interface INotification {
  user: string;
  message: string;
  payload: any;
  read: boolean;
  type: "bill" | "promotion" | "alert" | "info" | "warning" | "alert";
}
const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["info", "warning", "alert", "bill", "promotion", "alert"],
      required: true,
    },
    payload: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("notifications", NotificationSchema);
