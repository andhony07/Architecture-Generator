export const generateWithNvidia = async (prompt) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured in backend environment.");
  }

  const isOpenRouter = apiKey.startsWith("sk-or-");
  const defaultModel = isOpenRouter
    ? "nvidia/nemotron-3-nano-30b-a3b"
    : "nvidia/nemotron-4-340b-instruct";

  const modelName = process.env.NVIDIA_MODEL || defaultModel;
  const endpoint = isOpenRouter
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://integrate.api.nvidia.com/v1/chat/completions";

  console.log(`[AI] Fallback provider active: NVIDIA Nemotron (${modelName})`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMsg = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        parsedMsg = errorJson.error?.message || errorJson.message || parsedMsg;
      } catch {
        parsedMsg = errorText.slice(0, 200);
      }
      throw new Error(`NVIDIA Nemotron API returned HTTP ${response.status}: ${parsedMsg}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (generatedText) {
      return {
        text: generatedText,
        provider: "nvidia",
        model: modelName,
      };
    }

    throw new Error("NVIDIA Nemotron returned empty text response.");
  } catch (error) {
    console.error(`[AI] NVIDIA Nemotron provider error (${modelName}):`, error.message || error);
    throw error;
  }
};
