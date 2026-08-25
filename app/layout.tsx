import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { CartProvider } from "./context/CartContext";
import TawkChat from "./components/TawkChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUMÉRA | Luxury Dresses",
  description:
    "Discover elegant luxury dresses from LUMÉRA.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <CartProvider>
          {children}
        </CartProvider>

        {/* TAWK.TO LIVE CHAT */}
        <TawkChat />

      </body>
    </html>
  );
}