import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

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
    // ==========================================
    // 1. GET CURRENT LOGGED-IN USER
    // ==========================================

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError) {
      console.error(
        "Get current user error:",
        userError
      );
    }

    if (!user?.id || !user.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const accountEmail =
      user.email.trim().toLowerCase();

    // ==========================================
    // 2. GET ORDER NUMBER FROM URL
    // ==========================================

    const { orderNumber } =
      await context.params;

    const safeOrderNumber =
      typeof orderNumber === "string"
        ? orderNumber.trim()
        : "";

    if (!safeOrderNumber) {
      return NextResponse.json(
        {
          error:
            "Order number is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 3. LOAD ONLY THIS USER'S ORDER
    // ==========================================

    const {
      data: order,
      error: orderError,
    } =
      await supabaseAdmin
        .from("orders")
        .select(`
          id,
          order_number,
          created_at,

          total,
          currency,

          payment_status,
          order_status,

          items,

          email,

          first_name,
          last_name,
          phone,

          country,
          address_line1,
          address_line2,
          city,
          state_region,
          postal_code,

          shipping_method,

          subtotal,
          shipping_fee
        `)
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "order_number",
          safeOrderNumber
        )
        .maybeSingle();

    // ==========================================
    // 4. DATABASE ERROR
    // ==========================================

    if (orderError) {
      console.error(
        "Failed to load order:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "Failed to load order.",
        },
        {
          status: 500,
        }
      );
    }

    // ==========================================
    // 5. ORDER NOT FOUND
    // ==========================================

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // 6. NORMALIZE ITEMS
    // ==========================================

    const safeItems =
      Array.isArray(order.items)
        ? order.items
        : [];

    // ==========================================
    // 7. SHIPPING ADDRESS
    // ==========================================

    const shippingAddress = {
      name:
        `${order.first_name ?? ""} ${
          order.last_name ?? ""
        }`.trim(),

      address:
        [
          order.address_line1,
          order.address_line2,
        ]
          .filter(Boolean)
          .join(", "),

      city:
        order.city ?? "",

      province:
        order.state_region ?? "",

      postal_code:
        order.postal_code ?? "",

      country:
        order.country ?? "",

      phone:
        order.phone ?? "",
    };

    // ==========================================
    // 8. RETURN
    // ==========================================

    return NextResponse.json(
      {
        success: true,

        email:
          accountEmail,

        order: {
          ...order,

          items:
            safeItems,

          shipping_address:
            shippingAddress,

          customer_name:
            `${order.first_name ?? ""} ${
              order.last_name ?? ""
            }`.trim(),
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",

          Pragma:
            "no-cache",

          Expires:
            "0",
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
      {
        status: 500,
      }
    );
  }
}