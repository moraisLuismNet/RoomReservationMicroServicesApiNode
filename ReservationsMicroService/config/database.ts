import { DataSource } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { Reservation } from "../models/Reservation";
import { ReservationStatus } from "../models/ReservationStatus";

// Load environment variables
dotenv.config();

const appSettingsPath = path.join(__dirname, "..", "appsettings.json");
const appSettings = JSON.parse(fs.readFileSync(appSettingsPath, "utf8"));

const dbSettings = appSettings.DatabaseSettings;
const provider = dbSettings.Provider;

// Use environment variables if available; otherwise, use appsettings.json
let connectionString: string;

if (
  process.env.DB_HOST &&
  process.env.DB_NAME &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD
) {
  connectionString = `Host=${process.env.DB_HOST};Database=${process.env.DB_NAME};Username=${process.env.DB_USER};Password=${process.env.DB_PASSWORD};`;
} else if (appSettings.ConnectionStrings?.DefaultConnection) {
  connectionString = appSettings.ConnectionStrings.DefaultConnection;
} else {
  connectionString = dbSettings.ConnectionStrings.PostgreSQL;
}

const pgMatch = connectionString.match(
  /Host=([^;]+);Database=([^;]+);Username=([^;]+);Password=([^;]+);/
);

let config: any = {
  synchronize: true,
  logging: true,
  entities: [Reservation, ReservationStatus],
  migrations: [path.join(__dirname, "..", "migrations", "*.ts")],
};

if (provider === "PostgreSQL" && pgMatch) {
  config = {
    ...config,
    type: "postgres",
    host: pgMatch[1],
    database: pgMatch[2],
    username: pgMatch[3],
    password: pgMatch[4],
    port: 5432,
  };
} else {
  throw new Error(
    `Unsupported database provider: ${provider} or invalid connection string`
  );
}

export const AppDataSource = new DataSource(config);
