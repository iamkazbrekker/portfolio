import type { Metadata } from "next";
import { supplyMono, supplySans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samarth Kapse",
  description: "Portfolio or smth, idk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${supplyMono.variable} ${supplySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
