"use client";

import Script from "next/script";


export default function TawkChat() {

  return (
    <Script
      id="tawk-chat"
      src="https://embed.tawk.to/6a8934f5bc557a344a5e4987/1k0jvdno4"
      strategy="afterInteractive"
    />
  );
}