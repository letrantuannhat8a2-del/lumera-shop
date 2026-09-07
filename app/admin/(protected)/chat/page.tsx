"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

type Conversation = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  content: string;
  message_type: "text" | "image" | "video" | "audio";
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

type ConversationDetail = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function AdminChatPage() {
  const router = useRouter();

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDetail | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [reply, setReply] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [recording, setRecording] =
    useState(false);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const recordingTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  async function loadConversations() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/chat",
          {
            cache: "no-store",
          }
        );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load conversations."
        );
      }

      const data =
        await response.json();

      setConversations(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Load admin conversations error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadConversations();
  }, []);

  // =====================================================
  // LOAD ONE CONVERSATION
  // =====================================================

  async function openConversation(
    conversation: Conversation
  ) {
    try {
      setLoadingMessages(true);

      setSelectedCustomer(
        conversation.customer
      );

      const response =
        await fetch(
          `/api/admin/chat?conversation_id=${encodeURIComponent(
            conversation.id
          )}`,
          {
            cache: "no-store",
          }
        );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load conversation."
        );
      }

      const data =
        await response.json();

      setSelectedConversation(
        data.conversation ?? null
      );

      setSelectedCustomer(
        data.customer ??
          conversation.customer
      );

      setMessages(
        Array.isArray(data.messages)
          ? data.messages
          : []
      );
    } catch (error) {
      console.error(
        "Open admin conversation error:",
        error
      );
    } finally {
      setLoadingMessages(false);
    }
  }

  // =====================================================
  // AUTO REFRESH CURRENT CONVERSATION
  // =====================================================

  useEffect(() => {
    if (
      !selectedConversation
    ) {
      return;
    }

    const interval =
      setInterval(async () => {
        try {
          const response =
            await fetch(
              `/api/admin/chat?conversation_id=${encodeURIComponent(
                selectedConversation.id
              )}`,
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            return;
          }

          const data =
            await response.json();

          if (
            Array.isArray(
              data.messages
            )
          ) {
            setMessages(
              data.messages
            );
          }

          if (data.customer) {
            setSelectedCustomer(
              data.customer
            );
          }

          if (
            data.conversation
          ) {
            setSelectedConversation(
              data.conversation
            );
          }
        } catch (error) {
          console.error(
            "Refresh admin chat error:",
            error
          );
        }
      }, 5000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    selectedConversation?.id,
  ]);

  // =====================================================
  // FILE PREVIEW CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);

  // =====================================================
  // SELECT IMAGE / VIDEO
  // =====================================================

  function handleFileSelect(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const isImage =
      file.type.startsWith(
        "image/"
      );

    const isVideo =
      file.type.startsWith(
        "video/"
      );

    if (!isImage && !isVideo) {
      alert(
        "Please choose an image or video."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      alert(
        "File size must be 20MB or less."
      );

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );
  }

  // =====================================================
  // REMOVE FILE
  // =====================================================

  function removeSelectedFile() {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  }

  // =====================================================
  // START VOICE RECORDING
  // =====================================================

  async function startRecording() {
    if (recording) {
      return;
    }

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Voice recording is not supported by this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      let mimeType =
        "audio/webm";

      if (
        !MediaRecorder.isTypeSupported(
          "audio/webm"
        )
      ) {
        mimeType =
          "audio/mp4";
      }

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType,
          }
        );

      audioChunksRef.current =
        [];

      recorder.ondataavailable =
        (event) => {
          if (
            event.data.size > 0
          ) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

      recorder.start();

      mediaRecorderRef.current =
        recorder;

      setRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingSeconds(
            (current) =>
              current + 1
          );
        }, 1000);
    } catch (error) {
      console.error(
        "Admin voice recording error:",
        error
      );

      alert(
        "Unable to access your microphone."
      );
    }
  }

  // =====================================================
  // STOP VOICE RECORDING
  // =====================================================

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    recorder.onstop = () => {
      const blob =
        new Blob(
          audioChunksRef.current,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          }
        );

      const extension =
        recorder.mimeType.includes(
          "mp4"
        )
          ? "mp4"
          : "webm";

      const voiceFile =
        new File(
          [blob],
          `admin-voice-${Date.now()}.${extension}`,
          {
            type:
              blob.type ||
              "audio/webm",
          }
        );

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setSelectedFile(
        voiceFile
      );

      setPreviewUrl(
        URL.createObjectURL(
          voiceFile
        )
      );

      recorder.stream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    };

    recorder.stop();

    mediaRecorderRef.current =
      null;

    setRecording(false);

    if (
      recordingTimerRef.current
    ) {
      clearInterval(
        recordingTimerRef.current
      );

      recordingTimerRef.current =
        null;
    }
  }

  // =====================================================
  // RECORDING TIME
  // =====================================================

  function formatRecordingTime() {
    const minutes =
      Math.floor(
        recordingSeconds / 60
      );

    const seconds =
      recordingSeconds % 60;

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  // =====================================================
  // SEND REPLY
  // =====================================================

  async function sendReply() {
    const content =
      reply.trim();

    if (
      !selectedConversation ||
      sending ||
      recording
    ) {
      return;
    }

    if (
      !content &&
      !selectedFile
    ) {
      return;
    }

    try {
      setSending(true);

      const formData =
        new FormData();

      formData.append(
        "conversation_id",
        selectedConversation.id
      );

      if (content) {
        formData.append(
          "content",
          content
        );
      }

      if (selectedFile) {
        formData.append(
          "file",
          selectedFile
        );
      }

      const response =
        await fetch(
          "/api/admin/chat",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to send reply."
        );
      }

      if (data.message) {
        setMessages(
          (current) => [
            ...current,
            data.message,
          ]
        );
      }

      setReply("");

      removeSelectedFile();

      await loadConversations();
    } catch (error) {
      console.error(
        "Admin reply error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to send reply."
      );
    } finally {
      setSending(false);
    }
  }

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  function getCustomerName(
    customer: Customer
  ) {
    const name =
      `${customer.first_name ?? ""} ${
        customer.last_name ?? ""
      }`.trim();

    return (
      name ||
      customer.email ||
      "Customer"
    );
  }

  // =====================================================
  // DATE
  // =====================================================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // TIME
  // =====================================================

  function formatTime(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  // =====================================================
  // GROUP MESSAGES BY DATE
  // =====================================================

  const groupedMessages =
    useMemo(() => {
      const groups: {
        date: string;
        messages: Message[];
      }[] = [];

      for (
        const item of messages
      ) {
        const dateKey =
          new Date(
            item.created_at
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }
          );

        const existing =
          groups.find(
            (group) =>
              group.date ===
              dateKey
          );

        if (existing) {
          existing.messages.push(
            item
          );
        } else {
          groups.push({
            date: dateKey,
            messages: [
              item,
            ],
          });
        }
      }

      return groups;
    }, [messages]);

  // =====================================================
  // RENDER MEDIA
  // =====================================================

  function renderMessageMedia(
    item: Message
  ) {
    if (
      !item.file_url
    ) {
      return null;
    }

    if (
      item.message_type ===
      "image"
    ) {
      return (
        <img
          src={item.file_url}
          alt={
            item.file_name ??
            "Customer image"
          }
          className="
            max-h-[360px]
            max-w-full
            object-contain
          "
        />
      );
    }

    if (
      item.message_type ===
      "video"
    ) {
      return (
        <video
          src={item.file_url}
          controls
          playsInline
          className="
            max-h-[360px]
            max-w-full
            bg-black
          "
        />
      );
    }

    if (
      item.message_type ===
      "audio"
    ) {
      return (
        <div
          className="
            flex
            items-center
            gap-3
            bg-white
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#201b1b]
              text-white
            "
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </div>

          <audio
            src={item.file_url}
            controls
            className="max-w-[260px]"
          />
        </div>
      );
    }

    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#201b1b]">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white px-6 py-6 lg:px-10">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="font-serif text-2xl tracking-[0.25em]">
              VIREL
            </h1>

            <p className="mt-2 text-[9px] font-medium tracking-[0.3em] text-black/45">
              ADMINISTRATION
            </p>

          </div>

          <nav className="flex gap-6 text-[9px] font-medium tracking-[0.18em] sm:gap-8">

            <a
              href="/admin/products"
              className="text-black/45 transition hover:text-black"
            >
              PRODUCTS
            </a>

            <a
              href="/admin/orders"
              className="text-black/45 transition hover:text-black"
            >
              ORDERS
            </a>

            <a
              href="/admin/chat"
              className="border-b border-black pb-1"
            >
              CHAT
            </a>

          </nav>

        </div>

      </header>


      {/* TITLE */}

      <section className="px-6 py-10 lg:px-10">

        <p className="text-[9px] font-medium tracking-[0.3em] text-black/45">
          CUSTOMER SERVICE
        </p>

        <div className="mt-3 flex items-end justify-between">

          <h2 className="font-serif text-4xl sm:text-5xl">
            Messages
          </h2>

          <p className="text-[9px] font-medium tracking-[0.15em] text-black/45">
            {conversations.length}{" "}
            {conversations.length ===
            1
              ? "CONVERSATION"
              : "CONVERSATIONS"}
          </p>

        </div>

      </section>


      {/* CHAT APP */}

      <section className="px-4 pb-10 sm:px-6 lg:px-10">

        <div className="mx-auto flex h-[700px] max-w-[1600px] overflow-hidden border border-black/10 bg-white">


          {/* =================================================
              CUSTOMER LIST
          ================================================= */}

          <aside className="w-[320px] shrink-0 border-r border-black/10 bg-[#fbfaf8]">

            <div className="border-b border-black/10 px-5 py-5">

              <p className="text-[8px] font-semibold tracking-[0.25em] text-black/45">
                INBOX
              </p>

              <p className="mt-1 text-sm font-medium">
                Customer conversations
              </p>

            </div>

            <div className="h-[calc(100%-77px)] overflow-y-auto">

              {loading ? (

                <div className="px-5 py-10 text-center">

                  <p className="text-[8px] font-medium tracking-[0.2em] text-black/45">
                    LOADING...
                  </p>

                </div>

              ) : conversations.length ===
                0 ? (

                <div className="px-5 py-16 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black/10">

                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    >
                      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2 .9-4.1A7.5 7.5 0 1 1 20 11.5Z" />
                    </svg>

                  </div>

                  <p className="mt-4 font-serif text-xl">
                    No messages
                  </p>

                  <p className="mt-2 text-[9px] leading-5 text-black/45">
                    Customer conversations
                    will appear here.
                  </p>

                </div>

              ) : (

                conversations.map(
                  (
                    conversation
                  ) => {

                    const active =
                      selectedConversation?.id ===
                      conversation.id;

                    return (
                      <button
                        key={
                          conversation.id
                        }
                        type="button"
                        onClick={() =>
                          openConversation(
                            conversation
                          )
                        }
                        className={`
                          w-full
                          border-b
                          border-black/10
                          px-5
                          py-5
                          text-left
                          transition
                          ${
                            active
                              ? "bg-white"
                              : "hover:bg-white"
                          }
                        `}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="truncate text-[11px] font-semibold">
                              {getCustomerName(
                                conversation.customer
                              )}
                            </p>

                            <p className="mt-1 truncate text-[9px] text-black/50">
                              {conversation.customer.email ??
                                "No email"}
                            </p>

                          </div>

                          <span
                            className={`
                              mt-1
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              ${
                                conversation.status ===
                                "open"
                                  ? "bg-green-500"
                                  : "bg-black/15"
                              }
                            `}
                          />

                        </div>

                        <p className="mt-3 text-[8px] font-medium text-black/45">
                          {formatDate(
                            conversation.updated_at
                          )}
                        </p>

                      </button>
                    );
                  }
                )

              )}

            </div>

          </aside>


          {/* =================================================
              CHAT AREA
          ================================================= */}

          <section className="flex min-w-0 flex-1 flex-col">

            {!selectedConversation ? (

              <div className="flex h-full flex-col items-center justify-center px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10">

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2 .9-4.1A7.5 7.5 0 1 1 20 11.5Z" />
                  </svg>

                </div>

                <h3 className="mt-6 font-serif text-3xl">
                  Customer Support
                </h3>

                <p className="mt-3 max-w-md text-[10px] font-medium leading-6 text-black/50">
                  Select a conversation
                  from the inbox to view
                  and reply to the
                  customer.
                </p>

              </div>

            ) : (

              <>

                {/* CUSTOMER HEADER */}

                <header className="flex shrink-0 items-center justify-between border-b border-black/10 bg-white px-6 py-5">

                  <div>

                    <p className="text-[8px] font-semibold tracking-[0.25em] text-black/45">
                      CUSTOMER
                    </p>

                    <h3 className="mt-1 text-sm font-semibold">
                      {selectedCustomer
                        ? getCustomerName(
                            selectedCustomer
                          )
                        : "Customer"}
                    </h3>

                    <p className="mt-1 text-[9px] text-black/50">
                      {selectedCustomer?.email ??
                        ""}
                    </p>

                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-2 text-[7px] font-semibold tracking-[0.15em] text-green-700">
                    {selectedConversation.status.toUpperCase()}
                  </span>

                </header>


                {/* MESSAGES */}

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#fcfaf7] px-6 py-7">

                  {loadingMessages ? (

                    <div className="flex h-full items-center justify-center">

                      <p className="text-[8px] font-semibold tracking-[0.2em] text-black/45">
                        LOADING...
                      </p>

                    </div>

                  ) : messages.length ===
                    0 ? (

                    <div className="flex h-full items-center justify-center">

                      <p className="text-[9px] font-medium tracking-[0.12em] text-black/45">
                        NO MESSAGES
                      </p>

                    </div>

                  ) : (

                    groupedMessages.map(
                      (group) => (

                        <div
                          key={
                            group.date
                          }
                          className="mb-8"
                        >

                          {/* DATE SEPARATOR */}

                          <div className="mb-7 flex items-center gap-4">

                            <div className="h-px flex-1 bg-black/10" />

                            <span className="shrink-0 text-[8px] font-semibold tracking-[0.25em] text-black/50">
                              {formatDate(
                                group.messages[0]
                                  .created_at
                              ).toUpperCase()}
                            </span>

                            <div className="h-px flex-1 bg-black/10" />

                          </div>


                          {/* GROUP MESSAGES */}

                          {group.messages.map(
                            (item) => {

                              const isAdmin =
                                item.sender_role ===
                                "admin";

                              return (
                                <div
                                  key={
                                    item.id
                                  }
                                  className={`
                                    mb-6
                                    flex
                                    ${
                                      isAdmin
                                        ? "justify-end"
                                        : "justify-start"
                                    }
                                  `}
                                >

                                  <div
                                    className={`
                                      max-w-[75%]
                                      ${
                                        isAdmin
                                          ? "items-end"
                                          : "items-start"
                                      }
                                    `}
                                  >

                                    {/* MEDIA */}

                                    {item.message_type !==
                                      "text" &&
                                      item.file_url && (
                                        <div
                                          className={`
                                            overflow-hidden
                                            ${
                                              isAdmin
                                                ? "bg-[#201b1b]"
                                                : "border border-black/10 bg-white"
                                            }
                                          `}
                                        >
                                          {renderMessageMedia(
                                            item
                                          )}
                                        </div>
                                      )}


                                    {/* TEXT */}

                                    {item.content && (
                                      <div
                                        className={`
                                          mt-2
                                          px-5
                                          py-4
                                          ${
                                            isAdmin
                                              ? "bg-[#201b1b] text-white"
                                              : "border border-black/10 bg-white text-[#201b1b]"
                                          }
                                        `}
                                      >

                                        <p className="whitespace-pre-wrap text-[13px] leading-[1.6]">
                                          {
                                            item.content
                                          }
                                        </p>

                                      </div>
                                    )}


                                    {/* TIME */}

                                    <p
                                      className={`
                                        mt-2
                                        text-[8px]
                                        font-medium
                                        tracking-[0.08em]
                                        ${
                                          isAdmin
                                            ? "text-black/45"
                                            : "text-black/50"
                                        }
                                      `}
                                    >
                                      {isAdmin
                                        ? "VIREL"
                                        : "CUSTOMER"}
                                      {" · "}
                                      {formatTime(
                                        item.created_at
                                      )}
                                    </p>

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>
                      )
                    )

                  )}

                </div>


                {/* =================================================
                    FILE PREVIEW
                ================================================= */}

                {selectedFile && (
                  <div className="shrink-0 border-t border-black/10 bg-[#f5f2ed] px-5 py-4">

                    <div className="flex items-center gap-4">

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-black/5">

                        {selectedFile.type.startsWith(
                          "image/"
                        ) ? (

                          <img
                            src={
                              previewUrl ??
                              ""
                            }
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />

                        ) : selectedFile.type.startsWith(
                            "video/"
                          ) ? (

                          <video
                            src={
                              previewUrl ??
                              ""
                            }
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full w-full items-center justify-center bg-[#201b1b] text-white">

                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                            >
                              <rect
                                x="9"
                                y="3"
                                width="6"
                                height="11"
                                rx="3"
                              />
                              <path d="M5 11a7 7 0 0 0 14 0" />
                              <path d="M12 18v3" />
                              <path d="M8 21h8" />
                            </svg>

                          </div>

                        )}

                        <button
                          type="button"
                          onClick={
                            removeSelectedFile
                          }
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"
                        >
                          ×
                        </button>

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-[10px] font-semibold">
                          {
                            selectedFile.name
                          }
                        </p>

                        <p className="mt-1 text-[8px] text-black/45">
                          {(
                            selectedFile.size /
                            1024 /
                            1024
                          ).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>

                      </div>

                    </div>

                  </div>
                )}


                {/* =================================================
                    RECORDING BAR
                ================================================= */}

                {recording && (
                  <div className="shrink-0 border-t border-black/10 bg-[#f5f2ed] px-5 py-3">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                        <span className="text-[10px] font-semibold">
                          Recording voice
                        </span>

                        <span className="text-[9px] text-black/45">
                          {formatRecordingTime()}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={
                          stopRecording
                        }
                        className="border border-black/15 px-4 py-2 text-[8px] font-semibold tracking-[0.15em] transition hover:bg-black hover:text-white"
                      >
                        STOP
                      </button>

                    </div>

                  </div>
                )}


                {/* =================================================
                    INPUT
                ================================================= */}

                <div className="shrink-0 border-t border-black/10 bg-white p-4">

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/*,video/*"
                    onChange={
                      handleFileSelect
                    }
                    className="hidden"
                  />

                  <div className="flex items-end gap-2 border border-black/15 bg-[#fcfaf7] px-3 py-3 focus-within:border-black/40">

                    {/* ATTACH */}

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        sending ||
                        recording
                      }
                      aria-label="Attach image or video"
                      className="flex h-10 w-10 shrink-0 items-center justify-center text-black/60 transition hover:text-black disabled:opacity-30"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.4 11.6 12 21a6 6 0 0 1-8.5-8.5l9.5-9.5a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 0 1-2.8-2.8l8.8-8.8" />
                      </svg>
                    </button>


                    {/* TEXT */}

                    <textarea
                      value={
                        reply
                      }
                      onChange={(
                        event
                      ) =>
                        setReply(
                          event.target.value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                            "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();

                          sendReply();
                        }
                      }}
                      placeholder={
                        recording
                          ? "Recording voice..."
                          : "Write a reply..."
                      }
                      rows={1}
                      maxLength={
                        5000
                      }
                      disabled={
                        recording
                      }
                      className="min-h-[28px] max-h-[120px] flex-1 resize-none bg-transparent py-2 text-[13px] leading-5 outline-none placeholder:text-black/45 disabled:opacity-50"
                    />


                    {/* MICROPHONE */}

                    <button
                      type="button"
                      onClick={
                        recording
                          ? stopRecording
                          : startRecording
                      }
                      disabled={
                        sending
                      }
                      aria-label={
                        recording
                          ? "Stop recording"
                          : "Record voice"
                      }
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        transition
                        ${
                          recording
                            ? "bg-[#201b1b] text-white"
                            : "text-black/60 hover:text-black"
                        }
                      `}
                    >

                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="3"
                          width="6"
                          height="11"
                          rx="3"
                        />
                        <path d="M5 11a7 7 0 0 0 14 0" />
                        <path d="M12 18v3" />
                        <path d="M8 21h8" />
                      </svg>

                    </button>


                    {/* SEND */}

                    <button
                      type="button"
                      onClick={
                        sendReply
                      }
                      disabled={
                        sending ||
                        recording ||
                        (!reply.trim() &&
                          !selectedFile)
                      }
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#201b1b] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
                    >

                      {sending ? (

                        <span className="text-[8px]">
                          ...
                        </span>

                      ) : (

                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4l16 8-16 8 3-8-3-8Z" />
                          <path d="M7 12h13" />
                        </svg>

                      )}

                    </button>

                  </div>

                  <p className="mt-2 text-center text-[7px] font-medium tracking-[0.18em] text-black/40">
                    VIREL CUSTOMER SUPPORT
                  </p>

                </div>

              </>

            )}

          </section>

        </div>

      </section>

    </main>
  );
}