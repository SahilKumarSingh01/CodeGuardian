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
import RefData from "./models/RefData.js";
import Software from "./models/Software.js";
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

app.post("/test", async (req, res) => {
  const { reference, fingerprint, random } = req.body;

  if (!reference || !fingerprint || !random) {
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }

  try {
    const keyObj = JSON.parse(reference);

    const {
      refDataId,
      softwareId,
      softwareOriginId, // 🔐 NEW
      ticketId,
      randomNum,
      signature
    } = keyObj;

    // 🔐 Rebuild signing string (must match approveTicket)
    const plainString = [
      refDataId,
      softwareId,
      softwareOriginId, // 🔐 product identity
      ticketId,
      randomNum
    ].join(".");

    const verify = crypto.createVerify("SHA256");
    verify.update(plainString);
    verify.end();

    const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");
    const isValid = verify.verify(publicKey, signature, "base64");

    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid reference signature"
      });
    }

    // 🔐 Fetch allowedSessions safely
    const software = await Software
      .findById(softwareId)
      .select("allowedSessions softwareOriginId")
      .lean();

    if (!software) {
      return res.status(404).json({
        status: "error",
        message: "Software not found"
      });
    }

    // 🔐 Extra safety: ensure originId consistency
    if (software.softwareOriginId !== softwareOriginId) {
      return res.status(400).json({
        status: "error",
        message: "Software identity mismatch"
      });
    }

    const { allowedSessions } = software;

    // 🔐 Atomic device binding + limit enforcement
    const result = await RefData.updateOne(
      {
        _id: refDataId,
        $or: [
          { devices: fingerprint },
          { $expr: { $lt: [{ $size: "$devices" }, allowedSessions] } }
        ]
      },
      {
        $addToSet: { devices: fingerprint }
      }
    );

    // 🚫 Hard fail if limit reached
    if (result.matchedCount === 0) {
      return res.status(403).json({
        status: "error",
        message: "Device limit reached"
      });
    }

    res.json({
      status: "success",
      random
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "error",
      message: "Invalid format or key error"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
