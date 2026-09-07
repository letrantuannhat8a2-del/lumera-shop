import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const BUCKET =
  "product-video";

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

// ========================================
// CHECK ADMIN
// ========================================

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
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ) {
    return false;
  }

  return true;
}

// ========================================
// GET PRODUCT
// ========================================

async function getProduct(
  productId: string
) {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        slug,
        video_url
        `
      )
      .eq(
        "id",
        productId
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// ========================================
// EXTRACT STORAGE PATH
// ========================================

function getStoragePath(
  publicUrl: string
) {
  const marker =
    `/storage/v1/object/public/${BUCKET}/`;

  const index =
    publicUrl.indexOf(
      marker
    );

  if (index === -1) {
    return null;
  }

  return publicUrl.substring(
    index + marker.length
  );
}

// ========================================
// UPLOAD VIDEO
// ========================================

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // =====================================
    // CHECK ADMIN
    // =====================================

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

    // =====================================
    // GET PRODUCT ID FROM URL
    // =====================================

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

    // =====================================
    // GET PRODUCT
    // =====================================

    const product =
      await getProduct(
        productId
      );

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

    // =====================================
    // FORM DATA
    // =====================================

    const formData =
      await request.formData();

    const file =
      formData.get(
        "video"
      );

    if (
      !(
        file instanceof File
      )
    ) {
      return NextResponse.json(
        {
          message:
            "No video uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================
    // CHECK TYPE
    // =====================================

    if (
      !ALLOWED_TYPES.includes(
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

    // =====================================
    // CHECK SIZE
    // =====================================

    if (
      file.size >
      MAX_FILE_SIZE
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

    // =====================================
    // DELETE OLD VIDEO
    // =====================================

    if (
      product.video_url
    ) {
      const oldPath =
        getStoragePath(
          product.video_url
        );

      if (oldPath) {
        const {
          error:
            removeError,
        } =
          await supabaseAdmin
            .storage
            .from(BUCKET)
            .remove([
              oldPath,
            ]);

        if (
          removeError
        ) {
          console.error(
            "Unable to remove old video:",
            removeError
          );
        }
      }
    }

    // =====================================
    // SAFE FILE NAME
    // =====================================

    const originalName =
      file.name
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        )
        .replace(
          /[^a-z0-9._-]/g,
          ""
        );

    const extension =
      file.type ===
      "video/mp4"
        ? "mp4"
        : file.type ===
          "video/webm"
        ? "webm"
        : "mov";

    const baseName =
      originalName.replace(
        /\.(mp4|webm|mov)$/i,
        ""
      ) ||
      "shoe-video";

    // =====================================
    // FILE PATH
    // =====================================

    const filePath =
      `${product.slug}/video-${Date.now()}-${baseName}.${extension}`;

    // =====================================
    // BUFFER
    // =====================================

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    // =====================================
    // UPLOAD
    // =====================================

    const {
      error:
        uploadError,
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

    if (
      uploadError
    ) {
      throw uploadError;
    }

    // =====================================
    // PUBLIC URL
    // =====================================

    const {
      data:
        publicUrlData,
    } =
      supabaseAdmin
        .storage
        .from(BUCKET)
        .getPublicUrl(
          filePath
        );

    const videoUrl =
      publicUrlData.publicUrl;

    // =====================================
    // UPDATE PRODUCT
    // =====================================

    const {
      error:
        updateError,
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

    // =====================================
    // CLEANUP IF DB FAILS
    // =====================================

    if (
      updateError
    ) {
      await supabaseAdmin
        .storage
        .from(BUCKET)
        .remove([
          filePath,
        ]);

      throw updateError;
    }

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
          "Upload video failed.",
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
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // =====================================
    // CHECK ADMIN
    // =====================================

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

    // =====================================
    // GET PRODUCT ID FROM URL
    // =====================================

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

    // =====================================
    // GET PRODUCT
    // =====================================

    const product =
      await getProduct(
        productId
      );

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

    // =====================================
    // DELETE STORAGE FILE
    // =====================================

    if (
      product.video_url
    ) {
      const filePath =
        getStoragePath(
          product.video_url
        );

      if (filePath) {
        const {
          error:
            removeError,
        } =
          await supabaseAdmin
            .storage
            .from(BUCKET)
            .remove([
              filePath,
            ]);

        if (
          removeError
        ) {
          console.error(
            "Unable to remove video:",
            removeError
          );
        }
      }
    }

    // =====================================
    // CLEAR DATABASE
    // =====================================

    const {
      error:
        updateError,
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

    if (
      updateError
    ) {
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
          "Delete video failed.",
      },
      {
        status: 500,
      }
    );
  }
}