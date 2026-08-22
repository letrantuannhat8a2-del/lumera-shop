"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";


export default function TawkChat() {

  const pathname = usePathname();


  // Ẩn chat trong admin
  if (pathname.startsWith("/admin")) {
    return null;
  }


  return (
    <Script
      id="tawk-widget"
      src="https://embed.tawk.to/6a8934f5bc557a344a5e4987/1k0jvdno4"
      strategy="afterInteractive"
    />
  );
}