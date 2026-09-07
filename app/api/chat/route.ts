import { NextResponse } from "next/server";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

// =====================================================
// CONFIG
// =====================================================

const MAX_FILE_SIZE =
  20 * 1024 * 1024; // 20MB


// =====================================================
// GET
// LẤY CONVERSATION + MESSAGES CỦA USER ĐANG ĐĂNG NHẬP
// =====================================================

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // GET USER CONVERSATION
    // =================================================

    const {
      data: conversation,
      error: conversationError,
    } =
      await supabaseAdmin
        .from("conversations")
        .select(
          `
            id,
            user_id,
            status,
            created_at,
            updated_at
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

    if (conversationError) {
      console.error(
        "Chat conversation GET error:",
        conversationError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load conversation.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // NO CONVERSATION
    // =================================================

    if (!conversation) {
      return NextResponse.json(
        {
          conversation: null,
          messages: [],
        },
        {
          status: 200,
        }
      );
    }

    // =================================================
    // GET MESSAGES
    // =================================================

    const {
      data: messages,
      error: messagesError,
    } =
      await supabaseAdmin
        .from("messages")
        .select(
          `
            id,
            conversation_id,
            sender_id,
            sender_role,
            content,
            message_type,
            file_url,
            file_name,
            created_at
          `
        )
        .eq(
          "conversation_id",
          conversation.id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (messagesError) {
      console.error(
        "Chat messages GET error:",
        messagesError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load messages.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        conversation,
        messages:
          messages ?? [],
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
      "Chat GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load chat.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// POST
// GỬI TEXT / IMAGE / VIDEO / AUDIO
// =====================================================

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // FORM DATA
    // =================================================

    const formData =
      await request.formData();

    const rawContent =
      formData.get(
        "content"
      );

    const content =
      typeof rawContent ===
      "string"
        ? rawContent.trim()
        : "";

    const fileValue =
      formData.get("file");

    const file =
      fileValue instanceof File
        ? fileValue
        : null;

    // =================================================
    // CHECK MESSAGE
    // =================================================

    if (
      !content &&
      !file
    ) {
      return NextResponse.json(
        {
          error:
            "Message or file is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // TEXT LIMIT
    // =================================================

    if (
      content.length >
      5000
    ) {
      return NextResponse.json(
        {
          error:
            "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // DETERMINE MESSAGE TYPE
    // =================================================

    let messageType:
      | "text"
      | "image"
      | "video"
      | "audio" =
      "text";

    if (file) {

      // -----------------------------------------------
      // CHECK FILE TYPE
      // -----------------------------------------------

      const isImage =
        file.type.startsWith(
          "image/"
        );

      const isVideo =
        file.type.startsWith(
          "video/"
        );

      const isAudio =
        file.type.startsWith(
          "audio/"
        );

      if (
        !isImage &&
        !isVideo &&
        !isAudio
      ) {
        return NextResponse.json(
          {
            error:
              "This file type is not supported.",
          },
          {
            status: 400,
          }
        );
      }

      // -----------------------------------------------
      // CHECK FILE SIZE
      // -----------------------------------------------

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        return NextResponse.json(
          {
            error:
              "File size must be 20MB or less.",
          },
          {
            status: 400,
          }
        );
      }

      // -----------------------------------------------
      // MESSAGE TYPE
      // -----------------------------------------------

      if (isImage) {
        messageType =
          "image";
      } else if (isVideo) {
        messageType =
          "video";
      } else if (isAudio) {
        messageType =
          "audio";
      }
    }

    // =================================================
    // FIND EXISTING CONVERSATION
    // =================================================

    let {
      data: conversation,
      error:
        conversationError,
    } =
      await supabaseAdmin
        .from("conversations")
        .select(
          `
            id,
            user_id,
            status,
            created_at,
            updated_at
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

    if (conversationError) {
      console.error(
        "Find conversation error:",
        conversationError
      );

      return NextResponse.json(
        {
          error:
            "Unable to find conversation.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // CREATE CONVERSATION
    // =================================================

    if (!conversation) {

      const {
        data:
          newConversation,
        error:
          createConversationError,
      } =
        await supabaseAdmin
          .from(
            "conversations"
          )
          .insert({
            user_id:
              user.id,
            status:
              "open",
          })
          .select(
            `
              id,
              user_id,
              status,
              created_at,
              updated_at
            `
          )
          .single();

      if (
        createConversationError
      ) {
        console.error(
          "Create conversation error:",
          createConversationError
        );

        return NextResponse.json(
          {
            error:
              "Unable to create conversation.",
          },
          {
            status: 500,
          }
        );
      }

      conversation =
        newConversation;
    }

    // =================================================
    // VERIFY OWNERSHIP
    // =================================================

    if (
      conversation.user_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot access this conversation.",
        },
        {
          status: 403,
        }
      );
    }

    // =================================================
    // UPLOAD FILE
    // =================================================

    let fileUrl:
      | string
      | null = null;

    let fileName:
      | string
      | null = null;

    if (file) {

      // -----------------------------------------------
      // SAFE FILE NAME
      // -----------------------------------------------

      const safeName =
        file.name
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          );

      const extension =
        safeName.includes(".")
          ? safeName
              .split(".")
              .pop()
          : "file";

      const uniqueName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `${user.id}/${conversation.id}/${uniqueName}`;

      // -----------------------------------------------
      // CONVERT FILE
      // -----------------------------------------------

      const arrayBuffer =
        await file.arrayBuffer();

      // -----------------------------------------------
      // UPLOAD TO SUPABASE
      // -----------------------------------------------

      const {
        error: uploadError,
      } =
        await supabaseAdmin
          .storage
          .from(
            "chat-files"
          )
          .upload(
            filePath,
            arrayBuffer,
            {
              contentType:
                file.type,
              upsert:
                false,
            }
          );

      if (uploadError) {
        console.error(
          "Chat file upload error:",
          uploadError
        );

        return NextResponse.json(
          {
            error:
              "Unable to upload file.",
          },
          {
            status: 500,
          }
        );
      }

      // -----------------------------------------------
      // CREATE SIGNED URL
      // -----------------------------------------------

      const {
        data:
          signedUrlData,
        error:
          signedUrlError,
      } =
        await supabaseAdmin
          .storage
          .from(
            "chat-files"
          )
          .createSignedUrl(
            filePath,
            60 * 60 * 24 * 7
          );

      if (
        signedUrlError
      ) {
        console.error(
          "Create signed URL error:",
          signedUrlError
        );

        return NextResponse.json(
          {
            error:
              "Unable to create file URL.",
          },
          {
            status: 500,
          }
        );
      }

      fileUrl =
        signedUrlData.signedUrl;

      fileName =
        file.name;
    }

    // =================================================
    // INSERT MESSAGE
    // =================================================

    const {
      data: newMessage,
      error: messageError,
    } =
      await supabaseAdmin
        .from("messages")
        .insert({
          conversation_id:
            conversation.id,

          sender_id:
            user.id,

          sender_role:
            "customer",

          content,

          message_type:
            messageType,

          file_url:
            fileUrl,

          file_name:
            fileName,
        })
        .select(
          `
            id,
            conversation_id,
            sender_id,
            sender_role,
            content,
            message_type,
            file_url,
            file_name,
            created_at
          `
        )
        .single();

    if (messageError) {
      console.error(
        "Create message error:",
        messageError
      );

      return NextResponse.json(
        {
          error:
            "Unable to send message.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // UPDATE CONVERSATION
    // =================================================

    await supabaseAdmin
      .from(
        "conversations"
      )
      .update({
        updated_at:
          new Date().toISOString(),

        status:
          "open",
      })
      .eq(
        "id",
        conversation.id
      )
      .eq(
        "user_id",
        user.id
      );

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        conversation,
        message:
          newMessage,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "Chat POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to send message.",
      },
      {
        status: 500,
      }
    );
  }
}