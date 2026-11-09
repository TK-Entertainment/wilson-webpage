import { allDocs, allMeta } from "contentlayer/generated";
import { createContentlayer } from "next-docs-zeta/contentlayer";

export const { tree, getPage, getPageUrl } = createContentlayer(
  allMeta,
  allDocs,
);

// 研究（content/docs/research）有自己的「研究」分頁：
// 研究頁的側欄只放研究，學習日常的側欄不放研究
type Node = (typeof tree)["children"][number];
const isResearchFolder = (node: Node) =>
  node.type === "folder" &&
  node.children.some(
    (n) => n.type === "page" && n.url.startsWith("/docs/research"),
  );

export const researchTree = {
  ...tree,
  children: tree.children.filter(isResearchFolder),
};

export const notesTree = {
  ...tree,
  children: tree.children.filter((node) => !isResearchFolder(node)),
};

export const isResearchUrl = (url: string) => url.startsWith("/docs/research");
