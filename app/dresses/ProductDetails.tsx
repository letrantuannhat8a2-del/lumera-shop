"use client";

import Image from "next/image";
import { useState } from "react";

import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;

  description:
    | string
    | null;

  image_1:
    | string
    | null;

  image_2:
    | string
    | null;

  image_3:
    | string
    | null;

  image_4:
    | string
    | null;

  image_5:
    | string
    | null;

  sizes: string[];

  stock: number;
};

type ProductVariant = {
  size: string;
  stock: number;
};

type ProductDetailsProps = {
  product: Product;
  variants: ProductVariant[];
};

export default function ProductDetails({
  product,
  variants,
}: ProductDetailsProps) {
  const { addToCart } =
    useCart();

  const [
    selectedSize,
    setSelectedSize,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const images = [
    product.image_1,
    product.image_2,
    product.image_3,
    product.image_4,
    product.image_5,
  ].filter(
    (
      image
    ): image is string =>
      Boolean(image)
  );

  const formatUSD = (
    value: number
  ) =>
    new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          product.currency,
      }
    ).format(value);

  // STOCK OF SELECTED SIZE
  const selectedVariant =
    variants.find(
      (variant) =>
        variant.size ===
        selectedSize
    );

  const selectedStock =
    selectedVariant?.stock ?? 0;

  // TOTAL STOCK OF ALL SIZES
  const totalStock =
    variants.reduce(
      (
        total,
        variant
      ) =>
        total +
        Number(
          variant.stock
        ),
      0
    );

  const handleSelectSize = (
    size: string
  ) => {
    const variant =
      variants.find(
        (item) =>
          item.size ===
          size
      );

    if (
      !variant ||
      variant.stock <= 0
    ) {
      return;
    }

    setSelectedSize(
      size
    );

    // Reset quantity when changing size
    setQuantity(1);
  };

  const handleIncrease =
    () => {
      if (!selectedSize) {
        return;
      }

      if (
        quantity >=
        selectedStock
      ) {
        return;
      }

      setQuantity(
        (current) =>
          current + 1
      );
    };

  const handleDecrease =
    () => {
      setQuantity(
        (current) =>
          Math.max(
            1,
            current - 1
          )
      );
    };

  const handleAddToBag =
    () => {
      if (
        !selectedSize
      ) {
        return;
      }

      if (
        selectedStock <= 0
      ) {
        alert(
          "This size is sold out."
        );

        return;
      }

      if (
        quantity >
        selectedStock
      ) {
        alert(
          `Only ${selectedStock} item(s) left in size ${selectedSize}.`
        );

        return;
      }

      addToCart({
        id: product.id,

        name:
          product.name,

        price:
          Number(
            product.price
          ),

        image:
          product.image_1 ||
          "/image/image_1.png",

        size:
          selectedSize,

        quantity,
         stock: selectedStock,
      });

      alert(
        `${product.name} — Size ${selectedSize} — Quantity ${quantity} added to bag.`
      );
    };

  return (
    <section className="grid grid-cols-1 gap-12 px-12 py-10 lg:grid-cols-[1.5fr_0.7fr]">

      {/* IMAGES */}
      <div className="grid grid-cols-2 gap-4">

        {images.map(
          (
            image,
            index
          ) => {
            const isLastOddImage =
              images.length %
                2 !==
                0 &&
              index ===
                images.length -
                  1;

            if (
              isLastOddImage
            ) {
              return (
                <div
                  key={
                    image
                  }
                  className="col-span-2 flex justify-center py-12"
                >
                  <div className="relative aspect-[3/4] w-[48%] max-w-[560px] overflow-hidden bg-[#eee9e3]">

                    <Image
                      src={
                        image
                      }
                      alt={`${product.name} ${
                        index +
                        1
                      }`}
                      fill
                      sizes="(max-width: 1024px) 48vw, 32vw"
                      className="object-cover"
                    />

                  </div>
                </div>
              );
            }

            return (
              <div
                key={
                  image
                }
                className="relative aspect-[3/4] overflow-hidden bg-[#eee9e3]"
              >

                <Image
                  src={
                    image
                  }
                  alt={`${product.name} ${
                    index +
                    1
                  }`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 32vw"
                  priority={
                    index ===
                    0
                  }
                  className="object-cover"
                />

              </div>
            );
          }
        )}

      </div>

      {/* PRODUCT INFO */}
      <div className="lg:sticky lg:top-10 lg:self-start">

        <p className="text-[10px] tracking-[0.3em] text-gray-400">
          LUMÉRA COLLECTION
        </p>

        <h1 className="mt-4 font-serif text-4xl">
          {product.name}
        </h1>

        <p className="mt-4 text-sm">
          {formatUSD(
            Number(
              product.price
            )
          )}{" "}
          USD
        </p>

        {/* COLOR */}
        <div className="mt-10 border-t border-black/10 pt-7">

          <p className="text-xs tracking-[0.18em]">
            COLOR
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Ivory
          </p>

        </div>

        {/* SIZE */}
        <div className="mt-8">

          <div className="flex items-center justify-between">

            <p className="text-xs tracking-[0.18em]">
              SIZE
            </p>

            {selectedSize && (
              <p className="text-xs text-gray-400">
                Selected:{" "}
                {
                  selectedSize
                }
              </p>
            )}

          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">

            {product.sizes.map(
              (size) => {
                const variant =
                  variants.find(
                    (
                      item
                    ) =>
                      item.size ===
                      size
                  );

                const stock =
                  variant?.stock ??
                  0;

                const soldOut =
                  stock <=
                  0;

                const selected =
                  selectedSize ===
                  size;

                return (
                  <button
                    key={
                      size
                    }
                    type="button"
                    disabled={
                      soldOut
                    }
                    onClick={() =>
                      handleSelectSize(
                        size
                      )
                    }
                    className={`relative min-h-[64px] border px-2 py-2 transition ${
                      soldOut
                        ? "cursor-not-allowed border-black/10 bg-gray-100 text-gray-300"
                        : selected
                          ? "border-black bg-black text-white"
                          : "border-black/20 hover:border-black"
                    }`}
                  >

                    <span className="block text-xs">
                      {
                        size
                      }
                    </span>

                    <span
                      className={`mt-1 block text-[9px] ${
                        selected
                          ? "text-white/70"
                          : soldOut
                            ? "text-gray-300"
                            : "text-gray-400"
                      }`}
                    >
                      {soldOut
                        ? "SOLD OUT"
                        : `${stock} LEFT`}
                    </span>

                  </button>
                );
              }
            )}

          </div>

          {/* SELECTED SIZE STOCK */}
          {selectedSize && (
            <div className="mt-4 flex items-center justify-between">

              <p className="text-xs text-gray-500">
                Size{" "}
                {
                  selectedSize
                }
              </p>

              <p
                className={`text-xs ${
                  selectedStock <=
                  2
                    ? "font-medium text-black"
                    : "text-gray-500"
                }`}
              >
                {
                  selectedStock
                }{" "}
                {selectedStock ===
                1
                  ? "piece"
                  : "pieces"}{" "}
                remaining
              </p>

            </div>
          )}

        </div>

        {/* QUANTITY */}
        <div className="mt-8">

          <p className="text-xs tracking-[0.18em]">
            QUANTITY
          </p>

          <div className="mt-4 flex items-center gap-5">

            <div className="flex w-fit items-center border border-black/20">

              <button
                type="button"
                onClick={
                  handleDecrease
                }
                disabled={
                  quantity <=
                  1
                }
                className="h-12 w-12 text-lg disabled:cursor-not-allowed disabled:text-gray-300"
              >
                −
              </button>

              <span className="flex h-12 w-12 items-center justify-center text-sm">
                {
                  quantity
                }
              </span>

              <button
                type="button"
                onClick={
                  handleIncrease
                }
                disabled={
                  !selectedSize ||
                  quantity >=
                    selectedStock
                }
                className="h-12 w-12 text-lg disabled:cursor-not-allowed disabled:text-gray-300"
              >
                +
              </button>

            </div>

            {selectedSize &&
              quantity >=
                selectedStock && (
                <p className="text-xs text-gray-400">
                  Maximum
                  available
                  quantity
                </p>
              )}

          </div>

        </div>

        {/* ADD TO BAG */}
        <button
          type="button"
          disabled={
            !selectedSize ||
            selectedStock <=
              0
          }
          onClick={
            handleAddToBag
          }
          className={`mt-9 w-full py-5 text-xs tracking-[0.22em] transition ${
            selectedSize &&
            selectedStock >
              0
              ? "bg-black text-white hover:bg-black/80"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          {!selectedSize
            ? "SELECT A SIZE"
            : selectedStock <=
                0
              ? "SOLD OUT"
              : "ADD TO BAG"}
        </button>

        {/* WISHLIST */}
        <button
          type="button"
          className="mt-3 w-full border border-black/20 py-5 text-xs tracking-[0.22em] transition hover:border-black"
        >
          ADD TO WISHLIST
        </button>

        {/* DESCRIPTION */}
        <div className="mt-10 border-t border-black/10 pt-7">

          <p className="text-xs tracking-[0.18em]">
            DETAILS
          </p>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            {product.description ||
              "A timeless LUMÉRA piece designed with refined proportions and an elegant silhouette."}
          </p>

        </div>

        {/* AVAILABILITY */}
        <div className="mt-7 border-t border-black/10 pt-7">

          <p className="text-xs tracking-[0.18em]">
            AVAILABILITY
          </p>

          <p className="mt-4 text-sm text-gray-600">
            {totalStock >
            0
              ? `${totalStock} pieces available`
              : "Out of stock"}
          </p>

        </div>

      </div>

    </section>
  );
}