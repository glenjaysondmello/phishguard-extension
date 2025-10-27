import { Request, Response, NextFunction } from "express";

export function adminApiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.header("x-admin-api-key") || req.query.api_key || "";
  const expected = process.env.ADMIN_API_KEY || "";

  if (!expected) {
    console.warn("ADMIN_API_KEY not set — admin endpoints are unprotected!");
  }

  if (expected && apiKey !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }

  (req as any).apiKeyUser = true;
  return next();
}
