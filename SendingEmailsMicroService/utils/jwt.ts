import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

const appSettingsPath = path.join(__dirname, "..", "appsettings.json");
const appSettings = JSON.parse(fs.readFileSync(appSettingsPath, "utf8"));

const SECRET = appSettings.JwtSettings.Secret;
const EXPIRY = appSettings.JwtSettings.ExpiryInMinutes;

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, SECRET, { expiresIn: `${EXPIRY}m` });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
