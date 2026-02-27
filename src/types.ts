export enum Mode {
  REVIEW = "review",
  COMPANION = "companion",
  CHALLENGE = "challenge",
}

export type AIProvider = "google" | "openai" | "anthropic";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
}

export interface Message {
  id: string;
  role: "user" | "modelA" | "modelB" | "system";
  content: string;
  modelName?: string;
  metrics?: {
    timeMs: number;
    codeLength: number;
    language: string;
  };
  challengeId?: string;
}

export interface ApiKeys {
  google?: string;
  openai?: string;
  anthropic?: string;
}
