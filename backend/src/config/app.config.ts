import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "mongodb://127.0.0.1:27017/taskmanager"),

  SESSION_SECRET: getEnv("SESSION_SECRET", "taskmanager_dev_session_secret"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", `${24 * 60 * 60 * 1000}`),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", ""),
  GOOGLE_CALLBACK_URL: getEnv(
    "GOOGLE_CALLBACK_URL",
    "http://localhost:5000/api/auth/google/callback"
  ),

  FRONTEND_ORIGIN: getEnv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173,http://127.0.0.1:5173"
  ),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv(
    "FRONTEND_GOOGLE_CALLBACK_URL",
    "http://localhost:5173/google/oauth/callback"
  ),
});

export const config = appConfig();
