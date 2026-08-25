import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const BUCKET = "product-video";

// ========================================
// CHECK ADMIN
// ========================================

async function checkAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ) {
    return false;
  }

  return true;
}

// ========================================
// UPLOAD VIDEO
// ========================================

export async function POST(
  request: Request
) {
  try {
    // CHECK ADMIN

    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // GET FORM DATA

    const formData =
      await request.formData();

    const file =
      formData.get(
        "video"
      ) as File | null;

    const productId =
      String(
        formData.get(
          "productId"
        ) ?? ""
      );

    const slug =
      String(
        formData.get(
          "slug"
        ) ?? ""
      );

    if (!file) {
      return NextResponse.json(
        {
          message:
            "No video uploaded",
        },
        {
          status: 400,
        }
      );
    }

    if (!productId || !slug) {
      return NextResponse.json(
        {
          message:
            "Missing product information",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // CHECK FILE TYPE
    // ========================================

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Only MP4, WebM or MOV videos are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // CHECK FILE SIZE
    // ========================================

    const maxSize =
      50 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {
      return NextResponse.json(
        {
          message:
            "Video must be smaller than 50 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // GET OLD VIDEO
    // ========================================

    const {
      data: product,
      error: productError,
    } =
      await supabaseAdmin
        .from("products")
        .select(
          "video_url"
        )
        .eq(
          "id",
          productId
        )
        .single();

    if (productError) {
      throw productError;
    }

    // ========================================
    // DELETE OLD VIDEO
    // ========================================

    if (
      product?.video_url
    ) {
      const marker =
        `/product-video/`;

      const markerIndex =
        product.video_url.indexOf(
          marker
        );

      if (
        markerIndex !== -1
      ) {
        const oldFilePath =
          product.video_url.substring(
            markerIndex +
              marker.length
          );

        if (
          oldFilePath
        ) {
          await supabaseAdmin
            .storage
            .from(BUCKET)
            .remove([
              oldFilePath,
            ]);
        }
      }
    }

    // ========================================
    // SAFE FILE NAME
    // ========================================

    const safeName =
      file.name
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-zA-Z0-9.-]/g,
          "-"
        );

    // ========================================
    // FILE PATH
    // ========================================

    const filePath =
      `${slug}/video-${Date.now()}-${safeName}`;

    // ========================================
    // CONVERT FILE
    // ========================================

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    // ========================================
    // UPLOAD STORAGE
    // ========================================

    const {
      error: uploadError,
    } =
      await supabaseAdmin
        .storage
        .from(BUCKET)
        .upload(
          filePath,
          buffer,
          {
            contentType:
              file.type,

            upsert: false,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    // ========================================
    // GET PUBLIC URL
    // ========================================

    const {
      data: urlData,
    } =
      supabaseAdmin
        .storage
        .from(BUCKET)
        .getPublicUrl(
          filePath
        );

    const videoUrl =
      urlData.publicUrl;

    // ========================================
    // SAVE URL TO PRODUCT
    // ========================================

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("products")
        .update({
          video_url:
            videoUrl,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          productId
        );

    if (updateError) {
      // Nếu database update lỗi,
      // cố gắng xóa file vừa upload.

      await supabaseAdmin
        .storage
        .from(BUCKET)
        .remove([
          filePath,
        ]);

      throw updateError;
    }

    // ========================================
    // SUCCESS
    // ========================================

    return NextResponse.json({
      success: true,
      url: videoUrl,
    });
  } catch (error) {
    console.error(
      "Upload video failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Upload video failed",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// DELETE VIDEO
// ========================================

export async function DELETE(
  request: Request
) {
  try {
    // CHECK ADMIN

    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      productId,
    } =
      await request.json();

    if (!productId) {
      return NextResponse.json(
        {
          message:
            "Missing product ID",
        },
        {
          status: 400,
        }
      );
    }

    // GET VIDEO URL

    const {
      data: product,
      error: fetchError,
    } =
      await supabaseAdmin
        .from("products")
        .select(
          "video_url"
        )
        .eq(
          "id",
          productId
        )
        .single();

    if (fetchError) {
      throw fetchError;
    }

    // DELETE STORAGE FILE

    if (
      product?.video_url
    ) {
      const marker =
        `/product-video/`;

      const markerIndex =
        product.video_url.indexOf(
          marker
        );

      if (
        markerIndex !== -1
      ) {
        const filePath =
          product.video_url.substring(
            markerIndex +
              marker.length
          );

        if (
          filePath
        ) {
          await supabaseAdmin
            .storage
            .from(BUCKET)
            .remove([
              filePath,
            ]);
        }
      }
    }

    // CLEAR DATABASE

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("products")
        .update({
          video_url:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          productId
        );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete video failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Delete video failed",
      },
      {
        status: 500,
      }
    );
  }
}