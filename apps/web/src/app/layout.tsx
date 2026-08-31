import type { ReactNode } from "react";
import "./globals.css";
import "./overlay.css";
import "./v2.css";
import "./workflow.css";
import "./light-theme.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
