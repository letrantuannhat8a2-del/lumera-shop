"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSignOut() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const supabase =
        createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Sign out error:",
          error
        );

        alert(
          "Unable to sign out. Please try again."
        );

        return;
      }

      router.replace(
        "/account/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Sign out request error:",
        error
      );

      alert(
        "Unable to sign out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="
        group
        flex
        w-full
        items-center
        justify-between
        border
        border-[#211d1d]/10
        bg-transparent
        px-7
        py-6
        text-left
        transition
        hover:border-[#211d1d]
        hover:bg-white
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:px-9
        sm:py-7
      "
    >
      <div>
        <p className="text-[9px] tracking-[0.35em] text-[#756b6b]">
          ACCOUNT
        </p>

        <p className="mt-2 font-serif text-2xl sm:text-3xl">
          {loading
            ? "Signing out..."
            : "Sign out"}
        </p>
      </div>

      <span
        className="
          text-lg
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      >
        →
      </span>
    </button>
  );
}