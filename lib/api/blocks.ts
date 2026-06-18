import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { apiGet, apiPost, apiRequest } from "./client";

export type BlockType = "TEXT" | "IMAGE" | "VIDEO" | "HTML";

export type Block = {
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string | null;
  locale?: string;
};

export type BlockRecord = Record<
  string,
  {
    content: string | null;
    blockType: BlockType;
    elementTag?: string | null;
    locale?: string;
  }
>;

export const getBlocksForPage = cache(
  async (relUrl: string, locale: Locale = defaultLocale): Promise<BlockRecord> => {
    try {
      const blocks = await apiGet<Block[]>("/blocks", {
        params: { relUrl },
        locale,
        revalidate: false,
      });
      return Object.fromEntries(
        blocks.map((block) => [
          block.key,
          {
            content: block.content,
            blockType: block.blockType,
            elementTag: block.elementTag,
            locale: block.locale ?? locale,
          },
        ]),
      );
    } catch {
      return {};
    }
  },
);

export async function saveBlock(
  payload: {
    relUrl: string;
    key: string;
    locale: Locale;
    content: string;
    blockType: BlockType;
    elementTag?: string;
  },
  token?: string,
) {
  return apiPost("/blocks", payload, { token, revalidate: false });
}

export async function deleteBlock(
  payload: {
    relUrl: string;
    key: string;
    locale: Locale;
  },
  token?: string,
) {
  return apiRequest("/blocks", {
    method: "DELETE",
    body: payload,
    token,
    revalidate: false,
  });
}
