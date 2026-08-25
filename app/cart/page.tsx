"use client";

import Image from "next/image";
import Link from "next/link";

import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#faf9f7] text-black">

      <Header />

      {/* TITLE */}

      <section className="px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14 lg:px-12 lg:pb-12 lg:pt-16">

        <p className="text-[9px] tracking-[0.3em] text-gray-400 sm:text-xs">
          YOUR SELECTION
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:mt-4 sm:text-6xl">
          Shopping Bag
        </h1>

      </section>


      {cart.length === 0 ? (

        /* ========================================
           EMPTY BAG
        ======================================== */

        <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">

          <div className="border-t border-black/10 py-16 text-center sm:py-20">

            <p className="text-sm sm:text-lg">
              Your bag is currently empty.
            </p>

            <Link
              href="/dresses"
              className="
                mt-7
                inline-block
                bg-black
                px-8
                py-4
                text-[10px]
                tracking-[0.2em]
                text-white
                transition
                hover:bg-neutral-800
                sm:mt-8
                sm:px-10
                sm:text-xs
              "
            >
              SHOP DRESSES
            </Link>

          </div>

        </section>

      ) : (

        /* ========================================
           BAG CONTENT
        ======================================== */

        <section className="grid grid-cols-1 gap-10 px-5 pb-20 sm:gap-14 sm:px-8 sm:pb-24 lg:grid-cols-[1.5fr_0.7fr] lg:gap-16 lg:px-12 lg:pb-28">

          {/* ========================================
              PRODUCTS
          ======================================== */}

          <div className="border-t border-black/10">

            {cart.map((item) => (

              <div
                key={`${item.id}-${item.size}`}
                className="
                  grid
                  grid-cols-[95px_1fr]
                  gap-4
                  border-b
                  border-black/10
                  py-6
                  sm:grid-cols-[140px_1fr]
                  sm:gap-6
                  sm:py-8
                  lg:grid-cols-[180px_1fr]
                  lg:gap-8
                "
              >

                {/* IMAGE */}

                <div className="relative aspect-[3/4] overflow-hidden bg-[#eee9e3]">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="
                      (max-width: 640px) 95px,
                      (max-width: 1024px) 140px,
                      180px
                    "
                    className="object-cover"
                  />

                </div>


                {/* PRODUCT INFO */}

                <div className="flex min-w-0 justify-between gap-3 sm:gap-6 lg:gap-8">

                  <div className="min-w-0">

                    <p className="text-[8px] tracking-[0.2em] text-gray-400 sm:text-xs">
                      LUMÉRA
                    </p>

                    <h2 className="mt-2 truncate font-serif text-lg sm:mt-3 sm:text-2xl">
                      {item.name}
                    </h2>


                    {/* SIZE */}

                    <p className="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-sm">
                      Size: {item.size}
                    </p>


                    {/* STOCK */}

                    {item.stock !== undefined && (
                      <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                        {item.stock} available
                      </p>
                    )}


                    {/* QUANTITY */}

                    <div className="mt-5 flex h-10 w-[112px] items-center justify-between border border-black/20 px-3 sm:mt-6 sm:h-11 sm:w-32 sm:px-4">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        className="
                          h-8
                          w-7
                          text-base
                          disabled:cursor-not-allowed
                          disabled:text-gray-300
                          sm:w-8
                        "
                      >
                        −
                      </button>

                      <span className="text-xs sm:text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        disabled={
                          item.stock !== undefined &&
                          item.quantity >=
                            item.stock
                        }
                        className="
                          h-8
                          w-7
                          text-base
                          disabled:cursor-not-allowed
                          disabled:text-gray-300
                          sm:w-8
                        "
                      >
                        +
                      </button>

                    </div>


                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id,
                          item.size
                        )
                      }
                      className="
                        mt-4
                        text-[9px]
                        text-gray-500
                        underline
                        underline-offset-4
                        transition
                        hover:text-black
                        sm:mt-5
                        sm:text-xs
                      "
                    >
                      REMOVE
                    </button>

                  </div>


                  {/* PRICE */}

                  <p className="shrink-0 text-[10px] sm:text-sm">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                </div>

              </div>

            ))}

          </div>


          {/* ========================================
              ORDER SUMMARY
          ======================================== */}

          <div className="lg:sticky lg:top-10 lg:self-start">

            <div className="bg-white p-5 sm:p-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                ORDER SUMMARY
              </h2>


              {/* SUBTOTAL */}

              <div className="mt-6 flex justify-between gap-4 border-b border-black/10 pb-5 text-xs sm:mt-8 sm:pb-6 sm:text-sm">

                <span>
                  Subtotal
                </span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>

              </div>


              {/* SHIPPING */}

              <div className="flex justify-between gap-4 border-b border-black/10 py-5 text-xs sm:py-6 sm:text-sm">

                <span>
                  Shipping
                </span>

                <span className="text-right text-gray-500">
                  Calculated at checkout
                </span>

              </div>


              {/* TOTAL */}

              <div className="flex justify-between gap-4 py-6 sm:py-7">

                <span className="text-sm font-medium">
                  TOTAL
                </span>

                <span className="text-sm font-medium">
                  ${subtotal.toFixed(2)} USD
                </span>

              </div>


              {/* CHECKOUT */}

              <Link
                href="/checkout"
                className="
                  block
                  w-full
                  bg-black
                  py-4
                  text-center
                  text-[10px]
                  tracking-[0.25em]
                  text-white
                  transition
                  hover:bg-neutral-800
                  sm:py-5
                  sm:text-xs
                "
              >
                CHECKOUT
              </Link>


              {/* CONTINUE SHOPPING */}

              <Link
                href="/dresses"
                className="
                  mt-4
                  block
                  text-center
                  text-[10px]
                  underline
                  underline-offset-4
                  sm:mt-5
                  sm:text-xs
                "
              >
                CONTINUE SHOPPING
              </Link>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}