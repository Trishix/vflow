import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { groq, createGroq } from "@ai-sdk/groq";
import { xai, createXai } from "@ai-sdk/xai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

export const providers: Record<
  string,
  {
    models: string[];
    keyUrl: string;
    createModel: (apiKey: string, modelId: string, reasoning?: boolean) => LanguageModel;
  }
> = {
  "Google Generative AI": {
    keyUrl: "https://aistudio.google.com/apikey",
    models: [
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemma-3-27b-it",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      return googleProvider(modelId);
    },
  },
  Groq: {
    keyUrl: "https://console.groq.com/keys",
    models: [
      "gemma2-9b-it",
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "llama-3.3-70b-instruct",
      "llama-4-scout-17b-16e-instruct",
      "llama-4-maverick-17b-128e-instruct",
      "deepseek-r1-distill-llama-70b",
      "deepseek-r1-distill-qwen-32b",
      "qwen-qwq-32b",
      "qwen-2.5-32b",
      "mistral-saba-24b",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const groqProvider = createGroq({ apiKey });
      return groqProvider(modelId);
    },
  },
  OpenAI: {
    keyUrl: "https://platform.openai.com/api-keys",
    models: [
      "o1",
      "o1-mini",
      "o3-mini",
      "o3",
      "o4-mini",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-4.5-preview",
      "gpt-3.5-turbo",
      "chatgpt-4o-latest",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const openaiProvider = createOpenAI({ apiKey });
      return openaiProvider(modelId);
    },
  },
  Anthropic: {
    keyUrl: "https://console.anthropic.com/settings/keys",
    models: [
      "claude-4-opus-20250514",
      "claude-4-sonnet-20250514",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-latest",
      "claude-3-opus-latest",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const anthropicProvider = createAnthropic({ apiKey });
      return anthropicProvider(modelId);
    },
  },
  OpenRouter: {
    keyUrl: "https://openrouter.ai/settings/keys",
    models: [
      "openai/gpt-4.1-mini",
      "openai/gpt-4o-mini",
      "openai/gpt-4.1",
      "anthropic/claude-sonnet-4",
      "anthropic/claude-4-opus",
      "anthropic/claude-4-sonnet",
      "meta-llama/llama-3.3-70b-instruct",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      "mistralai/mistral-small-3.1-24b-instruct",
      "qwen/qwen3-32b",
      "deepseek/deepseek-chat",
      "google/gemini-2.0-flash-001",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const openrouter = createOpenAICompatible({
        name: "openrouter",
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      });
      return openrouter(modelId);
    },
  },
  xAI: {
    keyUrl: "https://console.x.ai/",
    models: [
      "grok-3",
      "grok-3-fast",
      "grok-3-mini",
      "grok-3-mini-fast",
      "grok-2-1212",
      "grok-2",
      "grok-beta",
    ],
    createModel(apiKey: string, modelId: string, _reasoning?: boolean) {
      const xaiProvider = createXai({ apiKey });
      return xaiProvider(modelId);
    },
  },
};
