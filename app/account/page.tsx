import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../lib/supabase/sever";
import SignOutButton from "./SignOutButton";
export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ========================================
  // REQUIRE LOGIN
  // ========================================

  if (!user) {
    redirect("/account/login");
  }

  // ========================================
  // USER INFORMATION
  // ========================================

  const firstName =
    user.user_metadata?.first_name || "";

  const lastName =
    user.user_metadata?.last_name || "";

  const fullName =
    user.user_metadata?.full_name || "";

  const userName =
    [firstName, lastName]
      .filter(Boolean)
      .join(" ") ||
    fullName ||
    user.email?.split("@")[0] ||
    "Customer";

  const email =
    user.email ?? "";

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-[#211d1d]/10 bg-[#fcf8f6]">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

          {/* LOGO */}

          <Link
            href="/"
            className="
              shrink-0
              font-serif
              text-2xl
              tracking-[0.2em]
              sm:text-3xl
              sm:tracking-[0.25em]
            "
          >
            VIREL
          </Link>


          {/* NAVIGATION */}

          <div className="flex items-center gap-4 sm:gap-8">

            <Link
              href="/shop"
              className="
                text-[8px]
                tracking-[0.16em]
                text-[#211d1d]/50
                transition
                hover:text-[#211d1d]
                sm:text-[10px]
                sm:tracking-[0.2em]
              "
            >
              CONTINUE SHOPPING
            </Link>

          </div>

        </div>

      </header>


      {/* ========================================
          ACCOUNT CONTENT
      ======================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 md:px-10 md:py-24">

        {/* ====================================
            ACCOUNT INTRO
        ==================================== */}

        <div className="max-w-2xl">

          <p className="text-[8px] tracking-[0.35em] text-[#a88989] sm:text-[9px] sm:tracking-[0.4em]">
            VIREL · MY ACCOUNT
          </p>

          <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl md:text-6xl">
            Welcome back
          </h1>

          <p className="mt-4 font-serif text-lg sm:mt-5 sm:text-xl">
            {userName}
          </p>

          <p className="mt-1.5 break-all text-xs text-[#756b6b] sm:mt-2 sm:text-sm">
            {email}
          </p>

        </div>


        {/* ========================================
            ACCOUNT MENU
        ======================================== */}

        <div className="mt-12 border-t border-[#211d1d]/10 sm:mt-16">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">


            {/* ====================================
                01 — ORDERS
            ==================================== */}

            <Link
              href="/account/orders"
              className="
                group
                relative
                min-h-[300px]
                border-b
                border-[#211d1d]/10
                p-7
                transition
                hover:bg-white
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
                lg:border-r
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
                  01 / ORDERS
                </p>

                <span
                  className="
                    text-lg
                    font-light
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  My Orders
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[#756b6b]">
                  View your purchases, order status,
                  delivery progress and complete order details.
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-[#211d1d] pb-1 text-[9px] tracking-[0.25em]">
                  VIEW ORDERS
                </span>

              </div>

            </Link>


            {/* ====================================
                02 — PROFILE
            ==================================== */}

            <Link
              href="/account/profile"
              className="
                group
                relative
                min-h-[300px]
                border-b
                border-[#211d1d]/10
                p-7
                transition
                hover:bg-white
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
                lg:border-r
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
                  02 / PROFILE
                </p>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  Account Details
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[#756b6b]">
                  Manage your personal information,
                  email address and password.
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-[#211d1d] pb-1 text-[9px] tracking-[0.25em]">
                  MANAGE PROFILE
                </span>

              </div>

            </Link>


            {/* ====================================
                03 — ADDRESSES
            ==================================== */}

            <Link
              href="/account/addresses"
              className="
                group
                relative
                min-h-[300px]
                border-b
                border-[#211d1d]/10
                p-7
                transition
                hover:bg-white
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
                  03 / DELIVERY
                </p>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  Addresses
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[#756b6b]">
                  Save and manage your delivery addresses
                  for a faster checkout experience.
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-[#211d1d] pb-1 text-[9px] tracking-[0.25em]">
                  MANAGE ADDRESSES
                </span>

              </div>

            </Link>


            {/* ====================================
                04 — WISHLIST
            ==================================== */}

            <Link
              href="/account/wishlist"
              className="
                group
                relative
                min-h-[300px]
                border-b
                border-[#211d1d]/10
                p-7
                transition
                hover:bg-white
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
                lg:border-r
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
                  04 / SAVED ITEMS
                </p>

                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  ♡
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  Wishlist
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[#756b6b]">
                  Keep your favorite VIREL pieces saved
                  for your next occasion.
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-[#211d1d] pb-1 text-[9px] tracking-[0.25em]">
                  VIEW WISHLIST
                </span>

              </div>

            </Link>


            {/* ====================================
                05 — SUPPORT
            ==================================== */}

            <Link
              href="/account/support"
              className="
                group
                relative
                min-h-[300px]
                border-b
                border-[#211d1d]/10
                p-7
                transition
                hover:bg-white
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
                lg:border-r
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
                  05 / SUPPORT
                </p>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  Need Help?
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[#756b6b]">
                  Questions about your order, delivery,
                  returns or your VIREL experience?
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-[#211d1d] pb-1 text-[9px] tracking-[0.25em]">
                  CONTACT SUPPORT
                </span>

              </div>

            </Link>


            {/* ====================================
                06 — SHOPPING
            ==================================== */}

            <Link
              href="/shop"
              className="
                group
                relative
                min-h-[300px]
                bg-[#211d1d]
                p-7
                text-white
                transition
                hover:bg-[#302828]
                sm:min-h-[320px]
                sm:p-9
                lg:min-h-[340px]
              "
            >

              <div className="flex items-start justify-between">

                <p className="text-[9px] tracking-[0.35em] text-white/50">
                  06 / VIREL
                </p>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>


              <div className="mt-20 sm:mt-24">

                <h2 className="font-serif text-3xl sm:text-4xl">
                  Continue Shopping
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
                  Discover elegant silhouettes,
                  refined bridal shoes and the latest VIREL collection.
                </p>

              </div>


              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">

                <span className="border-b border-white pb-1 text-[9px] tracking-[0.25em]">
                  SHOP COLLECTION
                </span>

              </div>

            </Link>

          </div>

        </div>

{/* ========================================
    SIGN OUT
======================================== */}

<div className="mt-8 max-w-md sm:mt-10">
  <SignOutButton />
</div>
        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="mt-12 border-t border-[#211d1d]/10 pt-6 sm:mt-16 sm:pt-8">

          <p className="text-[8px] tracking-[0.22em] text-[#a88989] sm:text-[9px] sm:tracking-[0.25em]">
            VIREL CUSTOMER ACCOUNT
          </p>

          <p className="mt-2 max-w-xl text-xs leading-6 text-[#8d8080] sm:mt-3 sm:text-sm">
            Thank you for being part of VIREL.
            Your account gives you access to your orders,
            personal information and saved items.
          </p>

        </div>

      </section>

    </main>
  );
}