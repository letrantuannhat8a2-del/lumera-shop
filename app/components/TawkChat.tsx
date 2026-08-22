"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";


export default function TawkChat() {

  const pathname = usePathname();


  // Không hiển thị chat trong trang admin
  if (pathname.startsWith("/admin")) {
    return null;
  }


  return (
    <Script
      id="tawk-chat"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();

        (function () {

          var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];

          s1.async = true;

          s1.src =
          "https://embed.tawk.to/6a8934f5bc557a344a5e4987/1k0jvdno4";

          s1.charset = "UTF-8";

          s1.setAttribute(
            "crossorigin",
            "*"
          );

          s0.parentNode.insertBefore(
            s1,
            s0
          );

        })();

        `,
      }}
    />
  );
}