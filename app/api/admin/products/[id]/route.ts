import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const IMAGE_BUCKET = "product-image";
const VIDEO_BUCKET = "product-video";

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
// GET STORAGE PATH FROM PUBLIC URL
// =====================================================

function getStoragePath(
  publicUrl: string | null,
  bucket: string
) {
  if (!publicUrl) {
    return null;
  }

  const marker =
    `/storage/v1/object/public/${bucket}/`;

  const index =
    publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return publicUrl.substring(
    index + marker.length
  );
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // ==========================================
    // 1. CHECK ADMIN
    // ==========================================

    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // 2. PRODUCT ID
    // ==========================================

    const { id } =
      await params;

    const productId =
      typeof id === "string"
        ? id.trim()
        : "";

    if (!productId) {
      return NextResponse.json(
        {
          message:
            "Missing product ID.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 3. GET PRODUCT
    // ==========================================

    const {
      data: product,
      error: productError,
    } =
      await supabaseAdmin
        .from("products")
        .select(`
          id,
          video_url
        `)
        .eq(
          "id",
          productId
        )
        .maybeSingle();

    if (productError) {
      throw productError;
    }

    if (!product) {
      return NextResponse.json(
        {
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // 4. GET PRODUCT IMAGES
    // ==========================================

    const {
      data: images,
      error: imagesError,
    } =
      await supabaseAdmin
        .from("product_images")
        .select(`
          id,
          image_url
        `)
        .eq(
          "product_id",
          productId
        );

    if (imagesError) {
      throw imagesError;
    }

    // ==========================================
    // 5. DELETE VARIANTS
    // ==========================================

    const {
      error: variantsDeleteError,
    } =
      await supabaseAdmin
        .from("product_variants")
        .delete()
        .eq(
          "product_id",
          productId
        );

    if (variantsDeleteError) {
      throw variantsDeleteError;
    }

    // ==========================================
    // 6. DELETE IMAGE DATABASE ROWS
    // ==========================================

    const {
      error: imagesDeleteError,
    } =
      await supabaseAdmin
        .from("product_images")
        .delete()
        .eq(
          "product_id",
          productId
        );

    if (imagesDeleteError) {
      throw imagesDeleteError;
    }

    // ==========================================
    // 7. DELETE PRODUCT
    // ==========================================

    const {
      error: deleteProductError,
    } =
      await supabaseAdmin
        .from("products")
        .delete()
        .eq(
          "id",
          productId
        );

    if (deleteProductError) {
      throw deleteProductError;
    }

    // ==========================================
    // 8. DELETE IMAGE STORAGE FILES
    // ==========================================

    const imagePaths =
      (images ?? [])
        .map((image) =>
          getStoragePath(
            image.image_url,
            IMAGE_BUCKET
          )
        )
        .filter(
          (
            path
          ): path is string =>
            Boolean(path)
        );

    if (imagePaths.length > 0) {
      const {
        error: imageStorageError,
      } =
        await supabaseAdmin
          .storage
          .from(IMAGE_BUCKET)
          .remove(imagePaths);

      if (imageStorageError) {
        console.error(
          "Unable to remove product images:",
          imageStorageError
        );
      }
    }

    // ==========================================
    // 9. DELETE VIDEO STORAGE FILE
    // ==========================================

    const videoPath =
      getStoragePath(
        product.video_url,
        VIDEO_BUCKET
      );

    if (videoPath) {
      const {
        error: videoStorageError,
      } =
        await supabaseAdmin
          .storage
          .from(VIDEO_BUCKET)
          .remove([
            videoPath,
          ]);

      if (videoStorageError) {
        console.error(
          "Unable to remove product video:",
          videoStorageError
        );
      }
    }

    // ==========================================
    // 10. SUCCESS
    // ==========================================

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Delete product failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}