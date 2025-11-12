import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token) as any;
    (req as any).adminId = payload.sub;
    (req as any).adminEmail = payload.email;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}
