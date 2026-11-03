import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Mufrodat Academy — Belajar Kosakata Bahasa Arab", template: "%s | Mufrodat Academy" },
  description: "Belajar kosakata bahasa Arab secara bertahap melalui kamus, audio, dan latihan interaktif.",
  applicationName: "Mufrodat Academy",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <div><span className="brand-mark small">م</span><strong>Mufrodat Academy</strong></div>
            <p>Belajar satu kata, membuka satu dunia.</p>
            <span>© {new Date().getFullYear()} Mufrodat Academy</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
