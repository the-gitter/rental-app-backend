import mongoose, { Document, Schema, model } from "mongoose";
import slugify from "slugify";
import { getUniqueSlug } from "../../utils/generateUniqueSlug";

export interface ICollection extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  desc: string;
  sku: string;
  products: Schema.Types.ObjectId[];
  images: { secure_url: string; public_id: string; mime_type: string }[];
  visibility: boolean;
  slug: string;
  type: "collection" | "setup";
}

const collectionSchema = new Schema<ICollection>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    name: { type: String, required: true },
    desc: { type: String, required: true },
    images: [
      {
        secure_url: String,
        public_id: String,
        mime_type: String,
      },
    ],
    visibility: { type: Boolean, default: true },
    slug: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

collectionSchema.pre("save", async function (next) {
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

export default model<ICollection>("collections", collectionSchema);
