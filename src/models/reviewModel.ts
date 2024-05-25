import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: String,
    response: String,
  }, { timestamps: true });
  
  export defaultmongoose.model('Review', ReviewSchema);
    