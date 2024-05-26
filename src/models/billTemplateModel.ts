import mongoose, { Schema } from "mongoose";

export interface IItemSchema extends Document {
  itemName: string;
  rentCost: number;
  details: string;
  quantity: number;
}
export const ItemSchema = new Schema<IItemSchema>({
  itemName: { type: String, required: true },
  rentCost: { type: Number, required: true },
  quantity: { type: Number, required: true },
  details: String,
});

export interface IBillTemplate extends Document {
  businessId: Schema.Types.ObjectId;
  templateName: string;
  items: [IItemSchema];
  visibility: string;
}

const BillTemplateSchema = new Schema<IBillTemplate>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    templateName: { type: String, required: true },
    items: [ItemSchema],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  { timestamps: true }
);

export default mongoose.model("billTemplats", BillTemplateSchema);
