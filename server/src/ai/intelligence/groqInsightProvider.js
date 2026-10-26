/* global AbortController, fetch */

import { parseMeetingInsight } from "./meetingInsightSchema.js";

export class GroqInsightProvider {
  constructor({
    apiKey = process.env.GROQ_API_KEY,
    baseUrl = process.env.GROQ_API_BASE_URL || "https://api.groq.com/openai/v1",
    model = process.env.GROQ_SUMMARY_MODEL || "llama-3.3-70b-versatile",
    timeoutMs = Number(process.env.AI_SUMMARY_TIMEOUT_MS || 60_000),
  } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.model = model;
    this.timeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60_000;
  }

  get name() {
    return "groq";
  }

  async generate({ transcript, meetingTitle }) {
    if (!this.apiKey) throw new Error("GROQ_API_KEY is not configured");
    if (!transcript || typeof transcript !== "string") throw new Error("Transcript is required");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: [
                "You convert meeting transcripts into factual structured meeting intelligence.",
                "Return JSON only with keys summary, decisions, actionItems.",
                "summary must be concise and grounded only in the transcript.",
                "decisions must contain only explicit decisions or commitments.",
                "actionItems must be objects with text, ownerHint and dueDateHint.",
                "Do not invent owners, dates, decisions, metrics, or commitments.",
                "Use empty strings when owner or due date is not explicit.",
              ].join(" "),
            },
            {
              role: "user",
              content: `Meeting title: ${meetingTitle || "Untitled meeting"}\n\nTranscript:\n${transcript.slice(0, 120000)}`,
            },
          ],
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === "AbortError") throw new Error("Meeting intelligence provider timed out");
      throw new Error("Meeting intelligence provider is unreachable");
    } finally {
      clearTimeout(timer);
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const providerMessage = payload?.error?.message;
      throw new Error(
        typeof providerMessage === "string"
          ? `Meeting intelligence provider rejected the request: ${providerMessage.slice(0, 300)}`
          : `Meeting intelligence provider returned HTTP ${response.status}`
      );
    }

    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("Meeting intelligence provider returned no content");

    return {
      provider: this.name,
      model: this.model,
      providerRequestId: typeof payload?.id === "string" ? payload.id : "",
      ...parseMeetingInsight(content),
    };
  }
}
