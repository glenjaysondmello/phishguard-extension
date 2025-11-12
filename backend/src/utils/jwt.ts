import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

export const signAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_SECRET as Secret, { expiresIn: ACCESS_EXPIRES } as SignOptions);
}

export const signRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET as Secret, { expiresIn: REFRESH_EXPIRES } as SignOptions);
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET as Secret);
}

export const verifyRefreshToken = (token: string) => {
     return jwt.verify(token, REFRESH_SECRET as Secret);
}

