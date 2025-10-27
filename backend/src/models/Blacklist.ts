import { Schema, model, Document } from "mongoose";

export interface IBlacklist extends Document {
  domain: string; // normalized domain like example.com
  reason?: string;
  addedBy?: string;
  createdAt: Date;
}

const BlacklistSchema = new Schema<IBlacklist>(
  {
    domain: { type: String, required: true, unique: true, index: true },
    reason: { type: String },
    addedBy: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const BlacklistModel = model<IBlacklist>("Blacklist", BlacklistSchema);
