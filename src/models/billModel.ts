import mongoose, { Schema } from "mongoose";
import { IItemSchema, ItemSchema } from "./billTemplateModel";
export interface IBill {
  business: Schema.Types.ObjectId;
  customer: Schema.Types.ObjectId;
  // template: Schema.Types.ObjectId;
  items: IItemSchema[];
  totalCost: number;
  finalCost:number;
  issueDate: Date;
  status: string;
  
  invoiceNumber: string;
  paymentInfo: {
    method: string;
    transactionId: string;
    status: string;
  };
}
const BillSchema = new Schema<IBill>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: "users", required: true },
    // template: {
    //   type: Schema.Types.ObjectId,
    //   ref: "billTemplats",
    //   required: true,
    // },
    items: [{ type: ItemSchema, required: true }],
    totalCost: { type: Number, required: true },
    finalCost: { type: Number, required: true },
    issueDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["issued", "paid", "cancelled"],
      default: "issued",
    },
    invoiceNumber: { type: String, required: true, unique: true },
    paymentInfo: {
      method: String,
      transactionId: String,
      status: {
        type: String,
        enum: ["pending", "complated", "failed"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("bills", BillSchema);
