import { NextResponse } from "next/server";

import { createClient } from "../../lib/supabase/sever";


// ========================================
// GET
// Lấy wishlist của user đang đăng nhập
// ========================================

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { data, error } =
      await supabase
        .from("wishlist")
        .select(
          `
            id,
            product_id,
            created_at
          `
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Wishlist GET error:",
        error
      );

      return NextResponse.json(
        {
          error: "Unable to load wishlist.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "Wishlist request error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}


// ========================================
// POST
// Thêm sản phẩm vào wishlist
// ========================================

export async function POST(
  request: Request
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const productId =
      body?.product_id;

    if (!productId) {
      return NextResponse.json(
        {
          error:
            "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabase
        .from("wishlist")
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select()
        .single();

    if (error) {

      // Sản phẩm đã có trong wishlist
      if (
        error.code === "23505"
      ) {
        return NextResponse.json(
          {
            message:
              "Product already in wishlist.",
          },
          {
            status: 200,
          }
        );
      }

      console.error(
        "Wishlist POST error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to add product to wishlist.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      data,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Wishlist POST request error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to add product to wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}


// ========================================
// DELETE
// Xóa sản phẩm khỏi wishlist
// ========================================

export async function DELETE(
  request: Request
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const productId =
      body?.product_id;

    if (!productId) {
      return NextResponse.json(
        {
          error:
            "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq(
          "product_id",
          productId
        );

    if (error) {
      console.error(
        "Wishlist DELETE error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to remove product from wishlist.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Wishlist DELETE request error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove product from wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}