"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import { createClient } from "../lib/supabase/client";

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

type Conversation = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ChatData = {
  conversation: Conversation | null;
  messages: Message[];
};

export default function ChatBox() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [message, setMessage] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
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

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  // =====================================================
  // LOAD CHAT
  // =====================================================

  async function loadChat() {
    try {
      setLoading(true);

      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setMessages([]);
        setConversation(null);
        return;
      }

      const response =
        await fetch("/api/chat", {
          cache: "no-store",
        });

      if (!response.ok) {
        return;
      }

      const data: ChatData =
        await response.json();

      setConversation(
        data.conversation ?? null
      );

      setMessages(
        Array.isArray(data.messages)
          ? data.messages
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load chat:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOAD WHEN OPEN
  // =====================================================

  useEffect(() => {
    if (!open) return;

    loadChat();
  }, [open]);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    if (!open) return;

    const interval =
      setInterval(() => {
        loadChat();
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [open]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    if (!open) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, open]);

  // =====================================================
  // CLEAN PREVIEW
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
  // SELECT FILE
  // =====================================================

  function handleFileSelect(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowed =
      file.type.startsWith("image/") ||
      file.type.startsWith("video/");

    if (!allowed) {
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
  // REMOVE SELECTED FILE
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
      fileInputRef.current.value = "";
    }
  }

  // =====================================================
  // START RECORDING
  // =====================================================

  async function startRecording() {
    if (recording) return;

    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

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

      audioChunksRef.current = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
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
        "Voice recording error:",
        error
      );

      alert(
        "Unable to access your microphone."
      );
    }
  }

  // =====================================================
  // STOP RECORDING
  // =====================================================

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) return;

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
          `voice-${Date.now()}.${extension}`,
          {
            type:
              blob.type ||
              "audio/webm",
          }
        );

      setSelectedFile(
        voiceFile
      );

      setPreviewUrl(
        URL.createObjectURL(
          voiceFile
        )
      );

      const stream =
        recorder.stream;

      stream
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
  // FORMAT RECORDING TIME
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
  // SEND MESSAGE
  // =====================================================

  async function sendMessage() {
    const content =
      message.trim();

    if (
      (!content &&
        !selectedFile) ||
      sending ||
      recording
    ) {
      return;
    }

    try {
      setSending(true);

      const formData =
        new FormData();

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
          "/api/chat",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to send message."
        );
      }

      if (data.conversation) {
        setConversation(
          data.conversation
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

      setMessage("");

      removeSelectedFile();
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  }

  // =====================================================
  // ENTER TO SEND
  // =====================================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  // =====================================================
  // DATE FORMAT
  // =====================================================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    )
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      )
      .toUpperCase();
  }

  // =====================================================
  // TIME FORMAT
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
  // GROUP BY DATE
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
            messages: [item],
          });
        }
      }

      return groups;
    }, [messages]);

  // =====================================================
  // HIDE CUSTOMER CHAT IN ADMIN
  // =====================================================

  if (pathname.startsWith("/admin")) {
    return null;
  }

  // =====================================================
  // CLOSED
  // =====================================================

  if (!open) {
    return (
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        aria-label="Open VIREL support"
        className="
          fixed
          bottom-6
          right-6
          z-[9999]
          flex
          h-[62px]
          w-[62px]
          items-center
          justify-center
          rounded-full
          bg-[#201b1b]
          text-white
          shadow-[0_12px_40px_rgba(0,0,0,0.18)]
          transition
          duration-300
          hover:scale-105
          hover:bg-black
        "
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2 .9-4.1A7.5 7.5 0 1 1 20 11.5Z" />
        </svg>
      </button>
    );
  }

  // =====================================================
  // OPEN CHAT
  // =====================================================

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        z-[9999]
        flex
        h-[min(760px,calc(100vh-40px))]
        w-[min(440px,calc(100vw-40px))]
        flex-col
        overflow-hidden
        border
        border-black/10
        bg-[#fcfaf7]
        shadow-[0_20px_70px_rgba(0,0,0,0.20)]
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          shrink-0
          bg-[#201b1b]
          px-7
          py-7
          text-white
        "
      >

        <div className="flex items-start justify-between">

          <div>

            <p
              className="
                text-[10px]
                tracking-[0.38em]
                text-white/75
              "
            >
              VIREL
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-[30px]
                leading-none
              "
            >
              Client Support
            </h2>

            <div className="mt-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-white" />

              <p
                className="
                  text-[9px]
                  font-medium
                  tracking-[0.2em]
                  text-white/65
                "
              >
                AVAILABLE TO HELP
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/25
              text-white
              transition
              hover:border-white/60
              hover:bg-white/10
            "
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>

        </div>

      </header>


      {/* =================================================
          MESSAGES
      ================================================= */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          bg-[#fcfaf7]
          px-6
          py-7
        "
      >

        {loading ? (

          <div className="flex h-full items-center justify-center">

            <p
              className="
                text-[9px]
                font-medium
                tracking-[0.25em]
                text-black/55
              "
            >
              LOADING
            </p>

          </div>

        ) : messages.length === 0 ? (

          <div className="flex h-full flex-col items-center justify-center text-center">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-black/15
              "
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2 .9-4.1A7.5 7.5 0 1 1 20 11.5Z" />
              </svg>
            </div>

            <h3
              className="
                mt-5
                font-serif
                text-2xl
                text-[#201b1b]
              "
            >
              How can we help?
            </h3>

            <p
              className="
                mt-3
                max-w-[280px]
                text-[11px]
                leading-6
                text-black/60
              "
            >
              Have a question about
              your order or one of
              our pieces? Send us a
              message.
            </p>

          </div>

        ) : (

          groupedMessages.map(
            (group) => (

              <div
                key={group.date}
                className="mb-8"
              >

                {/* DATE */}

                <div
                  className="
                    mb-7
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div className="h-px flex-1 bg-black/10" />

                  <span
                    className="
                      shrink-0
                      text-[9px]
                      font-semibold
                      tracking-[0.28em]
                      text-black/60
                    "
                  >
                    {formatDate(
                      group.messages[0]
                        .created_at
                    )}
                  </span>

                  <div className="h-px flex-1 bg-black/10" />

                </div>


                {group.messages.map(
                  (item) => {

                    const isCustomer =
                      item.sender_role ===
                      "customer";

                    return (
                      <div
                        key={item.id}
                        className={`
                          mb-5
                          flex
                          ${
                            isCustomer
                              ? "justify-end"
                              : "justify-start"
                          }
                        `}
                      >

                        <div
                          className={`
                            max-w-[82%]
                            ${
                              isCustomer
                                ? "items-end"
                                : "items-start"
                            }
                          `}
                        >

                          {/* IMAGE */}

                          {item.message_type ===
                            "image" &&
                            item.file_url && (
                              <img
                                src={
                                  item.file_url
                                }
                                alt={
                                  item.file_name ??
                                  "Image"
                                }
                                className="
                                  max-h-[280px]
                                  max-w-full
                                  object-cover
                                "
                              />
                            )}


                          {/* VIDEO */}

                          {item.message_type ===
                            "video" &&
                            item.file_url && (
                              <video
                                src={
                                  item.file_url
                                }
                                controls
                                playsInline
                                className="
                                  max-h-[280px]
                                  max-w-full
                                  bg-black
                                "
                              />
                            )}


                          {/* AUDIO */}

                          {item.message_type ===
                            "audio" &&
                            item.file_url && (
                              <div
                                className={`
                                  flex
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  ${
                                    isCustomer
                                      ? "bg-[#201b1b]"
                                      : "border border-black/10 bg-white"
                                  }
                                `}
                              >

                                <div
                                  className={`
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    ${
                                      isCustomer
                                        ? "bg-white text-[#201b1b]"
                                        : "bg-[#201b1b] text-white"
                                    }
                                  `}
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
                                  src={
                                    item.file_url
                                  }
                                  controls
                                  className="max-w-[210px]"
                                />

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
                                  isCustomer
                                    ? "bg-[#201b1b] text-white"
                                    : "border border-black/10 bg-white text-[#201b1b]"
                                }
                              `}
                            >

                              <p
                                className="
                                  whitespace-pre-wrap
                                  text-[14px]
                                  leading-[1.55]
                                "
                              >
                                {item.content}
                              </p>

                            </div>
                          )}


                          {/* TIME */}

                          <p
                            className={`
                              mt-2
                              text-[9px]
                              font-medium
                              tracking-[0.08em]
                              ${
                                isCustomer
                                  ? "text-black/50"
                                  : "text-black/45"
                              }
                            `}
                          >
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

        <div
          ref={messagesEndRef}
        />

      </div>


      {/* =================================================
          FILE PREVIEW
      ================================================= */}

      {selectedFile && (
        <div
          className="
            shrink-0
            border-t
            border-black/10
            bg-[#f5f2ed]
            px-5
            py-4
          "
        >

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
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              ) : selectedFile.type.startsWith(
                  "video/"
                ) ? (

                <video
                  src={
                    previewUrl ??
                    ""
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-[#201b1b]
                    text-white
                  "
                >
                  🎤
                </div>

              )}

              <button
                type="button"
                onClick={
                  removeSelectedFile
                }
                className="
                  absolute
                  right-1
                  top-1
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-white
                "
              >
                ×
              </button>

            </div>

            <div className="min-w-0">

              <p className="truncate text-[11px] font-medium">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-[9px] text-black/50">
                {(
                  selectedFile.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          INPUT
      ================================================= */}

      <footer
        className="
          shrink-0
          border-t
          border-black/10
          bg-white
          px-5
          py-5
        "
      >

        {/* HIDDEN FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={
            handleFileSelect
          }
          className="hidden"
        />


        {/* RECORDING */}

        {recording && (
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              border
              border-black/10
              bg-[#f7f4ef]
              px-4
              py-3
            "
          >

            <div className="flex items-center gap-3">

              <span
                className="
                  h-2
                  w-2
                  animate-pulse
                  rounded-full
                  bg-red-500
                "
              />

              <span className="text-[11px] font-medium">
                Recording
              </span>

              <span className="text-[10px] text-black/50">
                {formatRecordingTime()}
              </span>

            </div>

            <button
              type="button"
              onClick={
                stopRecording
              }
              className="
                border
                border-black/15
                px-4
                py-2
                text-[9px]
                font-medium
                tracking-[0.12em]
                transition
                hover:bg-black
                hover:text-white
              "
            >
              STOP
            </button>

          </div>
        )}


        <div
          className="
            flex
            items-end
            gap-2
            border
            border-black/15
            bg-[#fcfaf7]
            px-3
            py-3
            transition
            focus-within:border-black/40
          "
        >

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
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              text-black/60
              transition
              hover:text-black
              disabled:opacity-30
            "
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


          {/* MESSAGE */}

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={
              recording
                ? "Recording voice..."
                : "Type a message..."
            }
            rows={1}
            maxLength={5000}
            disabled={recording}
            className="
              min-h-[28px]
              max-h-[110px]
              flex-1
              resize-none
              bg-transparent
              py-2
              text-[13px]
              leading-5
              text-[#201b1b]
              outline-none
              placeholder:text-black/45
              disabled:opacity-50
            "
          />


          {/* MICROPHONE */}

          <button
            type="button"
            onClick={
              recording
                ? stopRecording
                : startRecording
            }
            disabled={sending}
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
              sendMessage
            }
            disabled={
              sending ||
              recording ||
              (!message.trim() &&
                !selectedFile)
            }
            aria-label="Send message"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              bg-[#201b1b]
              text-white
              transition
              hover:bg-black
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >

            {sending ? (

              <span className="text-[9px]">
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

        <p
          className="
            mt-3
            text-center
            text-[8px]
            font-medium
            tracking-[0.22em]
            text-black/45
          "
        >
          VIREL CLIENT SUPPORT
        </p>

      </footer>

    </div>
  );
}