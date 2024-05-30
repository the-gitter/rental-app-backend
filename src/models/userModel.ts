import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  uid: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  bio: string;
  phone_number: string;
  photo_url: {
    secure_url: string;
    public_id: string;
    mime_type: string;
    uploaded_type: "url" | "cloud";
  };
  role: [];
  address: Types.ObjectId;
  accountStatus: "active" | "inactive" | "suspended";
  // billHistory: Types.ObjectId[];
}

const schema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      default: "",
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    phone_number: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    photo_url: {
      type: {
        secure_url: String,
        public_id: String,
        mime_type: String,
        uploaded_type: {
          type: String,
          enum: ["url", "cloud"],
          default: "url",
        },
      },
      _id: false,
    },
    role: [
      {
        type: String,
        enum: ["customer", "businessOwner"],
        required: true,
      },
    ],
    address: {
      type: Schema.Types.ObjectId,
      ref: "addresses",
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    // billHistory: [{ type: Schema.Types.ObjectId, ref: "bills" }],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("users", schema);

export default UserModel;
