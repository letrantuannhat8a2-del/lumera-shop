import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

const adminEmail =
  process.env.ADMIN_EMAIL;

// =====================================================
// CHECK ADMIN
// =====================================================

async function checkAdmin() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ) {
    return false;
  }

  return true;
}

// =====================================================
// GET HOMEPAGE CONTENT
// =====================================================

export async function GET() {
  try {
    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "homepage_content"
        )
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
      console.error(
        "Get homepage content error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load homepage content.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Homepage GET API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE HOMEPAGE CONTENT
// =====================================================

export async function PUT(
  request: Request
) {
  try {
    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    // =================================================
    // GET CURRENT DATA
    // =================================================

    const {
      data: currentData,
      error:
        currentError,
    } =
      await supabaseAdmin
        .from(
          "homepage_content"
        )
        .select("*")
        .eq("id", 1)
        .single();

    if (currentError) {
      console.error(
        "Get current homepage content error:",
        currentError
      );

      return NextResponse.json(
        {
          error:
            "Unable to read current homepage content.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // EXISTING HOMEPAGE DATA
    // =================================================

    const announcement =
      body.announcement ??
      currentData.announcement ??
      {};

    const hero =
      body.hero ??
      currentData.hero ??
      {};

    const categories =
      body.categories ??
      currentData.categories ??
      {
        items: [],
      };

    const editorial =
      body.editorial ??
      currentData.editorial ??
      [];

    const featured =
      body.featured ??
      currentData.featured ??
      {};

    const brand_statement =
      body.brand_statement ??
      currentData.brand_statement ??
      {};

    const footer =
      body.footer ??
      currentData.footer ??
      {};

    const service_strip =
      body.service_strip ??
      currentData.service_strip ??
      {};

    // =================================================
    // NEW: EXCLUSIVE COLLECTION
    // =================================================

    const exclusive =
      body.exclusive ??
      currentData.exclusive ??
      {};

    // =================================================
    // NEW: ABOUT US
    // =================================================

    const about =
      body.about ??
      currentData.about ??
      {};

    // =================================================
    // UPDATE DATABASE
    // =================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "homepage_content"
        )
        .update({
          announcement,

          hero,

          categories,

          editorial,

          featured,

          brand_statement,

          footer,

          service_strip,

          exclusive,

          about,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", 1)
        .select()
        .single();

    // =================================================
    // ERROR
    // =================================================

    if (error) {
      console.error(
        "Update homepage content error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message ||
            "Unable to save homepage content.",
        },
        {
          status: 500,
        }
      );
    }
// =================================================
// REVALIDATE HOMEPAGE
// =================================================

revalidatePath("/");
    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Homepage PUT API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}