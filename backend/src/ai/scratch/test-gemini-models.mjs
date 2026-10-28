// Test gemini-3.8-flash (API recommended model) and OpenRouter NVIDIA fallback
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// ---- Test gemini-3.8-flash ----
const model = 'gemini-3.8-flash';
process.stdout.write(`[TEST] Trying model: ${model} ... `);
try {
  const response = await ai.models.generateContent({
    model,
    contents: 'Say hello in 3 words.',
  });
  if (response?.text) {
    console.log(`SUCCESS — "${response.text.trim().slice(0, 60)}"`);
  } else {
    console.log('empty response');
    console.log('Full response:', JSON.stringify(response, null, 2).slice(0, 400));
  }
} catch (e) {
  console.log(`FAILED: ${(e.message || 'unknown').slice(0, 400)}`);
}

// ---- Test OpenRouter NVIDIA with the correct (paid) model slug ----
const nvidiaKey = process.env.NVIDIA_API_KEY;
const nvidiaModel = 'nvidia/nemotron-3-nano-30b-a3b'; // no :free suffix
const nvidiaEndpoint = 'https://openrouter.ai/api/v1/chat/completions';

process.stdout.write(`[TEST] Trying NVIDIA model: ${nvidiaModel} ... `);
try {
  const res = await fetch(nvidiaEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nvidiaKey}`,
    },
    body: JSON.stringify({
      model: nvidiaModel,
      messages: [{ role: 'user', content: 'Say hello in 3 words.' }],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.log(`HTTP ${res.status} FAILED: ${txt.slice(0, 300)}`);
  } else {
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    console.log(`SUCCESS — "${text?.slice(0, 80)}"`);
  }
} catch (e) {
  console.log(`NETWORK ERROR: ${e.message}`);
}
