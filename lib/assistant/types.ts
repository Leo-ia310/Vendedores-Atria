export type KnowledgeCategory =
  | "product"
  | "pricing"
  | "sales"
  | "competition"
  | "policies"
  | "sellers"
  | "faq"
  | "general";

export type KnowledgeStatus = "draft" | "active" | "inactive" | "archived";

export type AssistantRole = "user" | "assistant";

export type AssistantConfidence = "high" | "medium" | "low";

export type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  status: KnowledgeStatus;
  priority: number;
  official: boolean;
  createdBy: string;
  version: number;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeSource = {
  title: string;
  category: KnowledgeCategory;
};

export type RetrievedKnowledgeChunk = {
  chunkId: string;
  documentId: string;
  title: string;
  category: KnowledgeCategory;
  tags: string[];
  content: string;
  similarity: number;
  chunkIndex: number;
};

export type AssistantMessage = {
  id: string;
  conversationId: string;
  role: AssistantRole;
  content: string;
  sources: KnowledgeSource[];
  confidence?: AssistantConfidence;
  createdAt: string;
};

export type AssistantConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type AssistantChatHistoryMessage = {
  role: AssistantRole;
  content: string;
};

export type AssistantChatResponse = {
  conversationId: string;
  message: {
    id: string;
    content: string;
  };
  sources: KnowledgeSource[];
  confidence: AssistantConfidence;
};
