"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
export default function Header({
  active,
}: {
  active?: "dresses";
}) {
  const { cartCount } = useCart();

  return (
    <header className="flex h-24 items-center justify-between border-b border-black/10 bg-white px-12">

      {/* LOGO */}
      <Link
        href="/"
        className="font-serif text-4xl tracking-[0.2em]"
      >
        LUMÉRA
      </Link>

      {/* NAVIGATION */}
      <nav className="flex gap-10 text-sm">

        <Link
          href="/"
          className="transition hover:opacity-60"
        >
          New Arrivals
        </Link>

        <Link
          href="/dresses"
          className={`transition hover:opacity-60 ${
            active === "dresses"
              ? "border-b border-black pb-1"
              : ""
          }`}
        >
          Dresses
        </Link>

        <a
          href="#"
          className="transition hover:opacity-60"
        >
          Collections
        </a>

        <a
          href="#"
          className="transition hover:opacity-60"
        >
          Sale
        </a>

      </nav>

      {/* ACTIONS */}
      <div className="flex items-center gap-5">

        <button className="text-xl">
          ⌕
        </button>

        <button className="text-xl">
          ♡
        </button>

        <button className="text-lg">
          ♙
        </button>

        <Link
          href="/cart"
          className="text-sm"
        >
          Bag ({cartCount})
        </Link>

      </div>

    </header>
  );
}