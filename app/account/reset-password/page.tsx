"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "The new passwords do not match."
      );
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      router.replace("/account/login");
      return;
    }

    /*
     * Verify the current password first.
     */

    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (verifyError) {
      setError(
        "Your current password is incorrect."
      );

      setLoading(false);
      return;
    }

    /*
     * Update to the new password.
     */

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      console.error(
        "Password update error:",
        updateError
      );

      setError(
        "We couldn't update your password. Please try again."
      );

      setLoading(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setSuccess(
      "Your password has been updated successfully."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">

        <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between px-6 md:px-10">

          <Link
            href="/"
            className="font-serif text-3xl tracking-[0.25em]"
          >
            LUMÉRA
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/account"
              className="text-[10px] tracking-[0.2em] text-black/50 transition hover:text-black"
            >
              MY ACCOUNT
            </Link>

            <Link
              href="/account/details"
              className="text-[10px] tracking-[0.2em] text-black/50 transition hover:text-black"
            >
              ACCOUNT DETAILS
            </Link>

          </div>

        </div>

      </header>


      {/* CONTENT */}

      <section className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">

        {/* TITLE */}

        <div className="text-center">

          <p className="text-[9px] tracking-[0.4em] text-black/40">
            ACCOUNT SECURITY
          </p>

          <h1 className="mt-5 font-serif text-5xl md:text-6xl">
            Change Password
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/50">
            Update your password to keep your
            LUMÉRA account secure.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleChangePassword}
          className="mt-14 border border-black/10 bg-white p-6 md:p-10"
        >

          {/* CURRENT PASSWORD */}

          <div>

            <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
              CURRENT PASSWORD
            </label>

            <div className="relative">

              <input
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                required
                autoComplete="current-password"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 pr-20 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(
                    !showCurrent
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] text-black/40 hover:text-black"
              >
                {showCurrent
                  ? "HIDE"
                  : "SHOW"}
              </button>

            </div>

          </div>


          {/* NEW PASSWORD */}

          <div className="mt-6">

            <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
              NEW PASSWORD
            </label>

            <div className="relative">

              <input
                type={
                  showNew
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 pr-20 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(!showNew)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] text-black/40 hover:text-black"
              >
                {showNew
                  ? "HIDE"
                  : "SHOW"}
              </button>

            </div>

            <p className="mt-2 text-[11px] text-black/40">
              Use at least 8 characters.
            </p>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="mt-6">

            <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
              CONFIRM NEW PASSWORD
            </label>

            <div className="relative">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 pr-20 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] text-black/40 hover:text-black"
              >
                {showConfirm
                  ? "HIDE"
                  : "SHOW"}
              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="mt-6 border border-green-200 bg-green-50 px-5 py-4">

              <p className="text-sm text-green-700">
                {success}
              </p>

            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-black py-4 text-[10px] tracking-[0.3em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "UPDATING PASSWORD..."
              : "UPDATE PASSWORD"}
          </button>

        </form>


        {/* BACK */}

        <div className="mt-8 text-center">

          <Link
            href="/account/details"
            className="text-[10px] tracking-[0.25em] text-black/50 transition hover:text-black"
          >
            ← BACK TO ACCOUNT DETAILS
          </Link>

        </div>

      </section>

    </main>
  );
}