import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/app/lib/supabaseAdmin";


// ========================================
// DELETE VIDEO
// ========================================

export async function DELETE(
  request: Request
) {
  try {
    const {
      productId,
    } = await request.json();

    if (!productId) {
      return NextResponse.json(
        {
          message:
            "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }


    // GET OLD VIDEO

    const {
      data: product,
      error: fetchError,
    } = await supabaseAdmin
      .from("products")
      .select("video_url")
      .eq(
        "id",
        productId
      )
      .single();


    if (fetchError) {
      throw fetchError;
    }


    const oldUrl =
      product?.video_url;


    // DELETE FROM STORAGE

    if (oldUrl) {
      const marker =
        "/product-video/";

      const markerIndex =
        oldUrl.indexOf(marker);

      if (markerIndex !== -1) {
        const filePath =
          oldUrl.substring(
            markerIndex +
              marker.length
          );

        if (filePath) {
          await supabaseAdmin
            .storage
            .from(
              "product-video"
            )
            .remove([
              filePath,
            ]);
        }
      }
    }


    // CLEAR DATABASE

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("products")
      .update({
        video_url: null,
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
      "Delete video error:",
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


// ========================================
// UPLOAD VIDEO
// ========================================

export async function POST(
  request: Request
) {
  try {

    const formData =
      await request.formData();


    const file =
      formData.get(
        "video"
      ) as File;


    const productId =
      String(
        formData.get(
          "productId"
        )
      );


    const slug =
      String(
        formData.get(
          "slug"
        )
      );


    if (!file) {
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


    if (
      !file.type.startsWith(
        "video/"
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid video file.",
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
    } = await supabaseAdmin
      .from("products")
      .select("video_url")
      .eq(
        "id",
        productId
      )
      .single();


    const oldUrl =
      product?.video_url;


    // ========================================
    // DELETE OLD VIDEO
    // ========================================

    if (oldUrl) {
      const marker =
        "/product-video/";

      const markerIndex =
        oldUrl.indexOf(marker);

      if (markerIndex !== -1) {

        const oldFilePath =
          oldUrl.substring(
            markerIndex +
              marker.length
          );

        if (oldFilePath) {
          await supabaseAdmin
            .storage
            .from(
              "product-video"
            )
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


    const filePath =
      `${slug}/${Date.now()}-${safeName}`;


    // ========================================
    // FILE BUFFER
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
    } = await supabaseAdmin
      .storage
      .from(
        "product-video"
      )
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
    // PUBLIC URL
    // ========================================

    const {
      data: urlData,
    } = supabaseAdmin
      .storage
      .from(
        "product-video"
      )
      .getPublicUrl(
        filePath
      );


    const videoUrl =
      urlData.publicUrl;


    // ========================================
    // SAVE DATABASE
    // ========================================

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("products")
      .update({
        video_url:
          videoUrl,
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

      url:
        videoUrl,
    });

  } catch (error) {

    console.error(
      "Upload video error:",
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