import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse =
    NextResponse.next({
      request,
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          supabaseResponse =
            NextResponse.next({
              request,
            });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  // ==========================================
  // REFRESH / VERIFY SESSION
  // ==========================================

  const {
    data: claimsData,
  } = await supabase.auth.getClaims();

  const pathname =
    request.nextUrl.pathname;

  // ==========================================
  // PUBLIC ADMIN ROUTES
  // ==========================================

  // QUAN TRỌNG:
  // login phải luôn được phép truy cập
  const isAdminLogin =
    pathname === "/admin/login" ||
    pathname.startsWith(
      "/admin/login/"
    );

  // Nếu đang vào trang login
  // thì tuyệt đối không redirect tiếp
  if (isAdminLogin) {
    return supabaseResponse;
  }

  // ==========================================
  // PROTECTED ADMIN ROUTES
  // ==========================================

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminRoute) {
    const userEmail =
      claimsData?.claims?.email;

    const adminEmail =
      process.env.ADMIN_EMAIL;

    const isAdmin =
      typeof userEmail === "string" &&
      typeof adminEmail === "string" &&
      userEmail.toLowerCase() ===
        adminEmail.toLowerCase();

    // Chưa login hoặc không phải admin
    if (!isAdmin) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        "/admin/login";

      loginUrl.search = "";

      loginUrl.searchParams.set(
        "next",
        pathname +
          request.nextUrl.search
      );

      const redirectResponse =
        NextResponse.redirect(loginUrl);

      // Giữ cookie Supabase
      supabaseResponse.cookies
        .getAll()
        .forEach((cookie) => {
          redirectResponse.cookies.set(
            cookie
          );
        });

      return redirectResponse;
    }
  }

  return supabaseResponse;
}