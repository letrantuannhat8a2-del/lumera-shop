"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";

import { useCart } from "../context/CartContext";
import { createClient } from "../lib/supabase/client";

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image_1: string | null;
};

export default function Header({
  active,
}: {
  active?: "dresses";
}) {
  const { cartCount } = useCart();

  const [user, setUser] = useState<any>(null);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState<SearchProduct[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const searchRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /* ==================================================
     AUTH
  ================================================== */

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event: AuthChangeEvent,
          session: Session | null
        ) => {
          setUser(
            session?.user ?? null
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ==================================================
     SEARCH FOCUS
  ================================================== */

  useEffect(() => {
    if (!searchOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => {
      clearTimeout(timer);
    };
  }, [searchOpen]);

  /* ==================================================
     CLOSE SEARCH
  ================================================== */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setSearchOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* ==================================================
     SEARCH PRODUCTS
  ================================================== */

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setResults([]);
      setSearchLoading(false);
      return;
    }

    const timeout = setTimeout(
      async () => {
        try {
          setSearchLoading(true);

          const response =
            await fetch(
              `/api/search?q=${encodeURIComponent(
                query
              )}`
            );

          if (!response.ok) {
            setResults([]);
            return;
          }

          const data =
            await response.json();

          setResults(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (error) {
          console.error(
            "Search failed:",
            error
          );

          setResults([]);
        } finally {
          setSearchLoading(false);
        }
      },
      300
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  /* ==================================================
     SIGN OUT
  ================================================== */

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setUser(null);
    setAccountOpen(false);
    setMobileMenuOpen(false);

    window.location.href = "/";
  }

  /* ==================================================
     SEARCH
  ================================================== */

  function openSearch() {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearch("");
    setResults([]);
  }

  /* ==================================================
     MOBILE MENU
  ================================================== */

  function toggleMobileMenu() {
    setSearchOpen(false);
    setAccountOpen(false);

    setMobileMenuOpen(
      (current) => !current
    );
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  /* ==================================================
     DISPLAY NAME
  ================================================== */

  const displayName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest";

  /* ==================================================
     PRICE
  ================================================== */

  function formatPrice(
    price: number,
    currency: string
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          currency || "USD",
      }
    ).format(Number(price));
  }

  return (
    <header
      className="
        relative
        z-[9999]
        w-full
        border-b
        border-black/10
        bg-white
      "
    >
      {/* ==================================================
          MAIN HEADER
      ================================================== */}

      <div
        className="
          relative
          z-[10000]
          grid
          h-20
          w-full
          grid-cols-[auto_1fr_auto]
          items-center
          px-4
          sm:px-6
          md:flex
          md:h-24
          md:px-12
        "
      >
        {/* ==================================================
            MOBILE HAMBURGER
        ================================================== */}

        <button
          type="button"
          onClick={
            toggleMobileMenu
          }
          aria-label={
            mobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            mobileMenuOpen
          }
          className="
            relative
            z-[10002]
            flex
            h-11
            w-11
            shrink-0
            cursor-pointer
            touch-manipulation
            select-none
            items-center
            justify-start
            md:hidden
          "
        >
          <div
            className="
              pointer-events-none
              flex
              w-5
              flex-col
              gap-[5px]
            "
          >
            <span
              className={`
                block
                h-px
                w-5
                bg-black
                transition-transform
                duration-300
                ${
                  mobileMenuOpen
                    ? "translate-y-[3px] rotate-45"
                    : ""
                }
              `}
            />

            <span
              className={`
                block
                h-px
                w-5
                bg-black
                transition-transform
                duration-300
                ${
                  mobileMenuOpen
                    ? "-translate-y-[3px] -rotate-45"
                    : ""
                }
              `}
            />
          </div>
        </button>

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          href="/"
          onClick={
            closeMobileMenu
          }
          className="
            relative
            z-[10002]
            justify-self-center
            whitespace-nowrap
            font-serif
            text-2xl
            tracking-[0.25em]
            sm:text-3xl
            md:static
            md:mr-auto
            md:justify-self-auto
            md:text-4xl
          "
        >
          LUMÉRA
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="
            ml-16
            hidden
            items-center
            gap-10
            text-sm
            md:flex
          "
        >
          <Link
            href="/"
            className="
              transition
              hover:opacity-60
            "
          >
            New Arrivals
          </Link>

          <Link
            href="/dresses"
            className={`
              transition
              hover:opacity-60
              ${
                active === "dresses"
                  ? "border-b border-black pb-1"
                  : ""
              }
            `}
          >
            Dresses
          </Link>

          <Link
            href="/collections"
            className="
              transition
              hover:opacity-60
            "
          >
            Collections
          </Link>

          <Link
            href="/sale"
            className="
              transition
              hover:opacity-60
            "
          >
            Sale
          </Link>
        </nav>

        {/* ==================================================
            DESKTOP ACTIONS
        ================================================== */}

        <div
          className="
            ml-auto
            hidden
            items-center
            gap-5
            md:flex
          "
        >
          {/* SEARCH */}

          <button
            type="button"
            onClick={
              openSearch
            }
            aria-label="Search"
            className="
              transition
              hover:opacity-50
            "
          >
            <SearchIcon />
          </button>

          {/* WISHLIST */}

          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="
              transition
              hover:opacity-50
            "
          >
            <HeartIcon />
          </Link>

          {/* ACCOUNT */}

          <div
            className="
              relative
            "
          >
            {!user ? (
              <Link
                href="/account/login"
                aria-label="Account"
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  transition
                  hover:opacity-50
                "
              >
                <UserIcon />

                <span
                  className="
                    hidden
                    lg:inline
                  "
                >
                  Account
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    (current) =>
                      !current
                  )
                }
                aria-label="Account"
                aria-expanded={
                  accountOpen
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  transition
                  hover:opacity-50
                "
              >
                <UserIcon />

                <span
                  className="
                    hidden
                    lg:inline
                  "
                >
                  Account
                </span>
              </button>
            )}

            {/* ACCOUNT DROPDOWN */}

            {user &&
              accountOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-[100]
                    w-72
                    border
                    border-black/10
                    bg-white
                    shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                  "
                >
                  <div
                    className="
                      border-b
                      border-black/10
                      px-6
                      py-6
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        tracking-[0.3em]
                        text-black/40
                      "
                    >
                      WELCOME BACK
                    </p>

                    <p
                      className="
                        mt-2
                        font-serif
                        text-xl
                      "
                    >
                      {displayName}
                    </p>

                    {user.email && (
                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-black/40
                        "
                      >
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div
                    className="
                      px-6
                      py-4
                    "
                  >
                    <Link
                      href="/account"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="
                        block
                        border-b
                        border-black/5
                        py-4
                        text-[10px]
                        tracking-[0.2em]
                        transition
                        hover:pl-1
                        hover:opacity-50
                      "
                    >
                      MY ACCOUNT
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="
                        block
                        border-b
                        border-black/5
                        py-4
                        text-[10px]
                        tracking-[0.2em]
                        transition
                        hover:pl-1
                        hover:opacity-50
                      "
                    >
                      MY ORDERS
                    </Link>

                    <Link
                      href="/account/details"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="
                        block
                        py-4
                        text-[10px]
                        tracking-[0.2em]
                        transition
                        hover:pl-1
                        hover:opacity-50
                      "
                    >
                      ACCOUNT DETAILS
                    </Link>
                  </div>

                  <div
                    className="
                      border-t
                      border-black/10
                      px-6
                      py-5
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleSignOut
                      }
                      className="
                        text-[10px]
                        tracking-[0.2em]
                        text-black/50
                        transition
                        hover:text-black
                      "
                    >
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* BAG */}

          <Link
            href="/cart"
            className="
              text-sm
              transition
              hover:opacity-60
            "
          >
            Bag ({cartCount})
          </Link>
        </div>

        {/* ==================================================
            MOBILE ACTIONS
        ================================================== */}

        <div
          className="
            relative
            z-[10002]
            flex
            items-center
            justify-end
            gap-1
            md:hidden
          "
        >
          {/* SEARCH */}

          <button
            type="button"
            onClick={
              openSearch
            }
            aria-label="Search"
            className="
              flex
              h-10
              w-9
              cursor-pointer
              touch-manipulation
              items-center
              justify-center
            "
          >
            <SearchIcon
              size={18}
            />
          </button>

          {/* WISHLIST */}

          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="
              flex
              h-10
              w-9
              items-center
              justify-center
            "
          >
            <HeartIcon
              size={18}
            />
          </Link>

          {/* ACCOUNT */}

          <Link
            href={
              user
                ? "/account"
                : "/account/login"
            }
            aria-label="Account"
            className="
              flex
              h-10
              w-9
              items-center
              justify-center
            "
          >
            <UserIcon
              size={18}
            />
          </Link>

          {/* BAG */}

          <Link
            href="/cart"
            className="
              whitespace-nowrap
              px-1
              text-[10px]
              tracking-[0.05em]
              sm:text-[11px]
            "
          >
            Bag ({cartCount})
          </Link>
        </div>
      </div>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      <div
        className={`
          relative
          z-[9999]
          overflow-hidden
          border-t
          border-black/10
          bg-white
          transition-[max-height,opacity]
          duration-300
          md:hidden
          ${
            mobileMenuOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 border-t-0 opacity-0"
          }
        `}
      >
        <div
          className="
            px-5
            py-6
          "
        >
          <nav
            className="
              flex
              flex-col
            "
          >
            <Link
              href="/"
              onClick={
                closeMobileMenu
              }
              className="
                border-b
                border-black/10
                py-4
                font-serif
                text-2xl
              "
            >
              New Arrivals
            </Link>

            <Link
              href="/dresses"
              onClick={
                closeMobileMenu
              }
              className={`
                border-b
                border-black/10
                py-4
                font-serif
                text-2xl
                ${
                  active === "dresses"
                    ? "opacity-50"
                    : ""
                }
              `}
            >
              Dresses
            </Link>

            <Link
              href="/collections"
              onClick={
                closeMobileMenu
              }
              className="
                border-b
                border-black/10
                py-4
                font-serif
                text-2xl
              "
            >
              Collections
            </Link>

            <Link
              href="/sale"
              onClick={
                closeMobileMenu
              }
              className="
                border-b
                border-black/10
                py-4
                font-serif
                text-2xl
              "
            >
              Sale
            </Link>
          </nav>

          {/* MOBILE TOOLS */}

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-x-5
            "
          >
            <button
              type="button"
              onClick={
                openSearch
              }
              className="
                flex
                items-center
                gap-3
                py-4
                text-left
                text-[10px]
                tracking-[0.2em]
              "
            >
              <SearchIcon
                size={17}
              />
              SEARCH
            </button>

            <Link
              href="/account/wishlist"
              onClick={
                closeMobileMenu
              }
              className="
                flex
                items-center
                gap-3
                py-4
                text-[10px]
                tracking-[0.2em]
              "
            >
              <HeartIcon
                size={17}
              />
              WISHLIST
            </Link>

            <Link
              href={
                user
                  ? "/account"
                  : "/account/login"
              }
              onClick={
                closeMobileMenu
              }
              className="
                flex
                items-center
                gap-3
                py-4
                text-[10px]
                tracking-[0.2em]
              "
            >
              <UserIcon
                size={17}
              />

              {user
                ? "MY ACCOUNT"
                : "ACCOUNT"}
            </Link>

            {user && (
              <Link
                href="/account/orders"
                onClick={
                  closeMobileMenu
                }
                className="
                  flex
                  items-center
                  gap-3
                  py-4
                  text-[10px]
                  tracking-[0.2em]
                "
              >
                <span
                  className="
                    text-[15px]
                  "
                >
                  #
                </span>

                MY ORDERS
              </Link>
            )}
          </div>

          {/* SIGNED IN */}

          {user && (
            <div
              className="
                mt-5
                border-t
                border-black/10
                pt-5
              "
            >
              <p
                className="
                  text-[9px]
                  tracking-[0.25em]
                  text-black/40
                "
              >
                SIGNED IN AS
              </p>

              <p
                className="
                  mt-2
                  truncate
                  font-serif
                  text-lg
                "
              >
                {displayName}
              </p>

              <button
                type="button"
                onClick={
                  handleSignOut
                }
                className="
                  mt-4
                  text-[10px]
                  tracking-[0.2em]
                  text-black/50
                "
              >
                SIGN OUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          SEARCH PANEL
      ================================================== */}

      {searchOpen && (
        <div
          ref={searchRef}
          className="
            absolute
            left-0
            right-0
            top-20
            z-[10000]
            border-t
            border-black/10
            bg-white
            shadow-[0_20px_40px_rgba(0,0,0,0.06)]
            md:top-24
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-6
              md:px-12
              md:py-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-black
                pb-4
              "
            >
              <SearchIcon
                size={20}
              />

              <input
                ref={inputRef}
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search dresses..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-base
                  outline-none
                  placeholder:text-black/30
                  md:text-lg
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    shrink-0
                    text-[9px]
                    tracking-[0.2em]
                    text-black/40
                    hover:text-black
                  "
                >
                  CLEAR
                </button>
              )}

              <button
                type="button"
                onClick={
                  closeSearch
                }
                className="
                  shrink-0
                  text-[9px]
                  tracking-[0.2em]
                  text-black/40
                  hover:text-black
                "
              >
                CLOSE
              </button>
            </div>

            {/* EMPTY SEARCH */}

            {!search.trim() ? (
              <div
                className="
                  py-10
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    tracking-[0.35em]
                    text-black/30
                  "
                >
                  SEARCH LUMÉRA
                </p>

                <p
                  className="
                    mt-3
                    font-serif
                    text-2xl
                  "
                >
                  Find your perfect dress
                </p>
              </div>
            ) : searchLoading ? (
              /* SEARCHING */

              <div
                className="
                  py-10
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    tracking-[0.3em]
                    text-black/40
                  "
                >
                  SEARCHING...
                </p>
              </div>
            ) : results.length === 0 ? (
              /* NO RESULTS */

              <div
                className="
                  py-10
                  text-center
                "
              >
                <p
                  className="
                    font-serif
                    text-2xl
                  "
                >
                  No results found
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    text-black/40
                  "
                >
                  Try another dress name.
                </p>
              </div>
            ) : (
              /* RESULTS */

              <div
                className="
                  py-7
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      text-[9px]
                      tracking-[0.3em]
                      text-black/40
                    "
                  >
                    SEARCH RESULTS
                  </p>

                  <p
                    className="
                      text-xs
                      text-black/40
                    "
                  >
                    {results.length}{" "}
                    {results.length === 1
                      ? "result"
                      : "results"}
                  </p>
                </div>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-x-3
                    gap-y-7
                    sm:grid-cols-3
                    md:grid-cols-4
                    md:gap-5
                  "
                >
                  {results.map(
                    (product) => (
                      <Link
                        key={
                          product.id
                        }
                        href={`/dresses/${product.slug}`}
                        onClick={
                          closeSearch
                        }
                        className="
                          group
                          min-w-0
                        "
                      >
                        <div
                          className="
                            relative
                            aspect-[3/4]
                            overflow-hidden
                            bg-[#eee9e3]
                          "
                        >
                          {product.image_1 ? (
                            <Image
                              src={
                                product.image_1
                              }
                              alt={
                                product.name
                              }
                              fill
                              sizes="
                                (max-width: 640px) 50vw,
                                (max-width: 1024px) 33vw,
                                25vw
                              "
                              className="
                                object-cover
                                transition
                                duration-500
                                group-hover:scale-[1.03]
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                              "
                            >
                              <p
                                className="
                                  text-[8px]
                                  tracking-[0.2em]
                                  text-black/30
                                "
                              >
                                LUMÉRA
                              </p>
                            </div>
                          )}
                        </div>

                        <div
                          className="
                            mt-3
                            min-w-0
                          "
                        >
                          <p
                            className="
                              truncate
                              font-serif
                              text-base
                              md:text-lg
                            "
                          >
                            {product.name}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-black/50
                            "
                          >
                            {formatPrice(
                              product.price,
                              product.currency
                            )}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ==================================================
   SEARCH ICON
================================================== */

function SearchIcon({
  size = 19,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path
        d="m16 16 5 5"
      />
    </svg>
  );
}

/* ==================================================
   HEART ICON
================================================== */

function HeartIcon({
  size = 19,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="
          M20.8 8.8
          c0 5.2-8.8 10.2-8.8 10.2
          S3.2 14 3.2 8.8
          A4.8 4.8 0 0 1 12 6.1
          a4.8 4.8 0 0 1 8.8 2.7Z
        "
      />
    </svg>
  );
}

/* ==================================================
   USER ICON
================================================== */

function UserIcon({
  size = 19,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path
        d="
          M5 21
          c0-3.5 3-6 7-6
          s7 2.5 7 6
        "
      />
    </svg>
  );
}