import { cache } from "react";
import { apiFetch } from "./client";

export type BlockType = "TEXT" | "IMAGE" | "VIDEO" | "HTML";

export type Block = {
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string | null;
};

export type BlockRecord = Record<
  string,
  {
    content: string | null;
    blockType: BlockType;
    elementTag?: string | null;
  }
>;

export const getBlocksForPage = cache(async (relUrl: string): Promise<BlockRecord> => {
  try {
    const blocks = await apiFetch<Block[]>("/api/v1/blocks", {
      params: { relUrl },
    });
    return Object.fromEntries(
      blocks.map((block) => [
        block.key,
        {
          content: block.content,
          blockType: block.blockType,
          elementTag: block.elementTag,
        },
      ]),
    );
  } catch {
    return {};
  }
});

export async function saveBlock(payload: {
  relUrl: string;
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string;
}) {
  return apiFetch("/api/v1/blocks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlock(payload: { relUrl: string; key: string }) {
  return apiFetch("/api/v1/blocks", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}
