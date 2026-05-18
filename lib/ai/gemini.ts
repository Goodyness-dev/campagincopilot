import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Add it to .env.local.");
  }

  return new GoogleGenAI({ apiKey });
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Gemini did not return a JSON object.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

export async function generateJson<T>(prompt: string): Promise<T> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: 0.65,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const jsonText = extractJson(text);

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    console.error("Invalid Gemini JSON:", jsonText);
    throw new Error("Gemini returned invalid JSON.");
  }
}