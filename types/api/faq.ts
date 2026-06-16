export type ApiFaq = {
  id: number;
  question: string;
  answer: string;
  order_no?: number | null;
  category?: string | null;
};
