// 安全標頭：限制網頁能載入的外部資源、禁止被其他網站嵌入、強制 HTTPS
// - 'unsafe-eval'：文章內容（contentlayer MDX）在瀏覽器端以 new Function 執行，必須保留
// - giscus.app：留言區 iframe；youtube-nocookie.com：相簿的 <YouTube> 影片
// - cloudflareinsights：Cloudflare 若開啟網頁分析會自動注入的統計程式
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src https://giscus.app https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // 家目錄另有 package-lock.json，明確指定專案根目錄，免得 Next 15 猜錯
  outputFileTracingRoot: __dirname,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const { withContentlayer } = require("next-contentlayer2");

module.exports = withContentlayer(config);
