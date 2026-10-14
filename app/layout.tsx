import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const notoSansLao = localFont({
  src: "../public/fonts/NotoSansLao-VariableFont_wdth,wght.ttf",
  variable: "--font-lao",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snowking POS | Point of Sale System",
  description:
    "A web-based point-of-sale system for beverage store operations, featuring product management, cart management, and payment calculations.",
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo" className={cn("h-full", "antialiased", notoSansLao.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
