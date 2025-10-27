import { Request, Response } from "express";
import { blacklistSchema } from "../schemas/blacklist.schema";
import { BlacklistModel } from "../models/Blacklist";

export async function addToBlacklist(req: Request, res: Response) {
  try {
    const parsed = blacklistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { domain, reason } = parsed.data;

    const doc = await BlacklistModel.findOneAndUpdate(
      { domain },
      { domain, reason, addedBy: null },
      { upsert: true, new: true }
    );

    return res.status(201).json({ ok: true, data: doc });
  } catch (error) {
    console.error("addToBlacklist error", error);
    return res.status(500).json({ error: "internal_error" });
  }
}

export async function listBlacklist(req: Request, res: Response) {
  try {
    const docs = await BlacklistModel.find()
      .sort({ createdAt: -1 })
      .limit(1000);

    return res.json({ ok: true, data: docs });
  } catch (error) {
    console.error("listBlacklist error", error);
    return res.status(500).json({ error: "internal_error" });
  }
}

export async function removeFromBlacklist(req: Request, res: Response) {
  try {
    const domain = String(req.params.domain || "")
      .toLowerCase()
      .trim();
    if (!domain) return res.status(400).json({ error: "domain required" });

    await BlacklistModel.deleteOne({ domain });

    return res.json({ ok: true });
  } catch (error) {
    console.error("removeFromBlacklist error", error);
    return res.status(500).json({ error: "internal_error" });
  }
}
