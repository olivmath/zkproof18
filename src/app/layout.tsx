import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ToastProvider } from "./components/ToastProvider";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} bg-background text-foreground font-sans antialiased min-h-screen`}
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
