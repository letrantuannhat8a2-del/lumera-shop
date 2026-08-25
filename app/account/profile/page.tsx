"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Your profile has been updated.");
    setLoading(false);
  }

  async function updatePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");

    setMessage("Your password has been updated.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      <header className="border-b border-black/10">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/account"
            className="font-serif text-2xl tracking-[0.2em] sm:text-3xl"
          >
            LUMÉRA
          </Link>

          <Link
            href="/account"
            className="text-[9px] tracking-[0.25em] text-black/50"
          >
            BACK TO ACCOUNT
          </Link>

        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">

        <p className="text-[9px] tracking-[0.4em] text-black/40">
          ACCOUNT / PROFILE
        </p>

        <h1 className="mt-5 font-serif text-4xl sm:text-5xl">
          Account Details
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">
          Manage your personal information and
          account security.
        </p>

        {message && (
          <div className="mt-8 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-2">

          {/* PERSONAL INFORMATION */}

          <form
            onSubmit={updateProfile}
            className="border border-black/10 bg-white p-6 sm:p-9"
          >

            <p className="text-[9px] tracking-[0.35em] text-black/40">
              PERSONAL INFORMATION
            </p>

            <div className="mt-8">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                FIRST NAME
              </label>

              <input
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none focus:border-black"
              />

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                LAST NAME
              </label>

              <input
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none focus:border-black"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-black py-4 text-[9px] tracking-[0.3em] text-white disabled:opacity-50"
            >
              {loading
                ? "SAVING..."
                : "SAVE DETAILS"}
            </button>

          </form>


          {/* PASSWORD */}

          <form
            onSubmit={updatePassword}
            className="border border-black/10 bg-white p-6 sm:p-9"
          >

            <p className="text-[9px] tracking-[0.35em] text-black/40">
              ACCOUNT SECURITY
            </p>

            <h2 className="mt-6 font-serif text-2xl">
              Change Password
            </h2>

            <div className="mt-8">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                NEW PASSWORD
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none focus:border-black"
              />

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                CONFIRM PASSWORD
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none focus:border-black"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-black py-4 text-[9px] tracking-[0.3em] text-white disabled:opacity-50"
            >
              {loading
                ? "UPDATING..."
                : "UPDATE PASSWORD"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}