"use client";

type BrandStatement = {
  enabled?: boolean;
  label?: string;
  title?: string;
  description?: string;
};

type BrandStatementEditorProps = {
  value: BrandStatement;
  onChange: (
    value: BrandStatement
  ) => void;
};

export default function BrandStatementEditor({
  value,
  onChange,
}: BrandStatementEditorProps) {
  function update(
    changes: Partial<BrandStatement>
  ) {
    onChange({
      ...value,
      ...changes,
    });
  }

  return (
    <section className="border border-black/10 bg-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-black/10 px-6 py-6 sm:px-8">

        <p className="text-[9px] tracking-[0.3em] text-[#967577]">
          BRAND STATEMENT
        </p>

        <h2 className="mt-2 font-serif text-3xl">
          Brand Statement
        </h2>

      </div>

      <div className="space-y-8 p-6 sm:p-8">

        {/* =====================================================
            ENABLE
        ===================================================== */}

        <label className="flex cursor-pointer items-center gap-3">

          <input
            type="checkbox"
            checked={
              value.enabled ?? true
            }
            onChange={(event) =>
              update({
                enabled:
                  event.target.checked,
              })
            }
            className="h-4 w-4"
          />

          <span className="text-[10px] tracking-[0.2em]">
            SHOW BRAND STATEMENT
          </span>

        </label>

        {/* =====================================================
            LABEL
        ===================================================== */}

        <div>

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            LABEL
          </label>

          <input
            type="text"
            value={
              value.label ?? ""
            }
            onChange={(event) =>
              update({
                label:
                  event.target.value,
              })
            }
            className="mt-2 w-full border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
            placeholder="VIREL"
          />

        </div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div>

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            TITLE
          </label>

          <textarea
            value={
              value.title ?? ""
            }
            onChange={(event) =>
              update({
                title:
                  event.target.value,
              })
            }
            rows={3}
            className="mt-2 w-full resize-none border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
            placeholder={`Made for the moments
you'll remember forever.`}
          />

        </div>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <div>

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            DESCRIPTION
          </label>

          <textarea
            value={
              value.description ?? ""
            }
            onChange={(event) =>
              update({
                description:
                  event.target.value,
              })
            }
            rows={4}
            className="mt-2 w-full resize-none border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
            placeholder="Refined silhouettes. Romantic details. Beautifully considered from every angle."
          />

        </div>

        {/* =====================================================
            PREVIEW
        ===================================================== */}

        <div className="border-t border-black/10 pt-8">

          <p className="mb-4 text-[9px] tracking-[0.25em] text-gray-500">
            PREVIEW
          </p>

          <div className="bg-[#fffdfb] px-6 py-14 text-center sm:px-10">

            <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
              {value.label ||
                "VIREL"}
            </p>

            <h3 className="mx-auto mt-5 max-w-3xl whitespace-pre-line font-serif text-3xl leading-tight sm:text-4xl">
              {value.title ||
                "Made for the moments\nyou'll remember forever."}
            </h3>

            {value.description && (
              <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-xs leading-7 text-[#7b6d6d]">
                {value.description}
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}