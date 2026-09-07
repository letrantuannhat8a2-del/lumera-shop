"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_1: string | null;
  image_2: string | null;
  category: string | null;
};

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [products, setProducts] =
    useState<Product[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [focused, setFocused] =
    useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // LIVE SEARCH
  // =====================================================

  useEffect(() => {
    const search = query.trim();

    if (!search) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);

          const response =
            await fetch(
              `/api/search?q=${encodeURIComponent(
                search
              )}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Search request failed."
            );
          }

          const data =
            await response.json();

          if (!cancelled) {
            setProducts(
              Array.isArray(data)
                ? data
                : []
            );
          }
        } catch (error) {
          console.error(
            "Live search error:",
            error
          );

          if (!cancelled) {
            setProducts([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      180
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // =====================================================
  // ENTER
  // =====================================================

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const search =
      query.trim();

    if (!search) {
      return;
    }

    window.location.href =
      `/search?q=${encodeURIComponent(
        search
      )}`;
  }

  const showResults =
    focused &&
    query.trim().length > 0;

  return (
    <div className="relative mx-auto w-full max-w-[760px]">

      {/* =================================================
          SEARCH FORM
      ================================================= */}

      <form
        action="/search"
        method="GET"
        onSubmit={handleSubmit}
        className="flex border-b border-[#201b1b]/40"
      >

        {/* SEARCH INPUT */}

        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() => {
            setTimeout(
              () =>
                setFocused(false),
              150
            );
          }}
          placeholder="Search products..."
          autoComplete="off"
          className="
            min-w-0
            flex-1
            bg-transparent
            px-1
            py-4
            text-sm
            outline-none
            placeholder:text-[#aaa0a0]
          "
        />

        {/* SEARCH BUTTON */}

        <button
          type="submit"
          className="
            flex
            items-center
            gap-2
            px-2
            text-[8px]
            tracking-[0.2em]
            transition
            hover:text-[#a77d7f]
          "
        >

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path d="m20 20-4-4" />
          </svg>

          SEARCH

        </button>

      </form>


      {/* =================================================
          LIVE RESULTS
      ================================================= */}

      {showResults && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-3
            overflow-hidden
            border
            border-black/10
            bg-[#fcfaf7]
            shadow-[0_15px_45px_rgba(0,0,0,0.08)]
          "
        >

          {/* LOADING */}

          {loading && (
            <div className="px-6 py-6 text-center">

              <p className="text-[8px] tracking-[0.25em] text-[#8a7979]">
                SEARCHING...
              </p>

            </div>
          )}


          {/* RESULTS */}

          {!loading &&
            products.length > 0 && (
              <div className="max-h-[520px] overflow-y-auto">

                {products
                  .slice(0, 6)
                  .map((product) => {

                    const image =
                      product.image_1 ||
                      product.image_2;

                    return (
                      <Link
                        key={
                          product.id
                        }
                        href={`/shop/${product.slug}`}
                        onClick={() =>
                          setFocused(
                            false
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-4
                          border-b
                          border-black/10
                          px-5
                          py-4
                          transition
                          last:border-b-0
                          hover:bg-[#f5f0ec]
                        "
                      >

                        {/* IMAGE */}

                        <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#f4eeea]">

                          {image ? (
                            <Image
                              src={image}
                              alt={
                                product.name
                              }
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-[6px] tracking-[0.1em] text-gray-400">
                                NO IMAGE
                              </span>
                            </div>
                          )}

                        </div>


                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[9px] tracking-[0.1em]">
                            {
                              product.name
                            }
                          </p>

                          {product.category && (
                            <p className="mt-1 text-[7px] tracking-[0.14em] text-[#a77d7f]">
                              {
                                product.category
                              }
                            </p>
                          )}

                          <p className="mt-2 text-[9px]">
                            $
                            {Number(
                              product.price
                            ).toFixed(2)}
                          </p>

                        </div>


                        {/* ARROW */}

                        <span className="text-[14px] text-[#9a8888]">
                          →
                        </span>

                      </Link>
                    );
                  })}


                {/* MORE */}

                {products.length >
                  6 && (
                  <button
                    type="submit"
                    formNoValidate
                    onMouseDown={(
                      event
                    ) => {
                      event.preventDefault();

                      const search =
                        query.trim();

                      if (!search) {
                        return;
                      }

                      window.location.href =
                        `/search?q=${encodeURIComponent(
                          search
                        )}`;
                    }}
                    className="
                      block
                      w-full
                      border-t
                      border-black/10
                      px-5
                      py-4
                      text-center
                      text-[8px]
                      tracking-[0.2em]
                      transition
                      hover:bg-black
                      hover:text-white
                    "
                  >
                    VIEW ALL RESULTS
                  </button>
                )}

              </div>
            )}


          {/* NO RESULTS */}

          {!loading &&
            products.length === 0 && (
              <div className="px-6 py-8 text-center">

                <p className="font-serif text-xl">
                  No results
                </p>

                <p className="mt-2 text-[8px] tracking-[0.12em] text-[#8a7979]">
                  No products found
                </p>

              </div>
            )}

        </div>
      )}

    </div>
  );
}