// 留言區（giscus，留言存放在 GitHub Discussions）設定
//
// 啟用步驟見 README「留言區」一節：開啟 repo 的 Discussions、安裝 giscus app，
// 再到 https://giscus.app 產生設定，把 category 與 categoryId 填進來即可。
export const commentsConfig: {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
} = {
  repo: "TK-Entertainment/wilson-webpage",
  repoId: "R_kgDOKXkJtQ",
  /** Discussions 分類名稱，例如 "Comments" */
  category: "",
  /** Discussions 分類 ID，例如 "DIC_kwDOKXkJtc4C..." */
  categoryId: "",
};

// categoryId 還沒填就顯示「留言區準備中」
export const commentsEnabled = commentsConfig.categoryId !== "";
