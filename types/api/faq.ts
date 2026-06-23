export type ApiFaq = {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number | null;
  category?: string | null;
};

export type ApiFaqsResponse = {
  items: ApiFaq[];
  total: number;
};
