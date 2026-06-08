import { apiFetch } from "@/lib/api/client";
import type {
  Block,
  BlockRecord,
  DeleteBlockPayload,
  SaveBlockPayload,
} from "@/types/blocks";

/** Fetch all CMS blocks for a page path. Backend contract TBD. */
export async function getBlocksForPage(relUrl: string): Promise<BlockRecord> {
  try {
    const blocks = await apiFetch<Block[]>("/api/v1/blocks", {
      params: { relUrl },
      cache: "no-store",
    });
    return Object.fromEntries(
      blocks.map((b) => [
        b.key,
        { content: b.content, blockType: b.blockType, elementTag: b.elementTag },
      ]),
    );
  } catch {
    return {};
  }
}

export async function saveBlock(payload: SaveBlockPayload) {
  return apiFetch("/api/v1/blocks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlock(payload: DeleteBlockPayload) {
  return apiFetch("/api/v1/blocks", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}
