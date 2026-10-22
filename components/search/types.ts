export type SearchSection = "blog" | "docs" | "gallery";

export interface SearchEntry {
  type: SearchSection;
  title: string;
  description: string;
  tags: string[];
  body: string;
  url: string;
  date?: string;
}
