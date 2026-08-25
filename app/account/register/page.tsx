"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    router.push(
      "/account/login?registered=true"
    );

    router.refresh();
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
          REGISTER
      ======================================== */}

      <section className="flex justify-center px-5 py-12 sm:px-8 sm:py-20">

        <div className="w-full max-w-xl">

          {/* ====================================
              TITLE
          ==================================== */}

          <div className="text-center">

            <p className="text-[8px] tracking-[0.32em] text-black/40 sm:text-[10px] sm:tracking-[0.35em]">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl">
              Create Account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
              Create your LUMÉRA account to manage
              your orders and enjoy a more personal
              shopping experience.
            </p>

          </div>


          {/* ====================================
              REGISTER FORM
          ==================================== */}

          <form
            onSubmit={handleRegister}
            className="mt-9 space-y-5 sm:mt-12"
          >

            {/* NAME */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* FIRST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                  FIRST NAME
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="given-name"
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


              {/* LAST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                  LAST NAME
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="family-name"
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

            </div>


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

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                PASSWORD
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
                autoComplete="new-password"
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

              <p className="mt-2 text-[10px] leading-5 text-black/40 sm:text-xs">
                Minimum 6 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                CONFIRM PASSWORD
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
                autoComplete="new-password"
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


            {/* BUTTON */}

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
                ? "CREATING ACCOUNT..."
                : "CREATE ACCOUNT"}
            </button>

          </form>


          {/* ====================================
              LOGIN
          ==================================== */}

          <div className="mt-10 border-t border-black/10 pt-8 text-center sm:mt-12 sm:pt-10">

            <p className="text-xs text-black/50 sm:text-sm">
              Already have a LUMÉRA account?
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
              SIGN IN
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}