import "server-only";

import { ASSISTANT_LIMITS } from "@/lib/assistant/config";

export type KnowledgeChunkInput = {
  content: string;
  chunkIndex: number;
  section: string;
};

export function chunkKnowledgeContent(content: string): KnowledgeChunkInput[] {
  const normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) return [];

  const sections = splitSections(normalized);
  const chunks: KnowledgeChunkInput[] = [];

  for (const section of sections) {
    const pieces = splitSection(section.content);
    for (const piece of pieces) {
      chunks.push({
        content: piece,
        chunkIndex: chunks.length,
        section: section.title,
      });
    }
  }

  return chunks;
}

function splitSections(content: string): { title: string; content: string }[] {
  const parts = content.split(/\n(?=#{1,3}\s+)/g);
  if (parts.length === 1) return [{ title: "General", content }];

  return parts.map((part) => {
    const [firstLine, ...rest] = part.split("\n");
    const title = firstLine.replace(/^#{1,3}\s+/, "").trim() || "General";
    const sectionContent = [firstLine.replace(/^#{1,3}\s+/, ""), ...rest].join("\n").trim();
    return { title, content: sectionContent };
  });
}

function splitSection(content: string): string[] {
  const max = ASSISTANT_LIMITS.chunkMaxChars;
  const overlap = ASSISTANT_LIMITS.chunkOverlapChars;
  if (content.length <= max) return [content];

  const chunks: string[] = [];
  let start = 0;

  while (start < content.length) {
    const desiredEnd = Math.min(content.length, start + max);
    const end = chooseBreak(content, start, desiredEnd);
    const chunk = content.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= content.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
}

function chooseBreak(content: string, start: number, desiredEnd: number): number {
  if (desiredEnd >= content.length) return content.length;
  const window = content.slice(start, desiredEnd);
  const paragraphBreak = window.lastIndexOf("\n\n");
  if (paragraphBreak > Math.floor(window.length * 0.55)) return start + paragraphBreak;
  const sentenceBreak = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  if (sentenceBreak > Math.floor(window.length * 0.55)) return start + sentenceBreak + 1;
  const spaceBreak = window.lastIndexOf(" ");
  return spaceBreak > Math.floor(window.length * 0.55) ? start + spaceBreak : desiredEnd;
}
