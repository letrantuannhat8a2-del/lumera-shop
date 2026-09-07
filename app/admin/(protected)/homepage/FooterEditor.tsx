"use client";

type FooterLink = {
  label: string;
  href: string;
};

type FooterData = {
  enabled?: boolean;
  description?: string;
  shopLinks?: FooterLink[];
  clientCareLinks?: FooterLink[];
  aboutLinks?: FooterLink[];
  copyright?: string;
};

type FooterEditorProps = {
  value: FooterData;
  onChange: (value: FooterData) => void;
};

export default function FooterEditor({
  value,
  onChange,
}: FooterEditorProps) {
  function update(
    changes: Partial<FooterData>
  ) {
    onChange({
      ...value,
      ...changes,
    });
  }

  function updateLink(
    group:
      | "shopLinks"
      | "clientCareLinks"
      | "aboutLinks",
    index: number,
    changes: Partial<FooterLink>
  ) {
    const links = [
      ...(value[group] ?? []),
    ];

    links[index] = {
      ...links[index],
      ...changes,
    };

    update({
      [group]: links,
    });
  }

  function addLink(
    group:
      | "shopLinks"
      | "clientCareLinks"
      | "aboutLinks"
  ) {
    update({
      [group]: [
        ...(value[group] ?? []),
        {
          label: "New Link",
          href: "/",
        },
      ],
    });
  }

  function removeLink(
    group:
      | "shopLinks"
      | "clientCareLinks"
      | "aboutLinks",
    index: number
  ) {
    update({
      [group]: (value[group] ?? []).filter(
        (_, linkIndex) =>
          linkIndex !== index
      ),
    });
  }

  function renderLinks(
    title: string,
    group:
      | "shopLinks"
      | "clientCareLinks"
      | "aboutLinks"
  ) {
    const links = value[group] ?? [];

    return (
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            {title}
          </label>

          <button
            type="button"
            onClick={() => addLink(group)}
            className="border border-black px-3 py-2 text-[8px] tracking-[0.15em]"
          >
            + ADD LINK
          </button>

        </div>

        {links.map((link, index) => (
          <div
            key={`${group}-${index}`}
            className="border border-black/10 p-4"
          >

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">

              <input
                type="text"
                value={link.label}
                onChange={(event) =>
                  updateLink(
                    group,
                    index,
                    {
                      label:
                        event.target.value,
                    }
                  )
                }
                placeholder="Link label"
                className="border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
              />

              <input
                type="text"
                value={link.href}
                onChange={(event) =>
                  updateLink(
                    group,
                    index,
                    {
                      href:
                        event.target.value,
                    }
                  )
                }
                placeholder="/shop"
                className="border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  removeLink(
                    group,
                    index
                  )
                }
                className="border border-black/20 px-4 py-3 text-[8px] tracking-[0.15em]"
              >
                REMOVE
              </button>

            </div>

          </div>
        ))}

      </div>
    );
  }

  return (
    <section className="border border-black/10 bg-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-black/10 px-6 py-6 sm:px-8">

        <p className="text-[9px] tracking-[0.3em] text-[#967577]">
          FOOTER
        </p>

        <h2 className="mt-2 font-serif text-3xl">
          Footer
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
            SHOW FOOTER
          </span>

        </label>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <div>

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            BRAND DESCRIPTION
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
            placeholder="Elegant footwear designed for weddings, celebrations and unforgettable occasions."
          />

        </div>

        {/* =====================================================
            SHOP LINKS
        ===================================================== */}

        {renderLinks(
          "SHOP LINKS",
          "shopLinks"
        )}

        {/* =====================================================
            CLIENT CARE LINKS
        ===================================================== */}

        {renderLinks(
          "CLIENT CARE LINKS",
          "clientCareLinks"
        )}

        {/* =====================================================
            ABOUT / SOCIAL LINKS
        ===================================================== */}

        {renderLinks(
          "VIREL / SOCIAL LINKS",
          "aboutLinks"
        )}

        {/* =====================================================
            COPYRIGHT
        ===================================================== */}

        <div>

          <label className="text-[9px] tracking-[0.25em] text-gray-500">
            COPYRIGHT
          </label>

          <input
            type="text"
            value={
              value.copyright ?? ""
            }
            onChange={(event) =>
              update({
                copyright:
                  event.target.value,
              })
            }
            className="mt-2 w-full border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
            placeholder="© 2026 VIREL BRIDAL SHOES. ALL RIGHTS RESERVED."
          />

        </div>

      </div>

    </section>
  );
}