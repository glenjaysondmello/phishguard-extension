import { Request, Response } from "express";
import validator from "validator";
import { reportSchema } from "../schemas/report.schema";
import { ReportModel } from "../models/Report";
import { extractHostname } from "../utils/logger";
import { create } from "domain";

export async function createReport(req: Request, res: Response) {
  try {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const payload = parsed.data;

    const url = payload.url;
    const host = extractHostname(url);

    if (!validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ error: "invalid_url" });
    }

    const report = await ReportModel.create({
      ...payload,
      url,
      host,
    });

    return res.status(201).json({ ok: true, id: report._id });
  } catch (error) {
    console.error("createReport error", error);
    return res.status(500).json({ error: "internal_error" });
  }
}

export async function listReports(req: Request, res: Response) {
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
}
