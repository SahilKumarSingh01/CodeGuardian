import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3000;

// Allow requests from your frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL, // <-- replace with your frontend URL
  credentials: true, // <-- allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

// Load keys from env (handle escaped newlines for Vercel)
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

// Routes
app.use("/auth", authRoutes);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/codeguardian").then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.post("/test", (req, res) => {
  const { reference, fingerprint, random } = req.body;
  if (!reference || !fingerprint || random === undefined) {
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }

  const payload = { reference, fingerprint, random, status: "yes" };
  const jsonString = JSON.stringify(payload);

  const sign = crypto.createSign("SHA256");
  sign.update(jsonString);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  console.log("Client payload:", payload);
  console.log("Signature:", signature);

  res.json({
    status: "success",
    message: "Request received and signed",
    payload: jsonString,
    signature,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
