"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TawkChat() {
  const pathname = usePathname();

  const isAdmin =
    pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    // Tawk có thể đã được load trước đó
    // nên chỉ return null là chưa đủ.
    const hideTawk = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).Tawk_API
      ) {
        (window as any).Tawk_API.hideWidget();
      }
    };

    hideTawk();

    const timer =
      setTimeout(hideTawk, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isAdmin]);

  // Không load Tawk ở admin
  if (isAdmin) {
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