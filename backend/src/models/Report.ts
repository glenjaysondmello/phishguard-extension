import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  url: string;
  host: string;
  pageTitle?: string;
  userComment?: string;
  userAgent?: string;
  fromExtension: boolean;
  createdAt: Date;
  status: "pending" | "reviewed" | "ignored";
}

const ReportSchema = new Schema<IReport>(
  {
    url: { type: String, required: true },
    host: { type: String, required: true, index: true },
    pageTitle: { type: String },
    userComment: { type: String },
    userAgent: { type: String },
    fromExtension: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "ignored"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReportModel = model<IReport>("Report", ReportSchema);
