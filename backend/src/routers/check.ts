import express from "express";
import { Threat } from "../models/Threat";

const router = express.Router();

router.post("/check-url", async (req, res) => {
  try {
    const { url } = req.body;

    const cleanUrl = url.replace(/\/$/, "");

    const match = await Threat.findOne({ url: cleanUrl });

    if (match) {
      return res.json({
        safe: false,
        source: match.source,
        riskLevel: match.riskLevel,
      });
    }

    return res.json({ safe: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Check failed" });
  }
});

export default router;
