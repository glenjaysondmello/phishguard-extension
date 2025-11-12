import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  refreshTokens: { token: string; createdAt: Date; ip?: string }[];
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
        ip: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const AdminModel = model<IAdmin>("Admin", AdminSchema);