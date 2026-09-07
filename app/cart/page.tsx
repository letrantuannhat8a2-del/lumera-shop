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
    <main className="min-h-screen bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <Header active="shop" />


      {/* ========================================
          PAGE INTRO
      ======================================== */}

      <section className="border-b border-[#211d1d]/10 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-14 lg:pb-16 lg:pt-20">

        <p className="text-[9px] tracking-[0.35em] text-[#a88989] sm:text-[10px]">
          VIREL · YOUR SELECTION
        </p>

        <div className="mt-4 flex items-end justify-between gap-5">

          <h1 className="font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
            Shopping Bag
          </h1>

          <p className="hidden pb-1 text-[10px] tracking-[0.18em] text-[#8f8080] sm:block">
            {cart.length}{" "}
            {cart.length === 1
              ? "ITEM"
              : "ITEMS"}
          </p>

        </div>

      </section>


      {/* ========================================
          EMPTY BAG
      ======================================== */}

      {cart.length === 0 ? (

        <section className="px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-14 lg:px-14">

          <div className="mx-auto max-w-2xl border border-[#211d1d]/10 bg-white px-6 py-20 text-center sm:px-10 sm:py-28">

            <p className="text-[9px] tracking-[0.3em] text-[#a88989]">
              YOUR BAG
            </p>

            <h2 className="mt-4 font-serif text-2xl sm:text-3xl">
              Your bag is empty
            </h2>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#756b6b] sm:text-sm">
              Discover our latest collection
              of refined bridal shoes, heels
              and timeless silhouettes.
            </p>

            <Link
              href="/shop"
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                border
                border-[#211d1d]
                bg-[#211d1d]
                px-9
                py-4
                text-[9px]
                tracking-[0.25em]
                text-white
                transition
                duration-300
                hover:border-[#a88989]
                hover:bg-[#a88989]
                sm:px-11
                sm:py-5
              "
            >
              EXPLORE COLLECTION
            </Link>

          </div>

        </section>

      ) : (

        /* ========================================
           BAG CONTENT
        ======================================== */

        <section className="grid grid-cols-1 gap-10 px-5 pb-24 pt-8 sm:px-8 sm:pb-28 sm:pt-10 lg:grid-cols-[1.5fr_0.7fr] lg:gap-16 lg:px-14">

          {/* ========================================
              PRODUCTS
          ======================================== */}

          <div>

            <div className="mb-3 hidden grid-cols-[180px_1fr] gap-8 border-b border-[#211d1d]/10 pb-3 text-[9px] tracking-[0.2em] text-[#9a8d8d] sm:grid lg:grid-cols-[200px_1fr]">
              <span>PRODUCT</span>
              <span>DETAILS</span>
            </div>


            {cart.map((item) => (

              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="
                  grid
                  grid-cols-[105px_1fr]
                  gap-4
                  border-b
                  border-[#211d1d]/10
                  py-6
                  sm:grid-cols-[150px_1fr]
                  sm:gap-7
                  sm:py-8
                  lg:grid-cols-[200px_1fr]
                  lg:gap-8
                "
              >

                {/* ====================================
                    PRODUCT IMAGE
                ==================================== */}

                <Link
                  href={`/shop/${item.slug}`}
                  className="group block"
                >

                  <div className="relative aspect-[3/4] overflow-hidden bg-[#eee5e1]">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="
                        (max-width: 640px) 105px,
                        (max-width: 1024px) 150px,
                        200px
                      "
                      className="
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-[1.03]
                      "
                    />

                  </div>

                </Link>


                {/* ====================================
                    PRODUCT DETAILS
                ==================================== */}

                <div className="flex min-w-0 justify-between gap-4 sm:gap-8">

                  <div className="min-w-0">

                    <p className="text-[8px] tracking-[0.25em] text-[#a88989] sm:text-[9px]">
                      VIREL
                    </p>

                    <h2 className="mt-2 font-serif text-lg sm:mt-3 sm:text-2xl">
                      {item.name}
                    </h2>


                    {/* ==================================
                        COLOR
                    ================================== */}

                    <div className="mt-3 flex items-center gap-2 sm:mt-4">

                      <span
                        className="h-4 w-4 rounded-full border border-[#b8aaa5]"
                        style={{
                          backgroundColor:
                            item.color === "Ivory"
                              ? "#F3EEE8"
                              : item.color === "Black"
                                ? "#171515"
                                : item.color === "Red"
                                  ? "#8B1E2D"
                                  : item.color === "Brown"
                                    ? "#6B4535"
                                    : "#F3EEE8",
                        }}
                      />

                      <p className="text-[10px] tracking-[0.08em] text-[#756b6b] sm:text-xs">
                        COLOR · {item.color}
                      </p>

                    </div>


                    {/* ==================================
                        SIZE
                    ================================== */}

                    <p className="mt-2 text-[10px] tracking-[0.08em] text-[#756b6b] sm:text-xs">
                      SIZE · {item.size}
                    </p>


                    {/* ==================================
                        STOCK
                    ================================== */}

                    {item.stock !== undefined && (
                      <p className="mt-1 text-[9px] text-[#a89c9c] sm:text-[10px]">
                        {item.stock} available
                      </p>
                    )}


                    {/* ==================================
                        QUANTITY
                    ================================== */}

                    <div className="mt-5 flex h-10 w-[116px] items-center justify-between border border-[#211d1d]/20 bg-white sm:mt-6 sm:h-11 sm:w-32">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.color,
                            item.size
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        aria-label="Decrease quantity"
                        className="
                          h-full
                          w-9
                          text-base
                          transition
                          hover:bg-[#f7efed]
                          disabled:cursor-not-allowed
                          disabled:text-[#cfc5c5]
                        "
                      >
                        −
                      </button>

                      <span className="text-[11px] sm:text-xs">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.color,
                            item.size
                          )
                        }
                        disabled={
                          item.stock !== undefined &&
                          item.quantity >=
                            item.stock
                        }
                        aria-label="Increase quantity"
                        className="
                          h-full
                          w-9
                          text-base
                          transition
                          hover:bg-[#f7efed]
                          disabled:cursor-not-allowed
                          disabled:text-[#cfc5c5]
                        "
                      >
                        +
                      </button>

                    </div>


                    {/* ==================================
                        REMOVE
                    ================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id,
                          item.color,
                          item.size
                        )
                      }
                      className="
                        mt-4
                        text-[8px]
                        tracking-[0.18em]
                        text-[#8e8080]
                        underline
                        underline-offset-4
                        transition
                        hover:text-[#211d1d]
                        sm:mt-5
                        sm:text-[9px]
                      "
                    >
                      REMOVE
                    </button>

                  </div>


                  {/* ==================================
                      PRICE
                  ================================== */}

                  <div className="shrink-0 text-right">

                    <p className="text-[11px] sm:text-sm">
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    {item.quantity > 1 && (
                      <p className="mt-1 text-[8px] text-[#a89c9c] sm:text-[9px]">
                        $
                        {item.price.toFixed(
                          2
                        )}{" "}
                        each
                      </p>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* ========================================
              ORDER SUMMARY
          ======================================== */}

          <aside className="lg:sticky lg:top-8 lg:self-start">

            <div className="border border-[#211d1d]/10 bg-white">

              {/* SUMMARY HEADER */}

              <div className="border-b border-[#211d1d]/10 px-5 py-5 sm:px-7 sm:py-6">

                <p className="text-[9px] tracking-[0.28em] text-[#a88989]">
                  VIREL
                </p>

                <h2 className="mt-2 font-serif text-xl sm:text-2xl">
                  Order Summary
                </h2>

              </div>


              <div className="px-5 py-6 sm:px-7 sm:py-8">

                {/* SUBTOTAL */}

                <div className="flex justify-between gap-5 text-xs sm:text-sm">

                  <span className="text-[#756b6b]">
                    Subtotal
                  </span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>

                </div>


                {/* SHIPPING */}

                <div className="mt-5 flex justify-between gap-5 border-b border-[#211d1d]/10 pb-5 text-xs sm:mt-6 sm:pb-6 sm:text-sm">

                  <span className="text-[#756b6b]">
                    Shipping
                  </span>

                  <span className="text-right text-[10px] text-[#9a8d8d] sm:text-xs">
                    Calculated at checkout
                  </span>

                </div>


                {/* TOTAL */}

                <div className="flex justify-between gap-5 py-6 sm:py-7">

                  <span className="text-[10px] tracking-[0.18em] sm:text-xs">
                    TOTAL
                  </span>

                  <span className="font-medium text-sm sm:text-base">
                    ${subtotal.toFixed(2)} USD
                  </span>

                </div>


                {/* CHECKOUT */}

                <Link
                  href="/checkout"
                  className="
                    block
                    w-full
                    bg-[#211d1d]
                    py-4
                    text-center
                    text-[9px]
                    tracking-[0.27em]
                    text-white
                    transition
                    duration-300
                    hover:bg-[#a88989]
                    sm:py-5
                    sm:text-[10px]
                  "
                >
                  PROCEED TO CHECKOUT
                </Link>


                {/* CONTINUE SHOPPING */}

                <Link
                  href="/shop"
                  className="
                    mt-5
                    block
                    text-center
                    text-[9px]
                    tracking-[0.15em]
                    text-[#756b6b]
                    underline
                    underline-offset-4
                    transition
                    hover:text-[#211d1d]
                    sm:mt-6
                    sm:text-[10px]
                  "
                >
                  CONTINUE SHOPPING
                </Link>

              </div>

            </div>


            {/* ======================================
                SHIPPING MESSAGE
            ====================================== */}

            <div className="mt-4 border border-[#211d1d]/10 bg-[#f5e8e5] px-5 py-5 text-center sm:px-7">

              <p className="text-[8px] tracking-[0.2em] text-[#8d7171] sm:text-[9px]">
                COMPLIMENTARY SHIPPING
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#756b6b] sm:text-xs">
                Enjoy complimentary standard
                shipping on qualifying orders.
              </p>

            </div>

          </aside>

        </section>

      )}

    </main>
  );
}