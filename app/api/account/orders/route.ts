import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    // ==========================================
    // 1. GET CURRENT LOGGED-IN USER
    // ==========================================

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "Get current user error:",
        userError
      );
    }

    if (!user?.email) {
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
      user.email.trim();

    // ==========================================
    // 2. LOAD ALL ORDERS
    // ==========================================

    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
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
        email
      `)
      .ilike(
        "email",
        accountEmail
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (ordersError) {
      console.error(
        "Failed to load orders:",
        ordersError
      );

      return NextResponse.json(
        {
          error:
            "Failed to load orders.",
        },
        {
          status: 500,
        }
      );
    }

    // ==========================================
    // 3. NORMALIZE ORDER DATA
    // ==========================================

    const safeOrders =
      Array.isArray(orders)
        ? orders.map((order) => ({
            ...order,

            items:
              Array.isArray(
                order.items
              )
                ? order.items
                : [],
          }))
        : [];

    // ==========================================
    // 4. RETURN
    // ==========================================

    return NextResponse.json(
      {
        success: true,

        email: accountEmail,

        orders: safeOrders,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Orders API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading orders.",
      },
      {
        status: 500,
      }
    );
  }
}