import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AIModel, ApiKeys } from "../types";

export type { AIModel };

const DEFAULT_GOOGLE_KEY = process.env.GEMINI_API_KEY;

export const MODELS: AIModel[] = [
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", provider: "google" },
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", provider: "google" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
  { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", provider: "anthropic" },
  { id: "claude-3-opus-latest", name: "Claude 3 Opus", provider: "anthropic" },
];

function getGoogleAi(key?: string) {
  const apiKey = key || DEFAULT_GOOGLE_KEY;
  if (!apiKey) throw new Error("Google API Key is missing.");
  return new GoogleGenAI({ apiKey });
}

export async function* generateStream(
  model: AIModel,
  prompt: string,
  keys: ApiKeys,
  systemInstruction?: string
) {
  if (model.provider === "google") {
    const ai = getGoogleAi(keys.google);
    const response = await ai.models.generateContentStream({
      model: model.id,
      contents: prompt,
      config: { systemInstruction },
    });
    for await (const chunk of response) {
      yield (chunk as GenerateContentResponse).text || "";
    }
  } else if (model.provider === "openai") {
    if (!keys.openai) throw new Error("OpenAI API Key is missing. Please add it in settings.");
    const openai = new OpenAI({ apiKey: keys.openai, dangerouslyAllowBrowser: true });
    const stream = await openai.chat.completions.create({
      model: model.id,
      messages: [
        ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
      stream: true,
    });
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  } else if (model.provider === "anthropic") {
    if (!keys.anthropic) throw new Error("Anthropic API Key is missing. Please add it in settings.");
    const anthropic = new Anthropic({ apiKey: keys.anthropic, dangerouslyAllowBrowser: true });
    const stream = anthropic.messages.stream({
      model: model.id,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [{ role: "user", content: prompt }],
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  }
}

export async function generate(
  model: AIModel,
  prompt: string,
  keys: ApiKeys,
  systemInstruction?: string
) {
  if (model.provider === "google") {
    const ai = getGoogleAi(keys.google);
    const response = await ai.models.generateContent({
      model: model.id,
      contents: prompt,
      config: { systemInstruction },
    });
    return response.text || "";
  } else if (model.provider === "openai") {
    if (!keys.openai) throw new Error("OpenAI API Key is missing. Please add it in settings.");
    const openai = new OpenAI({ apiKey: keys.openai, dangerouslyAllowBrowser: true });
    const response = await openai.chat.completions.create({
      model: model.id,
      messages: [
        ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
    });
    return response.choices[0]?.message?.content || "";
  } else if (model.provider === "anthropic") {
    if (!keys.anthropic) throw new Error("Anthropic API Key is missing. Please add it in settings.");
    const anthropic = new Anthropic({ apiKey: keys.anthropic, dangerouslyAllowBrowser: true });
    const response = await anthropic.messages.create({
      model: model.id,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [{ role: "user", content: prompt }],
    });
    return (response.content[0] as any).text || "";
  }
  return "";
}
