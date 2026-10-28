import { generateWithGemini } from '../providers/gemini.provider.js';
import { generateWithNvidia } from '../providers/nvidia.provider.js';

console.log('[TEST] GEMINI_MODEL env:', process.env.GEMINI_MODEL || '(not set — default: gemini-2.0-flash)');
console.log('[TEST] NVIDIA_API_KEY prefix:', process.env.NVIDIA_API_KEY?.slice(0, 8) || '(not set)');
console.log('[TEST] NVIDIA_MODEL env:', process.env.NVIDIA_MODEL || '(not set)');
console.log('---');

// Test Gemini
try {
  const result = await generateWithGemini('Say hello in exactly 3 words as plain text. Do not use JSON.');
  console.log('[TEST] Gemini SUCCESS:', result.provider, result.model);
  console.log('[TEST] Gemini response:', result.text?.slice(0, 120));
} catch (e) {
  console.error('[TEST] Gemini FAILED:', e.message);
  if (e.status) console.error('[TEST] Gemini HTTP status:', e.status);
}

console.log('---');

// Test NVIDIA
try {
  const result = await generateWithNvidia('Say hello in exactly 3 words as plain text. Do not use JSON.');
  console.log('[TEST] NVIDIA SUCCESS:', result.provider, result.model);
  console.log('[TEST] NVIDIA response:', result.text?.slice(0, 120));
} catch (e) {
  console.error('[TEST] NVIDIA FAILED:', e.message);
}

