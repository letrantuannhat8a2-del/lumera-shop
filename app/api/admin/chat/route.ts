import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const adminEmail =
  process.env.ADMIN_EMAIL;

const MAX_FILE_SIZE =
  20 * 1024 * 1024; // 20MB


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

  if (
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ) {
    return null;
  }

  return user;
}


// =====================================================
// GET
// ADMIN:
// - LẤY TẤT CẢ CONVERSATIONS
// - HOẶC LẤY MESSAGES CỦA 1 CONVERSATION
// =====================================================

export async function GET(
  request: Request
) {
  try {
    const admin =
      await checkAdmin();

    if (!admin) {
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

    const { searchParams } =
      new URL(request.url);

    const conversationId =
      searchParams.get(
        "conversation_id"
      );

    // =================================================
    // GET ONE CONVERSATION
    // =================================================

    if (conversationId) {
      const {
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
            "id",
            conversationId
          )
          .maybeSingle();

      if (conversationError) {
        console.error(
          "Admin conversation error:",
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

      if (!conversation) {
        return NextResponse.json(
          {
            error:
              "Conversation not found.",
          },
          {
            status: 404,
          }
        );
      }

      // ===============================================
      // GET MESSAGES
      // ===============================================

      const {
        data: messages,
        error:
          messagesError,
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
            conversationId
          )
          .order(
            "created_at",
            {
              ascending: true,
            }
          );

      if (messagesError) {
        console.error(
          "Admin messages error:",
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

      // ===============================================
      // GET CUSTOMER
      // ===============================================

      const {
        data: authData,
        error: authError,
      } =
        await supabaseAdmin.auth.admin
          .getUserById(
            conversation.user_id
          );

      if (authError) {
        console.error(
          "Get customer auth user error:",
          authError
        );
      }

      const customer =
        authData?.user
          ? {
              id:
                authData.user.id,

              email:
                authData.user.email ??
                null,

              first_name:
                authData.user
                  .user_metadata
                  ?.first_name ??
                null,

              last_name:
                authData.user
                  .user_metadata
                  ?.last_name ??
                null,
            }
          : {
              id:
                conversation.user_id,

              email: null,

              first_name:
                null,

              last_name:
                null,
            };

      return NextResponse.json(
        {
          conversation,
          customer,
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
    }

    // =================================================
    // GET ALL CONVERSATIONS
    // =================================================

    const {
      data: conversations,
      error,
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
        .order(
          "updated_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(
        "Admin conversations error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load conversations.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // GET AUTH USERS
    // =================================================

    const {
      data: usersData,
      error: usersError,
    } =
      await supabaseAdmin.auth.admin
        .listUsers({
          page: 1,
          perPage: 1000,
        });

    if (usersError) {
      console.error(
        "Admin users error:",
        usersError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load customer accounts.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // USER MAP
    // =================================================

    const userMap =
      new Map<
        string,
        {
          id: string;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
        }
      >();

    for (
      const user of
        usersData.users
    ) {
      userMap.set(
        user.id,
        {
          id:
            user.id,

          email:
            user.email ??
            null,

          first_name:
            user.user_metadata
              ?.first_name ??
            null,

          last_name:
            user.user_metadata
              ?.last_name ??
            null,
        }
      );
    }

    // =================================================
    // BUILD RESULT
    // =================================================

    const result =
      (
        conversations ?? []
      ).map(
        (conversation) => {
          const customer =
            userMap.get(
              conversation.user_id
            );

          return {
            ...conversation,

            customer:
              customer ?? {
                id:
                  conversation.user_id,

                email: null,

                first_name:
                  null,

                last_name:
                  null,
              },
          };
        }
      );

    return NextResponse.json(
      result,
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
      "Admin chat GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load admin chat.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// POST
// ADMIN REPLY
// TEXT / IMAGE / VIDEO / AUDIO
// =====================================================

export async function POST(
  request: Request
) {
  try {
    const admin =
      await checkAdmin();

    if (!admin) {
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
    // READ FORM DATA
    // =================================================

    const formData =
      await request.formData();

    const rawConversationId =
      formData.get(
        "conversation_id"
      );

    const rawContent =
      formData.get("content");

    const conversationId =
      typeof rawConversationId ===
      "string"
        ? rawConversationId.trim()
        : "";

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
    // VALIDATION
    // =================================================

    if (!conversationId) {
      return NextResponse.json(
        {
          error:
            "Conversation ID is required.",
        },
        {
          status: 400,
        }
      );
    }

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
    // MESSAGE TYPE
    // =================================================

    let messageType:
      | "text"
      | "image"
      | "video"
      | "audio" =
      "text";

    if (file) {
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
    // VERIFY CONVERSATION
    // =================================================

    const {
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
            status
          `
        )
        .eq(
          "id",
          conversationId
        )
        .maybeSingle();

    if (conversationError) {
      console.error(
        "Verify conversation error:",
        conversationError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify conversation.",
        },
        {
          status: 500,
        }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        {
          error:
            "Conversation not found.",
        },
        {
          status: 404,
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
        `admin/${conversation.id}/${uniqueName}`;

      const arrayBuffer =
        await file.arrayBuffer();

      // -----------------------------------------------
      // UPLOAD
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
          "Admin chat file upload error:",
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
      // SIGNED URL
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
          "Admin signed URL error:",
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
    // INSERT ADMIN MESSAGE
    // =================================================

    const {
      data: newMessage,
      error:
        messageError,
    } =
      await supabaseAdmin
        .from("messages")
        .insert({
          conversation_id:
            conversation.id,

          sender_id:
            admin.id,

          sender_role:
            "admin",

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
        "Admin message error:",
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

    const {
      error:
        updateError,
    } =
      await supabaseAdmin
        .from("conversations")
        .update({
          updated_at:
            new Date().toISOString(),

          status:
            "open",
        })
        .eq(
          "id",
          conversation.id
        );

    if (updateError) {
      console.error(
        "Update conversation error:",
        updateError
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          newMessage,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "Admin chat POST error:",
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