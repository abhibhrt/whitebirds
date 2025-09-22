import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

import authentication from "./routes/authentication.js";
import usercart from "./routes/usercart.js";
import orders from "./routes/orders.js";
import userprofile from "./routes/userprofile.js";
import reviews from "./routes/reviews.js";
import personal from "./routes/personal.js";
import products from "./routes/products.js";

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === "production" || false;

// ---------- Security Middlewares ----------
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(helmet({
  contentSecurityPolicy: isProd ? undefined : false,
}));

// Rate limiting: 100 requests / 15 mins per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(compression());

// ---------- Routes ----------
app.use("/api/auth", authentication);
app.use("/api/cart", usercart);
app.use("/api/orders", orders);
app.use("/api/profile", userprofile);
app.use("/api/reviews", reviews);
app.use("/api/personal", personal);
app.use("/api/products", products);

// ---------- Health Check ----------
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Welcome to WhiteBirds" });
});

// ---------- 404 Handler ----------
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: isProd ? "Internal Server Error" : err.message,
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${isProd ? "production" : "development"} mode on port ${PORT}`);
});