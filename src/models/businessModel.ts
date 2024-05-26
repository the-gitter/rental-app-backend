import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBusiness extends Document {
  owner: Types.ObjectId;
  businessName: string;
  banner: {
    secure_url: string;
    public_id: string;
    mime_type: string;
  };
  description?: string;
  address: {
    type: "Point";
    coordinates: [number, number];
  };
  contactNumber?: string;
  alternativecontactNumber?: string;
  category?: string;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    businessName: { type: String, required: true },
    banner: {
      type: {
        secure_url: String,
        public_id: String,
        mime_type: String,
      },
      _id: false,
    },
    description: String,
    address: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    contactNumber: String,
    alternativecontactNumber: String,
    category: String,
  },
  { timestamps: true }
);

BusinessSchema.index({ address: "2dsphere" });

export default mongoose.model<IBusiness>("businesses", BusinessSchema);
