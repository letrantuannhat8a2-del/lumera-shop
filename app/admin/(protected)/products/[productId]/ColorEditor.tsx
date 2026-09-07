"use client";

import { useState } from "react";

type Color = {
  name: string;
  hex: string;
};

type Props = {
  initialColors: Color[];
  saveColors: (
    colors: Color[]
  ) => Promise<void>;
};

const DEFAULT_COLOR: Color = {
  name: "Ivory",
  hex: "#F3EEE8",
};

export default function ColorEditor({
  initialColors,
  saveColors,
}: Props) {
  const [colors, setColors] =
    useState<Color[]>(
      initialColors.length > 0
        ? initialColors
        : [DEFAULT_COLOR]
    );

  const [saving, setSaving] =
    useState(false);

  // ========================================
  // ADD COLOR
  // ========================================

  function addColor() {
    setColors((current) => [
      ...current,
      {
        name: `Color ${current.length + 1}`,
        hex: "#F3EEE8",
      },
    ]);
  }

  // ========================================
  // UPDATE COLOR
  // ========================================

  function updateColor(
    index: number,
    field: keyof Color,
    value: string
  ) {
    setColors((current) =>
      current.map((color, i) =>
        i === index
          ? {
              ...color,
              [field]: value,
            }
          : color
      )
    );
  }

  // ========================================
  // REMOVE COLOR
  // ========================================

  function removeColor(index: number) {
    if (colors.length === 1) {
      alert(
        "A product must have at least one color."
      );

      return;
    }

    setColors((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  // ========================================
  // SAVE
  // ========================================

  async function handleSave() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const cleanedColors =
        colors
          .map((color) => ({
            name:
              color.name.trim(),
            hex:
              color.hex.trim().toUpperCase(),
          }))
          .filter(
            (color) =>
              color.name.length > 0
          );

      if (
        cleanedColors.length === 0
      ) {
        throw new Error(
          "Please add at least one color."
        );
      }

      for (
        const color of cleanedColors
      ) {
        if (
          !/^#[0-9A-F]{6}$/.test(
            color.hex
          )
        ) {
          throw new Error(
            `Invalid HEX color: ${color.hex}`
          );
        }
      }

      await saveColors(
        cleanedColors
      );

      setColors(
        cleanedColors
      );

      alert(
        "Product colors saved successfully."
      );
    } catch (error) {
      console.error(
        "Save colors error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save colors."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-black/10 bg-white">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">

        <div>

          <p className="text-[9px] tracking-[0.28em] text-[#9a8888]">
            PRODUCT OPTIONS
          </p>

          <h3 className="mt-2 font-serif text-xl">
            Colors
          </h3>

          <p className="mt-2 text-[11px] leading-5 text-gray-400">
            Add the colors available
            for this product.
          </p>

        </div>

        <button
          type="button"
          onClick={addColor}
          disabled={saving}
          className="
            border
            border-black
            px-5
            py-3
            text-[9px]
            tracking-[0.2em]
            transition
            hover:bg-black
            hover:text-white
            disabled:opacity-40
          "
        >
          + ADD COLOR
        </button>

      </div>


      {/* COLORS */}

      <div className="space-y-4 p-6">

        {colors.map(
          (color, index) => (
            <div
              key={index}
              className="
                border
                border-black/10
                bg-[#fcfaf7]
                p-5
              "
            >

              <div className="grid gap-5 md:grid-cols-[auto_1fr_180px_auto] md:items-end">

                {/* PREVIEW */}

                <div>

                  <p className="mb-2 text-[8px] tracking-[0.2em] text-gray-400">
                    PREVIEW
                  </p>

                  <div
                    className="
                      h-12
                      w-12
                      rounded-full
                      border
                      border-black/15
                    "
                    style={{
                      backgroundColor:
                        color.hex ||
                        "#F3EEE8",
                    }}
                  />

                </div>


                {/* NAME */}

                <div>

                  <label className="mb-2 block text-[8px] tracking-[0.2em] text-gray-400">
                    COLOR NAME
                  </label>

                  <input
                    type="text"
                    value={
                      color.name
                    }
                    onChange={(event) =>
                      updateColor(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Ivory"
                    className="
                      h-12
                      w-full
                      border
                      border-black/15
                      bg-white
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                    "
                  />

                </div>


                {/* HEX */}

                <div>

                  <label className="mb-2 block text-[8px] tracking-[0.2em] text-gray-400">
                    HEX COLOR
                  </label>

                  <div className="flex h-12 border border-black/15 bg-white">

                    <input
                      type="color"
                      value={
                        /^#[0-9A-Fa-f]{6}$/.test(
                          color.hex
                        )
                          ? color.hex
                          : "#F3EEE8"
                      }
                      onChange={(event) =>
                        updateColor(
                          index,
                          "hex",
                          event.target.value
                        )
                      }
                      className="
                        h-full
                        w-14
                        cursor-pointer
                        border-0
                        bg-transparent
                        p-1
                      "
                    />

                    <input
                      type="text"
                      value={
                        color.hex
                      }
                      onChange={(event) =>
                        updateColor(
                          index,
                          "hex",
                          event.target.value
                        )
                      }
                      placeholder="#F3EEE8"
                      className="
                        min-w-0
                        flex-1
                        border-0
                        px-3
                        text-xs
                        uppercase
                        outline-none
                      "
                    />

                  </div>

                </div>


                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeColor(
                      index
                    )
                  }
                  disabled={
                    saving ||
                    colors.length ===
                      1
                  }
                  className="
                    h-12
                    border
                    border-red-200
                    px-5
                    text-[8px]
                    tracking-[0.18em]
                    text-red-500
                    transition
                    hover:border-red-500
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  REMOVE
                </button>

              </div>

            </div>
          )
        )}

      </div>


      {/* FOOTER */}

      <div className="flex flex-col gap-4 border-t border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-[10px] text-gray-400">
          {colors.length}{" "}
          {colors.length === 1
            ? "color"
            : "colors"}{" "}
          configured for this product.
        </p>

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={saving}
          className="
            bg-black
            px-7
            py-4
            text-[9px]
            tracking-[0.25em]
            text-white
            transition
            hover:bg-[#a87578]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving
            ? "SAVING..."
            : "SAVE COLORS"}
        </button>

      </div>

    </section>
  );
}