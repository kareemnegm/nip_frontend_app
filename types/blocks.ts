export type BlockType = "TEXT" | "IMAGE" | "VIDEO" | "HTML";

export type Block = {
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string | null;
};

export type BlockRecord = Record<
  string,
  { content: string; blockType: BlockType; elementTag?: string | null }
>;

export type SaveBlockPayload = {
  relUrl: string;
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string;
};

export type DeleteBlockPayload = {
  relUrl: string;
  key: string;
};
