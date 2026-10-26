import { GroqInsightProvider } from "./groqInsightProvider.js";

export function getMeetingInsightProvider() {
  const provider = (process.env.AI_PROVIDER || "groq").toLowerCase();
  if (provider === "groq") return new GroqInsightProvider();
  throw new Error(`Unsupported meeting intelligence provider: ${provider}`);
}
