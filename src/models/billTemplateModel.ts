import mongoose, { Schema } from "mongoose";

export interface IItemSchema extends Document {
  itemName: string;
  rentCost: number;
  details: string;
}
export const ItemSchema = new Schema<IItemSchema>({
  itemName: { type: String, required: true },
  rentCost: { type: Number, required: true },
  details: String,
});

export interface IBillTemplate extends Document {
  business: Schema.Types.ObjectId;
  templateName: string;
  items: [IItemSchema];
}

const BillTemplateSchema = new Schema<IBillTemplate>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    templateName: { type: String, required: true },
    items: [ItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("billTemplats", BillTemplateSchema);
