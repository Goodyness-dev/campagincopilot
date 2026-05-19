import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Add it to .env.local.");
  }

  return new GoogleGenAI({ apiKey });
}

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY. Add it to .env.local.");
  }

  return new Groq({ apiKey });
}

function extractJson(text: string, provider: "Gemini" | "Groq") {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error(`${provider} did not return a JSON object.`);
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function parseJson<T>(text: string, provider: "Gemini" | "Groq"): T {
  const jsonText = extractJson(text, provider);

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    console.error(`Invalid ${provider} JSON:`, jsonText);
    throw new Error(`${provider} returned invalid JSON.`);
  }
}

function isFallbackWorthyError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("overloaded") ||
    message.includes("temporarily unavailable") ||
    message.includes("503") ||
    message.includes("500")
  );
}

async function generateJsonWithGemini<T>(prompt: string): Promise<T> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
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

  return parseJson<T>(text, "Gemini");
}

async function generateJsonWithGroq<T>(prompt: string): Promise<T> {
  const groq = getGroqClient();

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.65,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content:
          "You are CampaignPilot's structured JSON engine. Return ONLY valid JSON. Do not use markdown. Do not wrap JSON in backticks.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned an empty response.");
  }

  return parseJson<T>(text, "Groq");
}

export async function generateJson<T>(prompt: string): Promise<T> {
  try {
    return await generateJsonWithGemini<T>(prompt);
  } catch (error) {
    console.error("Gemini generation failed:", error);

    if (!isFallbackWorthyError(error)) {
      throw error;
    }

    console.warn("Falling back to Groq for this stage.");

    try {
      return await generateJsonWithGroq<T>(prompt);
    } catch (fallbackError) {
      console.error("Groq fallback failed:", fallbackError);

      const primaryMessage =
        error instanceof Error ? error.message : "Gemini failed.";

      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : "Groq failed.";

      throw new Error(
        `AI generation failed. Gemini: ${primaryMessage} Groq: ${fallbackMessage}`
      );
    }
  }
}