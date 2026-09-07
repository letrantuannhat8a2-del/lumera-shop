import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const BUCKET = "product-image";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// ========================================
// CHECK ADMIN
// ========================================

async function checkAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

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

async function getProduct(productId: string) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("products")
    .select("id, slug")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// ========================================
// DELETE STORAGE FILE
// ========================================

async function deleteStorageFile(url: string | null) {
  if (!url) {
    return;
  }

  const marker =
    `/storage/v1/object/public/${BUCKET}/`;

  const markerIndex =
    url.indexOf(marker);

  if (markerIndex === -1) {
    return;
  }

  const filePath =
    url.substring(
      markerIndex + marker.length
    );

  if (!filePath) {
    return;
  }

  const {
    error,
  } = await supabaseAdmin
    .storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    console.error(
      "Unable to delete storage file:",
      error
    );
  }
}

// ========================================
// DELETE IMAGE
// ========================================

export async function DELETE(
  request: Request
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
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================
    // READ REQUEST
    // =====================================

    const body =
      await request.json();

    const productId =
      typeof body.productId === "string"
        ? body.productId.trim()
        : "";

    const imageId =
      typeof body.imageId === "string"
        ? body.imageId.trim()
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

    if (!imageId) {
      return NextResponse.json(
        {
          message:
            "Missing image ID.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================
    // CHECK PRODUCT
    // =====================================

    const product =
      await getProduct(productId);

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
    // GET IMAGE
    // =====================================

    const {
      data: image,
      error: imageError,
    } =
      await supabaseAdmin
        .from("product_images")
        .select(
          "id, product_id, image_url"
        )
        .eq("id", imageId)
        .eq(
          "product_id",
          productId
        )
        .maybeSingle();

    if (imageError) {
      throw imageError;
    }

    if (!image) {
      return NextResponse.json(
        {
          message:
            "Image not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================
    // DELETE STORAGE
    // =====================================

    await deleteStorageFile(
      image.image_url
    );

    // =====================================
    // DELETE DATABASE ROW
    // =====================================

    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("product_images")
        .delete()
        .eq("id", imageId)
        .eq(
          "product_id",
          productId
        );

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete image failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Delete image failed.",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// UPLOAD / REPLACE IMAGE
// ========================================

export async function POST(
  request: Request
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
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================
    // FORM DATA
    // =====================================

    const formData =
      await request.formData();

    const file =
      formData.get("image");

    const productId =
      String(
        formData.get("productId") ?? ""
      ).trim();

    const imageId =
      String(
        formData.get("imageId") ?? ""
      ).trim();

    // =====================================
    // VALIDATE
    // =====================================

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message:
            "No image uploaded.",
        },
        {
          status: 400,
        }
      );
    }

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

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Only JPG, PNG or WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          message:
            "Image must be smaller than 10 MB.",
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
      await getProduct(productId);

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
    // REPLACE EXISTING IMAGE
    // =====================================

    let oldImageUrl: string | null =
      null;

    let existingSortOrder:
      number | null = null;

    if (imageId) {
      const {
        data: existingImage,
        error: existingError,
      } =
        await supabaseAdmin
          .from("product_images")
          .select(
            "id, product_id, image_url, sort_order"
          )
          .eq("id", imageId)
          .eq(
            "product_id",
            productId
          )
          .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (!existingImage) {
        return NextResponse.json(
          {
            message:
              "Image not found.",
          },
          {
            status: 404,
          }
        );
      }

      oldImageUrl =
        existingImage.image_url;

      existingSortOrder =
        Number(
          existingImage.sort_order
        );
    }

    // =====================================
    // FIND NEXT SORT ORDER
    // =====================================

    let sortOrder =
      existingSortOrder;

    if (sortOrder === null) {
      const {
        data: lastImage,
        error: lastImageError,
      } =
        await supabaseAdmin
          .from("product_images")
          .select("sort_order")
          .eq(
            "product_id",
            productId
          )
          .order(
            "sort_order",
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle();

      if (lastImageError) {
        throw lastImageError;
      }

      sortOrder =
        lastImage
          ? Number(
              lastImage.sort_order
            ) + 1
          : 1;
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
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
        ? "png"
        : "webp";

    const safeBaseName =
      originalName
        .replace(
          /\.(jpg|jpeg|png|webp)$/i,
          ""
        ) ||
      `shoe-image-${sortOrder}`;

    // =====================================
    // FILE PATH
    // =====================================

    const filePath =
      `${product.slug}/gallery-${sortOrder}-${Date.now()}-${safeBaseName}.${extension}`;

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

    // =====================================
    // PUBLIC URL
    // =====================================

    const {
      data: publicUrlData,
    } =
      supabaseAdmin
        .storage
        .from(BUCKET)
        .getPublicUrl(
          filePath
        );

    const publicUrl =
      publicUrlData.publicUrl;

    // =====================================
    // REPLACE
    // =====================================

    if (imageId) {
      const {
        error: updateError,
      } =
        await supabaseAdmin
          .from("product_images")
          .update({
            image_url:
              publicUrl,
          })
          .eq(
            "id",
            imageId
          )
          .eq(
            "product_id",
            productId
          );

      if (updateError) {
        await supabaseAdmin
          .storage
          .from(BUCKET)
          .remove([
            filePath,
          ]);

        throw updateError;
      }

      await deleteStorageFile(
        oldImageUrl
      );
    }

    // =====================================
    // ADD NEW IMAGE
    // =====================================

    else {
      const {
        error: insertError,
      } =
        await supabaseAdmin
          .from("product_images")
          .insert({
            product_id:
              productId,

            image_url:
              publicUrl,

            sort_order:
              sortOrder,
          });

      if (insertError) {
        await supabaseAdmin
          .storage
          .from(BUCKET)
          .remove([
            filePath,
          ]);

        throw insertError;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error(
      "Upload image failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Upload image failed.",
      },
      {
        status: 500,
      }
    );
  }
}