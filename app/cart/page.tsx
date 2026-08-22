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
      <section className="px-12 pb-12 pt-16">

        <p className="text-xs tracking-[0.3em] text-gray-400">
          YOUR SELECTION
        </p>

        <h1 className="mt-4 font-serif text-6xl">
          Shopping Bag
        </h1>

      </section>

      {cart.length === 0 ? (

        /* EMPTY BAG */
        <section className="px-12 pb-32">

          <div className="border-t border-black/10 py-20 text-center">

            <p className="text-lg">
              Your bag is currently empty.
            </p>

            <Link
              href="/dresses"
              className="mt-8 inline-block bg-black px-10 py-4 text-xs tracking-[0.2em] text-white"
            >
              SHOP DRESSES
            </Link>

          </div>

        </section>

      ) : (

        /* BAG CONTENT */
        <section className="grid grid-cols-1 gap-16 px-12 pb-28 lg:grid-cols-[1.5fr_0.7fr]">

          {/* PRODUCTS */}
          <div className="border-t border-black/10">

            {cart.map((item) => (

              <div
                key={`${item.id}-${item.size}`}
                className="grid grid-cols-[180px_1fr] gap-8 border-b border-black/10 py-8"
              >

                {/* IMAGE */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#eee9e3]">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />

                </div>

                {/* PRODUCT INFO */}
                <div className="flex justify-between gap-8">

                  <div>

                    <p className="text-xs tracking-[0.2em] text-gray-400">
                      LUMÉRA
                    </p>

                    <h2 className="mt-3 font-serif text-2xl">
                      {item.name}
                    </h2>

                    <p className="mt-4 text-sm text-gray-500">
                      Size: {item.size}
                      {item.stock !== undefined && (
  <p className="mt-1 text-xs text-gray-400">
    {item.stock} available
  </p>
)}
                    </p>

                    {/* QUANTITY */}
                    <div className="mt-6 flex h-11 w-32 items-center justify-between border border-black/20 px-4">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                      >
                        −
                      </button>

                      <span>
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
    item.quantity >= item.stock
  }
  className="h-8 w-8 disabled:cursor-not-allowed disabled:text-gray-300"
>
  +
</button>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id,
                          item.size
                        )
                      }
                      className="mt-5 text-xs text-gray-500 underline underline-offset-4"
                    >
                      REMOVE
                    </button>

                  </div>

                  {/* PRICE */}
                  <p className="text-sm">
                    ${(
  item.price * item.quantity
).toFixed(2)}
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:sticky lg:top-10 lg:self-start">

            <div className="bg-white p-8">

              <h2 className="text-sm tracking-[0.2em]">
                ORDER SUMMARY
              </h2>

              <div className="mt-8 flex justify-between border-b border-black/10 pb-6 text-sm">

                <span>
                  Subtotal
                </span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between border-b border-black/10 py-6 text-sm">

                <span>
                  Shipping
                </span>

                <span>
                  Calculated at checkout
                </span>

              </div>

              <div className="flex justify-between py-7">

                <span className="font-medium">
                  TOTAL
                </span>

                <span className="font-medium">
                  ${subtotal.toFixed(2)} USD
                </span>

              </div>

              <Link
  href="/checkout"
  className="block w-full bg-black py-5 text-center text-xs tracking-[0.25em] text-white transition hover:bg-neutral-800"
>
  CHECKOUT
</Link>

              <Link
                href="/dresses"
                className="mt-5 block text-center text-xs underline underline-offset-4"
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