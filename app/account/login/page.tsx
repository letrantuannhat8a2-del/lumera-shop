"use client";

import { useState } from "react";
import Link from "next/link";

import { createClient } from "../../lib/supabase/client";

export default function CustomerLoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const supabase =
        createClient();

      const {
        error: loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          }
        );

      // ========================================
      // LOGIN FAILED
      // ========================================

      if (loginError) {
        console.error(
          "LOGIN ERROR:",
          loginError
        );

        setError(
          "The email or password you entered is incorrect."
        );

        setLoading(false);
        return;
      }

      // ========================================
      // LOGIN SUCCESS
      // ========================================

      console.log(
        "LOGIN SUCCESS → HOME"
      );

      /*
       * Dùng full browser navigation thay vì
       * router.replace() để đảm bảo browser
       * đã chuyển sang request mới cùng session.
       *
       * Áp dụng giống nhau cho PC + mobile.
       */

      window.location.replace("/");

    } catch (err) {
      console.error(
        "LOGIN EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while signing in."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f6f2] text-black">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-black/10 bg-[#f8f6f2]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:h-24 sm:px-8 md:px-10">

          <Link
            href="/"
            className="
              shrink-0
              font-serif
              text-2xl
              tracking-[0.22em]
              sm:text-3xl
              sm:tracking-[0.3em]
            "
          >
            LUMÉRA
          </Link>

          <Link
            href="/"
            className="
              shrink-0
              text-[8px]
              tracking-[0.18em]
              text-black/60
              transition
              hover:text-black
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            BACK TO SHOP
          </Link>

        </div>

      </header>

      {/* ========================================
          LOGIN
      ======================================== */}

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 py-14 sm:min-h-[calc(100vh-6rem)] sm:px-8 sm:py-20">

        <div className="w-full max-w-md">

          {/* TITLE */}

          <div className="text-center">

            <p className="text-[8px] tracking-[0.32em] text-black/40 sm:text-[10px] sm:tracking-[0.35em]">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl">
              Sign In
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
              Sign in to access your account and view
              your LUMÉRA orders.
            </p>

          </div>

          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="mt-9 space-y-5 sm:mt-12"
          >

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                autoComplete="email"
                className="
                  w-full
                  min-w-0
                  border
                  border-black/20
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                  sm:py-4
                "
              />

            </div>

            {/* PASSWORD */}

            <div>

              <div className="mb-2 flex items-center justify-between gap-3">

                <label className="text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                  PASSWORD
                </label>

                <Link
                  href="/account/forgot-password"
                  className="
                    shrink-0
                    text-[8px]
                    tracking-[0.12em]
                    text-black/40
                    transition
                    hover:text-black
                    sm:text-[9px]
                    sm:tracking-[0.15em]
                  "
                >
                  FORGOT PASSWORD?
                </Link>

              </div>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
                autoComplete="current-password"
                className="
                  w-full
                  min-w-0
                  border
                  border-black/20
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                  sm:py-4
                "
              />

            </div>

            {/* ERROR */}

            {error && (

              <div className="border border-red-200 bg-red-50 px-4 py-3">

                <p className="text-xs leading-5 text-red-600 sm:text-sm">
                  {error}
                </p>

              </div>

            )}

            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-black
                py-4
                text-[9px]
                tracking-[0.25em]
                text-white
                transition
                hover:bg-black/80
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-[10px]
                sm:tracking-[0.3em]
              "
            >
              {loading
                ? "SIGNING IN..."
                : "SIGN IN"}
            </button>

          </form>

          {/* CREATE ACCOUNT */}

          <div className="mt-10 border-t border-black/10 pt-8 text-center sm:mt-12 sm:pt-10">

            <p className="text-xs text-black/50 sm:text-sm">
              Don't have a LUMÉRA account?
            </p>

            <Link
              href="/account/register"
              className="
                mt-3
                inline-block
                border-b
                border-black
                pb-1
                text-[9px]
                tracking-[0.2em]
                transition
                hover:opacity-50
                sm:mt-4
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              CREATE AN ACCOUNT
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}