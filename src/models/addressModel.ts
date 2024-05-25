import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    address_line: {
      type: String,
      required: true,
    },
    zip_code: {
      type: Number,
      required: true,
    },
    city_name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("addresses", schema);

export default  AddressModel;
