import express from "express";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

// Routes
import authRoutes from "./routes/auth.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import internshipRoutes from "./routes/internship.routes.js";

const app = express();

// ── Core Middleware ───────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestIp.mw());

// ── CORS ─────────────────────────────────────────────
const allowedOrigins = new Set([
  process.env["CLIENT_URL"] ?? "http://localhost:8080",
  "http://localhost:8080",
  "http://localhost:5173",
]);

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// ── API Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/internships", internshipRoutes);

// ── Health Check ─────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "InternPortal API is running 🚀" });
});

// ── 404 + Error Handlers ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  },
);

export default app;
