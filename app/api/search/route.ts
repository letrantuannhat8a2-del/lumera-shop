import { NextResponse } from "next/server";

import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams
        .get("q")
        ?.trim() || "";

    // =====================================================
    // EMPTY QUERY
    // =====================================================

    if (!query) {
      return NextResponse.json(
        []
      );
    }

    // =====================================================
    // SEARCH PRODUCTS
    // =====================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("products")
        .select(
          `
            id,
            name,
            slug,
            price,
            currency,
            image_1,
            image_2,
            category
          `
        )
        .eq(
          "is_active",
          true
        )
        .ilike(
          "name",
          `%${query}%`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(8);

    // =====================================================
    // DATABASE ERROR
    // =====================================================

    if (error) {
      console.error(
        "Search error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to search products.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      data ?? [],
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
      "Search request error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to search products.",
      },
      {
        status: 500,
      }
    );
  }
}