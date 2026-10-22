"use client";

import { I18nProvider } from "next-docs-ui/i18n";
import type { ReactNode } from "react";

// next-docs-ui 介面文字改成中文（例如筆記右側的「On this page」）
const text = {
  toc: "本頁目錄",
  search: "搜尋",
  searchNoResult: "找不到符合的內容",
  light: "淺色",
  dark: "深色",
  system: "跟隨系統",
  lastUpdate: "最後更新",
};

export default function DocsI18n({ children }: { children: ReactNode }) {
  return (
    <I18nProvider value={{ locale: "zh-TW", onChange: () => {}, text }}>
      {children}
    </I18nProvider>
  );
}
