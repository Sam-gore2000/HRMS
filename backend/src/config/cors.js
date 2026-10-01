import { env } from "./env.js";

const allowedOrigins = new Set([env.clientOrigin]);
const localhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || localhostOrigin.test(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
};
