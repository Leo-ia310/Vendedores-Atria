import "server-only";

import { cloudflareWorkersAIProvider } from "@/lib/ai/cloudflare";
import { chunkKnowledgeContent } from "@/lib/assistant/chunking";
import type { KnowledgeDocument } from "@/lib/assistant/types";
import {
  replaceKnowledgeChunks,
  type KnowledgeChunkForIndex,
} from "@/lib/assistant/store";

export async function reindexKnowledgeDocument(document: KnowledgeDocument): Promise<number> {
  if (document.status !== "active") {
    await replaceKnowledgeChunks(document, []);
    return 0;
  }

  const chunks = chunkKnowledgeContent(document.content);
  if (chunks.length === 0) {
    await replaceKnowledgeChunks(document, []);
    return 0;
  }

  const result = await cloudflareWorkersAIProvider.generateEmbedding({
    texts: chunks.map((chunk) => `${document.title}\n${chunk.section}\n${chunk.content}`),
  });

  const indexedChunks: KnowledgeChunkForIndex[] = chunks.map((chunk, index) => ({
    ...chunk,
    embedding: result.embeddings[index],
  }));

  return replaceKnowledgeChunks(document, indexedChunks);
}
