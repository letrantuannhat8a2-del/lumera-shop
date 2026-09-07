import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const BUCKET = "homepage";

export async function POST(request: Request) {
  try {
    // =====================================================
    // 1. CHECK ADMIN
    // =====================================================

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
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // 2. READ FILE
    // =====================================================

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file provided.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 3. VALIDATE FILE TYPE
    // =====================================================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, WEBP, and AVIF images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 4. VALIDATE FILE SIZE
    // =====================================================

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 10MB.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 5. CREATE UNIQUE FILE NAME
    // =====================================================

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      "jpg";

    const fileName =
      `hero-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `hero/${fileName}`;

    // =====================================================
    // 6. CONVERT FILE
    // =====================================================

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // =====================================================
    // 7. UPLOAD TO SUPABASE STORAGE
    // =====================================================

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: "31536000",
        });

    if (uploadError) {
      console.error(
        "Homepage image upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Unable to upload image.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 8. GET PUBLIC URL
    // =====================================================

    const {
      data: publicUrlData,
    } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const publicUrl =
      publicUrlData.publicUrl;

    // =====================================================
    // 9. RETURN RESULT
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        path: filePath,
        url: publicUrl,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Homepage upload API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the image.",
      },
      {
        status: 500,
      }
    );
  }
}