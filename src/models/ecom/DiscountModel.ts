import mongoose, { Document, Schema, model } from "mongoose";

export interface IDiscount extends Document {
  variant_ref: mongoose.Types.ObjectId;
  name: string;
  desc: string;
  discount_percent: number;
  active: boolean;
}

const discountSchema = new Schema<IDiscount>(
  {
    variant_ref: { type: Schema.Types.ObjectId, ref: "variants", required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    discount_percent: { type: Number, required: true, default: 0 },
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default model<IDiscount>("discounts", discountSchema);
