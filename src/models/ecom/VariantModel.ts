import mongoose, { Document, Schema, model } from "mongoose";
import slugify from "slugify";
import { getUniqueSlug } from "../../utils/generateUniqueSlug";

export interface IVariant extends Document {
  user: mongoose.Types.ObjectId;
  product_ref: mongoose.Types.ObjectId;
  name: string;
  desc: string;
  sku: string;
  // discount_id: mongoose.Types.ObjectId;
  price: number;
  images: { secure_url: string; public_id: string; mime_type: string }[];
  status: "unlisted" | "visible";
  slug: string;
}

const variantSchema = new Schema<IVariant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    product_ref: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    sku: { type: String, required: true },
    // discount_id: { type: Schema.Types.ObjectId, ref: "discounts", required: true },
    price: { type: Number, required: true },
    images: [
      {
        secure_url: String,
        public_id: String,
        mime_type: String,
      },
    ],
    status: {
      type: String,
      default: "visible",
    },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

variantSchema.pre("save", async function (next) {
  if (!this.slug || !this.slug.length) {
    this.slug = slugify(this.name.toLowerCase());
  }
  const usedSlugsList = await (this.constructor as any).distinct("slug", {
    _id: { $ne: this._id },
    slug: { $regex: `^${this.slug}`, $options: "i" },
  });
  if (usedSlugsList.length) {
    this.slug = getUniqueSlug(this.slug, usedSlugsList);
  }
  next();
});

export default model<IVariant>("Variant", variantSchema);
