"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const supabase =
      createClient();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setErrorMessage(
        "Invalid email or password."
      );

      setLoading(false);
      return;
    }

    router.push("/admin/orders");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-6 text-black">

      <div className="w-full max-w-md">

        <div className="text-center">
          <p className="font-serif text-3xl tracking-[0.28em]">
            LUMÉRA
          </p>

          <p className="mt-8 text-[10px] tracking-[0.35em] text-gray-400">
            ADMINISTRATION
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Sign In
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-4"
        >

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email"
            required
            className="w-full border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
            required
            className="w-full border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
          />

          {errorMessage && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-4 text-xs tracking-[0.25em] text-white"
          >
            {loading
              ? "SIGNING IN..."
              : "SIGN IN"}
          </button>

        </form>

      </div>

    </main>
  );
}