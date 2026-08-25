"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired."
        );
      }

      setChecking(false);
    }

    checkSession();
  }, [supabase]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setError(
        "We couldn't update your password. Please try again."
      );

      setLoading(false);
      return;
    }

    setSuccess(
      "Your password has been updated successfully."
    );

    setPassword("");
    setConfirmPassword("");

    setLoading(false);

    setTimeout(() => {
      router.push("/account/login");
    }, 1800);
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5">
        <p className="text-center text-[9px] tracking-[0.25em] text-black/40 sm:text-[10px] sm:tracking-[0.3em]">
          VERIFYING RESET LINK...
        </p>
      </main>
    );
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
            SIGN IN
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
              ACCOUNT SECURITY
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight sm:mt-5 sm:text-5xl">
              Create New Password
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
              Choose a new password for your
              LUMÉRA account.
            </p>

          </div>


          {/* ====================================
              FORM
          ==================================== */}

          {!error ||
          error.includes("invalid") === false ? (

            <form
              onSubmit={handleSubmit}
              className="
                mt-9
                border
                border-black/10
                bg-white
                p-5
                sm:mt-12
                sm:p-8
                md:p-10
              "
            >

              {/* NEW PASSWORD */}

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.18em] text-black/50 sm:text-[9px] sm:tracking-[0.2em]">
                  NEW PASSWORD
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="
                    w-full
                    min-w-0
                    border
                    border-black/15
                    bg-[#f8f6f2]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                    sm:py-4
                  "
                />

                <p className="mt-2 text-[10px] leading-5 text-black/40 sm:text-[11px]">
                  Use at least 8 characters.
                </p>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="mt-5 sm:mt-6">

                <label className="mb-2 block text-[8px] tracking-[0.18em] text-black/50 sm:text-[9px] sm:tracking-[0.2em]">
                  CONFIRM NEW PASSWORD
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="
                    w-full
                    min-w-0
                    border
                    border-black/15
                    bg-[#f8f6f2]
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

                <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 sm:mt-6">

                  <p className="text-xs leading-5 text-red-600 sm:text-sm">
                    {error}
                  </p>

                </div>

              )}


              {/* SUCCESS */}

              {success && (

                <div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 sm:mt-6 sm:py-4">

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
                  mt-6
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
                  sm:mt-8
                  sm:text-[10px]
                  sm:tracking-[0.3em]
                "
              >
                {loading
                  ? "UPDATING..."
                  : "UPDATE PASSWORD"}
              </button>

            </form>

          ) : (

            /* ==================================
               INVALID LINK
            ================================== */

            <div className="mt-9 border border-red-200 bg-red-50 p-5 text-center sm:mt-12 sm:p-8">

              <p className="text-xs leading-6 text-red-600 sm:text-sm">
                {error}
              </p>

              <Link
                href="/account/forgot-password"
                className="
                  mt-5
                  inline-block
                  border-b
                  border-black
                  pb-1
                  text-[9px]
                  tracking-[0.2em]
                  sm:mt-6
                  sm:text-[10px]
                  sm:tracking-[0.25em]
                "
              >
                REQUEST A NEW LINK
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}