"use client";

type ServiceItem = {
  title: string;
  subtitle: string;
};

type ServiceStripData = {
  enabled?: boolean;
  items?: ServiceItem[];
};

type ServiceStripEditorProps = {
  value: ServiceStripData;
  onChange: (value: ServiceStripData) => void;
};

export default function ServiceStripEditor({
  value,
  onChange,
}: ServiceStripEditorProps) {
  function update(changes: Partial<ServiceStripData>) {
    onChange({
      ...value,
      ...changes,
    });
  }

  function updateItem(
    index: number,
    changes: Partial<ServiceItem>
  ) {
    const items = [...(value.items ?? [])];

    items[index] = {
      ...items[index],
      ...changes,
    };

    update({
      items,
    });
  }

  function addItem() {
    update({
      items: [
        ...(value.items ?? []),
        {
          title: "NEW SERVICE",
          subtitle: "Service description",
        },
      ],
    });
  }

  function removeItem(index: number) {
    update({
      items: (value.items ?? []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    });
  }

  return (
    <section className="border border-black/10 bg-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-black/10 px-6 py-6 sm:px-8">

        <p className="text-[9px] tracking-[0.3em] text-[#967577]">
          SERVICE STRIP
        </p>

        <h2 className="mt-2 font-serif text-3xl">
          Service Strip
        </h2>

      </div>

      <div className="space-y-8 p-6 sm:p-8">

        {/* =====================================================
            ENABLE
        ===================================================== */}

        <label className="flex cursor-pointer items-center gap-3">

          <input
            type="checkbox"
            checked={value.enabled ?? true}
            onChange={(event) =>
              update({
                enabled: event.target.checked,
              })
            }
            className="h-4 w-4"
          />

          <span className="text-[10px] tracking-[0.2em]">
            SHOW SERVICE STRIP
          </span>

        </label>

        {/* =====================================================
            ITEMS
        ===================================================== */}

        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <label className="text-[9px] tracking-[0.25em] text-gray-500">
              SERVICES
            </label>

            <button
              type="button"
              onClick={addItem}
              className="border border-black px-3 py-2 text-[8px] tracking-[0.15em]"
            >
              + ADD SERVICE
            </button>

          </div>

          {(value.items ?? []).map(
            (
              item: ServiceItem,
              index: number
            ) => (
              <div
                key={`service-${index}`}
                className="border border-black/10 p-4"
              >

                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">

                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateItem(index, {
                        title:
                          event.target.value,
                      })
                    }
                    placeholder="Service title"
                    className="border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
                  />

                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(event) =>
                      updateItem(index, {
                        subtitle:
                          event.target.value,
                      })
                    }
                    placeholder="Service description"
                    className="border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="border border-black/20 px-4 py-3 text-[8px] tracking-[0.15em]"
                  >
                    REMOVE
                  </button>

                </div>

              </div>
            )
          )}

        </div>

        {/* =====================================================
            PREVIEW
        ===================================================== */}

        <div className="border-t border-black/10 pt-8">

          <p className="mb-4 text-[9px] tracking-[0.25em] text-gray-500">
            PREVIEW
          </p>

          <div className="grid grid-cols-2 border border-black/10 md:grid-cols-4">

            {(value.items ?? []).map(
              (
                item: ServiceItem,
                index: number
              ) => (
                <div
                  key={`preview-${index}`}
                  className="border-r border-b border-black/10 px-4 py-7 text-center last:border-r-0"
                >

                  <div className="mb-3 text-xl text-[#c79898]">
                    ♢
                  </div>

                  <p className="text-[8px] tracking-[0.1em]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[8px] text-[#897979]">
                    {item.subtitle}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </section>
  );
}