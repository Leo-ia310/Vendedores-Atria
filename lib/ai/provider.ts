export type AIMessageRole = "system" | "user" | "assistant";

export type AIMessage = {
  role: AIMessageRole;
  content: string;
};

export type AIResponseFormat = {
  type: "json_object";
};

export type GenerateTextOptions = {
  messages: AIMessage[];
  maxTokens: number;
  temperature: number;
  topP?: number;
  model?: string;
  responseFormat?: AIResponseFormat;
};

export type GenerateTextResult = {
  text: string;
  model: string;
  usage?: Record<string, unknown>;
};

export type AIProvider = {
  generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
};

export const DEFAULT_WORKERS_AI_MODEL = "@cf/meta/llama-3.2-3b-instruct";
