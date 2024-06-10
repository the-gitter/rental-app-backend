import mongoose, { Document, Schema, model } from "mongoose";

import slugify from "slugify";
import { getUniqueSlug } from "../../utils/generateUniqueSlug";

export interface IBrand extends Document {
  user: string;
  name: string;
  logo_url: {
    secure_url: string;
    public_id: string;
    mime_type: string;
  };
  description?: string;

}

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    logo_url: {
      type: {
        secure_url: String,
        public_id: String,
        mime_type: String,
      },
      _id: false,
    },
    description: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    slug: String,
  },
  { timestamps: true }
);



brandSchema.pre("save", async function (next) {
  if (!this.slug || !this.slug.length) {
    this.slug = slugify(this.name.toLowerCase());
  }
  const usedSlugsList = await (this.constructor as any).distinct("slug", {
    _id: { $ne: this._id },
    slug: {
      $regex: `^${this.slug}`,
      $options: "i",
    },
  });
  if (usedSlugsList.length) {
    this.slug = getUniqueSlug(this.slug, usedSlugsList);
  }

  next();
});

export default model<IBrand>("brands", brandSchema);
