import { NextResponse } from "next/server";

import { createClient } from "../../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderNumber } = await context.params;

    if (!orderNumber) {
      return NextResponse.json(
        {
          error:
            "Order number is required.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: order, error } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq(
          "order_number",
          orderNumber
        )
        .eq("email", user.email)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load order:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to load order.",
        },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        email: user.email,
        order,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Order detail API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading the order.",
      },
      { status: 500 }
    );
  }
}
