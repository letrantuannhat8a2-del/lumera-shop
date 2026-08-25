"use client";

import { useRef, useState } from "react";

type Props = {
  productId: string;
  slug: string;
  videoUrl: string | null;
};

export default function VideoUploader({
  productId,
  slug,
  videoUrl,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(
      videoUrl
    );

  async function uploadVideo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // CHECK TYPE

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
      alert(
        "Please choose an MP4, WebM or MOV video."
      );

      return;
    }

    // CHECK SIZE

    if (
      file.size >
      50 * 1024 * 1024
    ) {
      alert(
        "Video must be smaller than 50 MB."
      );

      return;
    }

    // LOCAL PREVIEW

    const localUrl =
      URL.createObjectURL(
        file
      );

    setPreviewUrl(
      localUrl
    );

    // FORM DATA

    const formData =
      new FormData();

    formData.append(
      "video",
      file
    );

    formData.append(
      "productId",
      productId
    );

    formData.append(
      "slug",
      slug
    );

    setLoading(true);

    try {
      const response =
        await fetch(
          "/admin/products/video",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Upload failed"
        );
      }

      // SERVER URL

      setPreviewUrl(
        data.url
      );

      alert(
        "Video uploaded successfully."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        error
      );

      setPreviewUrl(
        videoUrl
      );

      alert(
        error instanceof Error
          ? error.message
          : "Upload video failed"
      );
    } finally {
      setLoading(false);

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }

  async function removeVideo() {
    const confirmed =
      confirm(
        "Remove this video?"
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/admin/products/video",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Delete failed"
        );
      }

      setPreviewUrl(
        null
      );

      alert(
        "Video removed."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Delete video failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8">

      {/* TITLE */}

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-[11px] tracking-[0.25em]">
            PRODUCT VIDEO
          </h3>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Add a short video showing the
            design, movement and details.
          </p>
        </div>

        <span className="text-[9px] tracking-[0.2em] text-gray-400">
          MP4 / WEBM / MOV
        </span>

      </div>


      {/* VIDEO PREVIEW */}

      {previewUrl && (
        <div className="mt-7 overflow-hidden border border-black/10 bg-black">

          <video
            key={previewUrl}
            src={previewUrl}
            controls
            muted
            playsInline
            className="max-h-[420px] w-full object-contain"
          />

        </div>
      )}


      {/* UPLOAD */}

      <label
        className="
        mt-7
        block
        cursor-pointer
        border
        border-dashed
        border-black/20
        p-8
        text-center
        transition
        hover:border-black
        "
      >

        <span className="block text-[10px] tracking-[0.2em]">
          {previewUrl
            ? "CHOOSE A DIFFERENT VIDEO"
            : "CHOOSE VIDEO"}
        </span>

        <span className="mt-3 block text-xs text-gray-400">
          Maximum 50 MB
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={
            uploadVideo
          }
          disabled={loading}
          className="sr-only"
        />

      </label>


      {/* REMOVE */}

      {previewUrl && (
        <button
          type="button"
          onClick={
            removeVideo
          }
          disabled={loading}
          className="
          mt-5
          text-[10px]
          tracking-[0.2em]
          text-red-500
          transition
          hover:text-red-700
          disabled:opacity-50
          "
        >
          REMOVE VIDEO
        </button>
      )}


      {/* LOADING */}

      {loading && (
        <p className="mt-5 text-xs text-gray-400">
          Uploading video...
        </p>
      )}

    </div>
  );
}