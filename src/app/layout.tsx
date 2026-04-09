import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentOS — AI 协作平台",
  description: "AI Agent 驱动的多人协作工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style>{`
          /* ── 全局自定义滚动条 ── */
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
          ::-webkit-scrollbar-thumb:hover { background: #F05A28; }
          ::-webkit-scrollbar-corner { background: transparent; }
          * { scrollbar-width: thin; scrollbar-color: #2A2A2A transparent; }
          /* 像素光标闪烁 */
          @keyframes pixel-blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .pixel-blink { animation: pixel-blink 1s step-end infinite; }
        `}</style>
      </head>
      <body
        className="min-h-full flex flex-col overflow-x-hidden overflow-y-auto"
        style={{ background: '#0A0A0A', paddingTop: 48 }}
      >
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}