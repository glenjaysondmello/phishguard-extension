import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

import { initSentry } from './sentry';

// import { adminApiKeyMiddleware } from "./middleware/authApiKey";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routers/auth";
import blacklistRouter from "./routers/blacklist";
import reportRouter from "./routers/report";

dotenv.config();
initSentry();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["moz-extention://5aada905-217b-45d2-83d7-d591dad55b74", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);

// rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 60),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// DB connection
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in environment");
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

// Routes
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// // Public: reports endpoint (used by extension)
// app.post("/reports", createReport);

// // Admin routes (protected)
// app.get("/admin/reports", adminApiKeyMiddleware, listReports);
// app.post("/admin/blacklist", adminApiKeyMiddleware, addToBlacklist);
// app.get("/admin/blacklist", adminApiKeyMiddleware, listBlacklist);
// app.delete(
//   "/admin/blacklist/:domain",
//   adminApiKeyMiddleware,
//   removeFromBlacklist
// );

app.use("/auth", authRouter);
app.use("/blacklist", blacklistRouter);
app.use("/report", reportRouter);

// SENTRY TEST ROUTE
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// static simple root
app.get("/", (_req, res) => res.send("PhishGuard API"));

// SENTRY'S ERROR HANDLER
// app.use(Sentry.expressErrorHandler());
Sentry.setupExpressErrorHandler(app);

// Error handler last
app.use(errorHandler);

// start server
const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
