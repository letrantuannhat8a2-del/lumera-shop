"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image_1?: string | null;
};

type Featured = {
  enabled?: boolean;
  label?: string;
  title?: string;
  description?: string;
  product_ids?: string[];
  buttonText?: string;
  buttonLink?: string;
};

type FeaturedEditorProps = {
  value: Featured;
  products: Product[];
  onChange: (value: Featured) => void;
};

export default function FeaturedEditor({
  value,
  products,
  onChange,
}: FeaturedEditorProps) {
  const [showProducts, setShowProducts] =
    useState(false);

  const productIds =
    value.product_ids ?? [];

  const selectedProducts =
    productIds
      .map((id) =>
        products.find(
          (product) =>
            product.id === id
        )
      )
      .filter(
        (
          product
        ): product is Product =>
          Boolean(product)
      );

  const availableProducts =
    products.filter(
      (product) =>
        !productIds.includes(product.id)
    );

  function update(
    changes: Partial<Featured>
  ) {
    onChange({
      ...value,
      ...changes,
    });
  }

  function addProduct(
    productId: string
  ) {
    if (productIds.includes(productId)) {
      return;
    }

    update({
      product_ids: [
        ...productIds,
        productId,
      ],
    });

    setShowProducts(false);
  }

  function removeProduct(
    productId: string
  ) {
    update({
      product_ids:
        productIds.filter(
          (id) =>
            id !== productId
        ),
    });
  }

  return (
    <section className="border border-black/10 bg-white">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="border-b border-black/10 px-6 py-6 sm:px-8">

        <p className="text-[9px] tracking-[0.3em] text-[#967577]">
          FEATURED PRODUCTS
        </p>

        <h2 className="mt-2 font-serif text-3xl">
          Featured
        </h2>

      </div>

      <div className="space-y-8 p-6 sm:p-8">

        {/* ========================================
            ENABLE
        ======================================== */}

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
            SHOW FEATURED PRODUCTS
          </span>

        </label>

        {/* ========================================
            TEXT CONTENT
        ======================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          <div>
            <label className="text-[9px] tracking-[0.25em] text-gray-500">
              LABEL
            </label>

            <input
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
              placeholder="FEATURED COLLECTION"
            />
          </div>

          <div>
            <label className="text-[9px] tracking-[0.25em] text-gray-500">
              TITLE
            </label>

            <input
              value={
                value.title ?? ""
              }
              onChange={(event) =>
                update({
                  title:
                    event.target.value,
                })
              }
              className="mt-2 w-full border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
              placeholder="Our most loved pieces"
            />
          </div>

        </div>

        {/* ========================================
            DESCRIPTION
        ======================================== */}

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
            placeholder="Discover our most loved bridal shoes."
          />
        </div>

        {/* ========================================
            SELECTED PRODUCTS
        ======================================== */}

        <div>

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[9px] tracking-[0.25em] text-gray-500">
                SELECTED PRODUCTS
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {selectedProducts.length}{" "}
                selected
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowProducts(
                  !showProducts
                )
              }
              className="border border-black px-5 py-3 text-[9px] tracking-[0.2em] transition hover:bg-black hover:text-white"
            >
              + ADD PRODUCT
            </button>

          </div>

          {/* ====================================
              PRODUCT PICKER
          ==================================== */}

          {showProducts && (
            <div className="mt-5 border border-black/10 bg-[#faf9f7]">

              {availableProducts.length ===
              0 ? (

                <div className="px-5 py-6 text-sm text-gray-400">
                  All products have already
                  been selected.
                </div>

              ) : (

                <div className="divide-y divide-black/10">

                  {availableProducts.map(
                    (product) => (
                      <button
                        key={
                          product.id
                        }
                        type="button"
                        onClick={() =>
                          addProduct(
                            product.id
                          )
                        }
                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white"
                      >

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-white">

                          {product.image_1 ? (
                            <img
                              src={
                                product.image_1
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[8px] text-gray-400">
                              NO IMAGE
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="font-serif text-lg">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {product.currency ??
                              "USD"}{" "}
                            {Number(
                              product.price
                            ).toFixed(2)}
                          </p>

                        </div>

                      </button>
                    )
                  )}

                </div>

              )}

            </div>
          )}

          {/* ====================================
              SELECTED LIST
          ==================================== */}

          <div className="mt-5 space-y-3">

            {selectedProducts.length ===
            0 ? (

              <div className="border border-dashed border-black/20 px-6 py-10 text-center">

                <p className="font-serif text-xl">
                  No featured products
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Click ADD PRODUCT to
                  choose products.
                </p>

              </div>

            ) : (

              selectedProducts.map(
                (product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border border-black/10 p-4"
                  >

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#f5f3ef]">

                      {product.image_1 ? (
                        <img
                          src={
                            product.image_1
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[8px] text-gray-400">
                          NO IMAGE
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] tracking-[0.2em] text-gray-400">
                        PRODUCT{" "}
                        {index + 1}
                      </p>

                      <p className="mt-1 font-serif text-xl">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {product.currency ??
                          "USD"}{" "}
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeProduct(
                          product.id
                        )
                      }
                      className="shrink-0 text-[9px] tracking-[0.15em] text-red-500 transition hover:text-red-700"
                    >
                      REMOVE
                    </button>

                  </div>
                )
              )

            )}

          </div>

        </div>

        {/* ========================================
            BUTTON
        ======================================== */}

        <div className="grid gap-6 border-t border-black/10 pt-8 lg:grid-cols-2">

          <div>
            <label className="text-[9px] tracking-[0.25em] text-gray-500">
              BUTTON TEXT
            </label>

            <input
              value={
                value.buttonText ?? ""
              }
              onChange={(event) =>
                update({
                  buttonText:
                    event.target.value,
                })
              }
              className="mt-2 w-full border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
              placeholder="VIEW ALL COLLECTION"
            />
          </div>

          <div>
            <label className="text-[9px] tracking-[0.25em] text-gray-500">
              BUTTON LINK
            </label>

            <input
              value={
                value.buttonLink ?? ""
              }
              onChange={(event) =>
                update({
                  buttonLink:
                    event.target.value,
                })
              }
              className="mt-2 w-full border border-black/10 px-4 py-4 text-sm outline-none focus:border-black"
              placeholder="/shop"
            />
          </div>

        </div>

      </div>

    </section>
  );
}