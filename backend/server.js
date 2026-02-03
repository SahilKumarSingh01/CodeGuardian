import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import softwareRoutes from "./routes/softwareRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { tokenHandler } from "./middlewares/tokenHandler.js";

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
app.use(tokenHandler);

// Load keys from env (handle escaped newlines for Vercel)
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

// Routes
app.use("/auth", authRoutes);
app.use("/software", softwareRoutes);
app.use("/ticket", ticketRoutes);
app.use("/user", userRoutes);

let isConnected = false;

async function connect() {
    // If already connected, skip
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGO_URL is not defined in environment variables.");
        }

        // Set max listeners to avoid warning
        mongoose.connection.setMaxListeners(20);
        
        // Security: Add connection pooling to prevent database exhaustion during high traffic/attacks
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,      // Limit concurrent connections to prevent exhaustion
            minPoolSize: 2,       // Maintain minimum connections for performance
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("MONGODB CONNECTED");

    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
connect();
// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI).then(() => {
//   console.log("MongoDB connected");
// })
//   .catch(err => console.log(err));


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
