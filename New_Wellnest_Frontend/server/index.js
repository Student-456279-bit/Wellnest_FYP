import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.post("/api/auth/signin", (req, res) => {
    const { email, password } = req.body;
    // In a real application, you should validate the credentials
    if (email && password) {
      res.json({
        success: true,
        message: "Login successful",
        user: { email: email, name: "Dummy User" },
        token: "dummy-jwt-token",
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/demo", handleDemo);

  return app;
}
