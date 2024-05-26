import mongoose, { Schema, Document } from "mongoose";

export interface AccessTokenDocument extends Document {
  token: string;
}

export interface RefreshTokenDocument extends Document {
  token: string;
  userdocId: string;
  expiresAt: Date;
}

const AccessTokenSchema: Schema = new Schema({
  token: { type: String, required: true },
});

const RefreshTokenSchema: Schema = new Schema({
  token: { type: String, required: true },
  userdocId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const AccessTokenModel = mongoose.model<AccessTokenDocument>(
  "AccessToken",
  AccessTokenSchema
);
export const RefreshTokenModel = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
