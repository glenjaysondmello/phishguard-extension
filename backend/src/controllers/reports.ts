import { Request, Response } from "express";
import validator from "validator";
import { reportSchema } from "../schemas/report.schema";
import { ReportModel } from "../models/Report";
import { extractHostname } from "../utils/logger";

export const createReport = async (req: Request, res: Response) => {
  try {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const payload = parsed.data;

    const url = payload.url;
    const host = extractHostname(url);
    const reporterId = payload.reporterId;
    const userComment = payload.userComment;

    if (!url && !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ error: "invalid_url" });
    }

    const existingReport = await ReportModel.findOne({
      url,
      status: "pending",
    });

    if (existingReport) {
      if (reporterId && existingReport.reporterIds.includes(reporterId)) {
        return res.status(409).json({ error: "already_reported_by_user" });
      }

      existingReport.reportCount += 1;
      if (reporterId) existingReport.reporterIds.push(reporterId);

      if (userComment) {
        existingReport.comments.push({
          text: userComment,
          createdAt: new Date(),
        });
      }

      await existingReport.save();

      return res
        .status(200)
        .json({ ok: true, id: existingReport._id, updated: true });
    }

    const report = await ReportModel.create({
      ...payload,
      host,
      reportCount: 1,
      reporterIds: reporterId ? [reporterId] : [],
      comments: userComment
        ? [{ text: userComment, createdAt: new Date() }]
        : [],
    });

    return res.status(201).json({ ok: true, id: report._id });
  } catch (error) {
    console.error("createReport error", error);
    return res.status(500).json({ error: "internal_error" });
  }
};

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "reviewed", "resolved", "ignored"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "invalid_status" });
    }

    const report = await ReportModel.findByIdAndUpdate(
      reportId,
      { status },
      { new: true },
    );

    if (!report) {
      return res.status(404).json({ error: "report_not_found" });
    }

    return res.json({ ok: true, data: report.status });
  } catch (error) {
    console.error("updateReportStatus error", error);
    return res.status(500).json({ error: "internal_error" });
  }
};

export const removeReport = async (req: Request, res: Response) => {
  try {
    const reportId = String(req.params.reportId || "").trim();
    if (!reportId) return res.status(400).json({ error: "reportId required" });

    await ReportModel.deleteOne({ _id: reportId });

    return res.json({ ok: true });
  } catch (error) {
    console.error("removeReport error", error);
    return res.status(500).json({ error: "internal_error" });
  }
};

export const listReports = async (req: Request, res: Response) => {
  try {
    const page = Math.max(0, Number(req.query.page) || 0);
    const limit = Math.min(100, Number(req.query.limit) || 25);

    const filter: any = {};

    if (req.query.status) filter.status = req.query.status;

    const reports = await ReportModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    const total = await ReportModel.countDocuments(filter);

    return res.json({ ok: true, total, page, limit, data: reports });
  } catch (error) {
    console.error("listReports error", error);
    return res.status(500).json({ error: "internal_error" });
  }
};
