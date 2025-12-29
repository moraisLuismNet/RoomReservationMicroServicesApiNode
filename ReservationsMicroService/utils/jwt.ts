import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use environment variables if available; otherwise, use appsettings.json
const SECRET = process.env.JWT_SECRET || "your_very_secret_key_here";
const EXPIRY_MINUTES = process.env.JWT_EXPIRES_IN
  ? parseInt(process.env.JWT_EXPIRES_IN)
  : 1440; // 24 hours

if (!process.env.JWT_SECRET) {
  console.log(
    "Warning: Using JWT configuration from appsettings.json. Consider moving to .env file."
  );
}

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, SECRET, { expiresIn: `${EXPIRY_MINUTES}m` });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
