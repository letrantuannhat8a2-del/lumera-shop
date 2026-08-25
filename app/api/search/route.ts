import { NextResponse } from "next/server";

import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json([]);
    }

    const { data, error } =
      await supabaseAdmin
        .from("products")
        .select(
          `
            id,
            name,
            slug,
            price,
            currency,
            image_1
          `
        )
        .eq("is_active", true)
        .ilike("name", `%${query}%`)
        .order("created_at", {
          ascending: false,
        })
        .limit(8);

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

    return NextResponse.json(
      data ?? []
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