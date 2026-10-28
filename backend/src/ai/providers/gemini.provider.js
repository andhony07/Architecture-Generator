import { GoogleGenAI } from "@google/genai";

export const generateWithGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend environment.");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const ai = new GoogleGenAI({ apiKey });

  console.log(`[AI] Primary provider active: Gemini (${modelName})`);

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0] && response.candidates[0].content.parts[0].text) {
      return {
        text: response.text,
        provider: "gemini",
        model: modelName,
      };
    }

    throw new Error("Gemini API returned an empty text response.");
  } catch (error) {
    console.error(`[AI] Gemini provider error (${modelName}):`, error.message || error);
    throw error;
  }
};