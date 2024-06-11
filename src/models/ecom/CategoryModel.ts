// CategoryModel.js
import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { getUniqueSlug } from "../../utils/generateUniqueSlug";
export interface ICategory extends Document {
  user: string;
  name: string;
  image: {
    secure_url: String;
    public_id: String;
    mime_type: String;
  };
  slug: string;
}

const categorySchema = new Schema({
  user: {
    ref: "users",
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  image: {
    type: {
      secure_url: String,
      public_id: String,
      mime_type: String,
    },
    required: true,
  },
  slug: String,
});

categorySchema.pre("save", async function (next) {
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
const CategoryModel = mongoose.model<ICategory>("categories", categorySchema);

export default CategoryModel;
