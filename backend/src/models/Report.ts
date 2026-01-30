import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  url: string;
  host: string;
  pageTitle?: string;
  userComment?: string;
  userAgent?: string;
  fromExtension: boolean;
  reportCount: number;
  createdAt: Date;
  reporterIds: string[];
  comments: {
    text: string;
    createdAt: Date;
  }[];
  status: "pending" | "reviewed" | "resolved" | "ignored";
}

const ReportSchema = new Schema<IReport>(
  {
    url: { type: String, required: true },
    host: { type: String, required: true, index: true },
    pageTitle: { type: String },
    userComment: { type: String },
    userAgent: { type: String },
    fromExtension: { type: Boolean, default: true },
    reportCount: { type: Number, default: 0 },
    reporterIds: { type: [String], default: [] },
    comments: [
      {
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "ignored"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const ReportModel = model<IReport>("Report", ReportSchema);
