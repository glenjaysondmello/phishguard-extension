import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AdminModel } from "../models/Admin";
import { loginSchema } from "../schemas/auth.schema";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const REFRESH_COOKIE_NAME =
  process.env.REFRESH_COOKIE_NAME || "phishguard_refresh_token";

export const createInitialAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email_password_required" });

  try {
    const existingAdmin = await AdminModel.findOne({
      email: email.token.toLowerCase(),
    });
    if (existingAdmin) {
      return res.status(400).json({ error: "admin_already_exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await AdminModel.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    return res.status(201).json({ ok: true, id: newAdmin._id });
  } catch (error) {
    return res.status(500).json({ error: "internal_server_error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const parseREsult = loginSchema.safeParse(req.body);
  if (!parseREsult.success) {
    return res
      .status(400)
      .json({ error: "invalid_request", details: parseREsult.error.flatten() });
  }

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email_password_required" });

  try {
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const accessToken = signAccessToken({ sub: admin._id, email: admin.email });
    const refreshToken = signRefreshToken({ sub: admin._id });

    admin.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      ip: req.ip,
    });
    await admin.save();

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN || "localhost",
      path: "/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.json({
      accessToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    });
  } catch (error) {
    return res.status(500).json({ error: "internal_server_error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const cookie = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
  if (!cookie) return res.status(401).json({ error: "no_refresh_token" });

  try {
    let payload: any;

    try {
      payload = verifyRefreshToken(cookie) as any;
    } catch (err) {
      return res.status(401).json({ error: "invalid_refresh" });
    }

    const admin = await AdminModel.findById(payload.sub);
    if (!admin) return res.status(401).json({ error: "invalid_refresh" });

    const found = admin.refreshTokens.find((rt) => rt.token === cookie);
    if (!found) return res.status(401).json({ error: "refresh_not_found" });

    const newRefresh = signRefreshToken({ sub: admin._id });
    admin.refreshTokens = admin.refreshTokens.filter(
      (rt) => rt.token !== cookie
    );
    admin.refreshTokens.push({
      token: newRefresh,
      createdAt: new Date(),
      ip: req.ip,
    });
    await admin.save();

    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    res.cookie(REFRESH_COOKIE_NAME, newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: cookieDomain,
      path: "/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const accessToken = signAccessToken({ sub: admin._id, email: admin.email });
    return res.json({
      accessToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    });
  } catch (error) {
    return res.status(500).json({ error: "internal_server_error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookie = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
  if (!cookie) return res.status(400).json({ error: "no_refresh_token" });

  try {
    const payload = verifyRefreshToken(cookie) as { sub: string };

    await AdminModel.updateOne(
      { _id: payload.sub },
      {
        $pull: { refreshTokens: { token: cookie } },
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "internal_server_error" });
  }

  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  res.clearCookie(REFRESH_COOKIE_NAME, {
    path: "/auth/refresh",
    domain: cookieDomain,
  });

  return res.json({ ok: true });
};