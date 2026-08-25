"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/account/update-password`,
        }
      );

    if (error) {
      console.error(error);

      setError(
        "We couldn't send the reset email. Please try again."
      );

      setLoading(false);
      return;
    }

    setSuccess(
      "We've sent a password reset link to your email address."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f6f2] text-black">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-black/10 bg-white">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

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
            LUMÉRA
          </Link>

          <Link
            href="/account/login"
            className="
              shrink-0
              text-[8px]
              tracking-[0.16em]
              text-black/50
              transition
              hover:text-black
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            BACK TO SIGN IN
          </Link>

        </div>

      </header>


      {/* ========================================
          CONTENT
      ======================================== */}

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 py-14 sm:min-h-[calc(100vh-6rem)] sm:px-8 sm:py-20">

        <div className="w-full max-w-md">

          {/* ====================================
              TITLE
          ==================================== */}

          <div className="text-center">

            <p className="text-[8px] tracking-[0.35em] text-black/40 sm:text-[9px] sm:tracking-[0.4em]">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight sm:mt-5 sm:text-5xl">
              Forgot Password?
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
              Enter your email address and we'll
              send you a secure link to reset your
              password.
            </p>

          </div>


          {/* ====================================
              FORM
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-9 sm:mt-12"
          >

            <label className="mb-2 block text-[8px] tracking-[0.18em] text-black/50 sm:text-[9px] sm:tracking-[0.2em]">
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
              placeholder="you@example.com"
              className="
                w-full
                min-w-0
                border
                border-black/15
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


            {/* ERROR */}

            {error && (

              <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 sm:mt-5">

                <p className="text-xs leading-5 text-red-600 sm:text-sm">
                  {error}
                </p>

              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="mt-4 border border-green-200 bg-green-50 px-4 py-3 sm:mt-5 sm:py-4">

                <p className="text-xs leading-6 text-green-700 sm:text-sm">
                  {success}
                </p>

              </div>

            )}


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-5
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
                sm:mt-6
                sm:text-[10px]
                sm:tracking-[0.3em]
              "
            >
              {loading
                ? "SENDING..."
                : "SEND RESET LINK"}
            </button>

          </form>


          {/* ====================================
              BACK TO LOGIN
          ==================================== */}

          <div className="mt-9 border-t border-black/10 pt-7 text-center sm:mt-10 sm:pt-8">

            <p className="text-xs text-black/50 sm:text-sm">
              Remember your password?
            </p>

            <Link
              href="/account/login"
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
              BACK TO SIGN IN
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}