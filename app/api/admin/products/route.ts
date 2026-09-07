import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

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

  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (
    !user?.email ||
    !adminEmail ||
    user.email.toLowerCase() !==
      adminEmail.toLowerCase()
  ) {
    return false;
  }

  return true;
}

// =====================================================
// GET PRODUCTS FOR ADMIN
// =====================================================

export async function GET() {
  try {
    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ===============================================
    // PRODUCTS
    // ===============================================

    const {
      data: products,
      error: productsError,
    } =
      await supabaseAdmin
        .from("products")
        .select(`
          id,
          name,
          price,
          is_active,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (productsError) {
      console.error(
        "Load admin products error:",
        productsError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load products.",
        },
        {
          status: 500,
        }
      );
    }

    const safeProducts =
      products ?? [];

    // ===============================================
    // PRODUCT IMAGES
    // ===============================================

    const productIds =
      safeProducts.map(
        (product) =>
          product.id
      );

    let images: {
      product_id: string;
      image_url: string;
      sort_order: number;
    }[] = [];

    if (productIds.length > 0) {
      const {
        data: imageData,
        error: imagesError,
      } =
        await supabaseAdmin
          .from("product_images")
          .select(`
            product_id,
            image_url,
            sort_order
          `)
          .in(
            "product_id",
            productIds
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          );

      if (imagesError) {
        console.error(
          "Load product images error:",
          imagesError
        );

        return NextResponse.json(
          {
            error:
              "Unable to load product images.",
          },
          {
            status: 500,
          }
        );
      }

      images =
        imageData ?? [];
    }

    // ===============================================
    // FIRST IMAGE PER PRODUCT
    // ===============================================

    const firstImageByProduct =
      new Map<
        string,
        string
      >();

    for (const image of images) {
      if (
        !firstImageByProduct.has(
          image.product_id
        )
      ) {
        firstImageByProduct.set(
          image.product_id,
          image.image_url
        );
      }
    }

    const result =
      safeProducts.map(
        (product) => ({
          ...product,

          image_1:
            firstImageByProduct.get(
              product.id
            ) ?? null,
        })
      );

    // ===============================================
    // RETURN
    // ===============================================

    return NextResponse.json(
      {
        success: true,
        products: result,
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
      "Admin products API error:",
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