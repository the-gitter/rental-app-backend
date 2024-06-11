import mongoose, { Document, Schema, model } from "mongoose";
import slugify from "slugify";
import { getUniqueSlug } from "../../utils/generateUniqueSlug";

export interface IProduct extends Document {
  user: mongoose.Types.ObjectId;
  slug: string;
  seo_title: string;
  seo_desc: string;
  keywords: string[];
  title: string;
  image: { secure_url: string; public_id: string; mime_type: string };
  category_id: mongoose.Types.ObjectId;
  brand_id: mongoose.Types.ObjectId;
  variants: mongoose.Types.ObjectId[];
  featured_variant: mongoose.Types.ObjectId;
  visibility: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    slug: { type: String },
    seo_title: { type: String, required: true },
    seo_desc: { type: String, required: true },
    keywords: { type: [String], required: true },
    title: { type: String, required: true },
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
      mime_type: { type: String, required: true },
    },
    category_id: { type: Schema.Types.ObjectId, ref: "categories" },
    brand_id: { type: Schema.Types.ObjectId, ref: "brands" },
    variants: [{ type: Schema.Types.ObjectId, ref: "variants" }],
    featured_variant: { type: Schema.Types.ObjectId, ref: "variants" },
    visibility: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (!this.slug || !this.slug.length) {
    this.slug = slugify(this.title.toLowerCase());
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

export default model<IProduct>("Product", productSchema);
