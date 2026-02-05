import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import cloudinary from "./cloudinary.js";

import dotenv from "dotenv";

dotenv.config();
// console.log(process.env.CLIENT_URL);
// Configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:process.env.CLIENT_URL+ "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
           const result = await cloudinary.uploader.upload(profile.photos[0].value, {
                  folder: "profile",
                  type: "authenticated",  // Private upload
                  format: "webp",         // Best compression
                  transformation: [
                      { width: 100, height: 100, crop: "fill" },  // Exact dimensions, crop to fit
                      { quality: "auto:low" },                   // Lower quality for better compression
                      { fetch_format: "auto" }                   // Use best format (WebP, JPEG)
                  ]
              });
          const photo =result.secure_url;
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photoUrl: photo,//profile.photos[0].value, // save photo URL
          });
        }

        done(null, user);
      } catch (err) {
        console.error("Google OAuth authentication error:", err);
        done(err, null);
      }
    }
  )
);

export default passport;
