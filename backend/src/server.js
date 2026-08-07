import dotenv from "dotenv";
dotenv.config();
console.log({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "FOUND" : "MISSING",
  GOOGLE_GENAI_USE_VERTEX_AI: process.env.GOOGLE_GENAI_USE_VERTEX_AI,
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_APPLICATION_CREDENTIALS:
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();