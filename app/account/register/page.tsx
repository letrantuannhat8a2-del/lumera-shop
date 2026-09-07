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

    if (loading) return;

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

    try {
      const supabase = createClient();

      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,

          options: {
            data: {
              first_name:
                firstName.trim(),
              last_name:
                lastName.trim(),
            },
          },
        });

      if (error) {
        console.error(
          "REGISTER ERROR:",
          error
        );

        setError(error.message);
        setLoading(false);
        return;
      }

      // ========================================
      // EMAIL CONFIRMATION DISABLED
      // ========================================

      if (data.session) {
        router.replace("/account");
        router.refresh();
        return;
      }

      // ========================================
      // EMAIL CONFIRMATION REQUIRED
      // ========================================

      router.replace(
        "/account/login?registered=true"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "REGISTER EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while creating your account."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-[#211d1d]/10 bg-[#fcf8f6]">

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
            VIREL
          </Link>

          <Link
            href="/shop"
            className="
              shrink-0
              text-[8px]
              tracking-[0.18em]
              text-[#211d1d]/60
              transition
              hover:text-[#211d1d]
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

          {/* TITLE */}

          <div className="text-center">

            <p className="text-[8px] tracking-[0.32em] text-[#a88989] sm:text-[10px] sm:tracking-[0.35em]">
              VIREL · CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl">
              Create Account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#756b6b] sm:mt-5 sm:text-sm">
              Create your VIREL account to manage
              your orders and enjoy a more personal
              shopping experience.
            </p>

          </div>


          {/* REGISTER FORM */}

          <form
            onSubmit={handleRegister}
            className="mt-9 space-y-5 sm:mt-12"
          >

            {/* NAME */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* FIRST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.18em] text-[#756b6b] sm:text-[10px] sm:tracking-[0.2em]">
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
                    border-[#211d1d]/20
                    bg-white
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#211d1d]
                    sm:py-4
                  "
                />

              </div>


              {/* LAST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.18em] text-[#756b6b] sm:text-[10px] sm:tracking-[0.2em]">
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
                    border-[#211d1d]/20
                    bg-white
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#211d1d]
                    sm:py-4
                  "
                />

              </div>

            </div>


            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-[#756b6b] sm:text-[10px] sm:tracking-[0.2em]">
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
                  border-[#211d1d]/20
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                  sm:py-4
                "
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-[#756b6b] sm:text-[10px] sm:tracking-[0.2em]">
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
                  border-[#211d1d]/20
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                  sm:py-4
                "
              />

              <p className="mt-2 text-[10px] leading-5 text-[#8d8080] sm:text-xs">
                Minimum 6 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-[9px] tracking-[0.18em] text-[#756b6b] sm:text-[10px] sm:tracking-[0.2em]">
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
                  border-[#211d1d]/20
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                  sm:py-4
                "
              />

            </div>


            {/* ERROR */}

            {error && (

              <div className="border border-[#dfbcbc] bg-[#fbf0f0] px-4 py-3">

                <p className="text-xs leading-5 text-[#9b5e5e] sm:text-sm">
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
                bg-[#211d1d]
                py-4
                text-[9px]
                tracking-[0.25em]
                text-white
                transition
                hover:bg-[#a88989]
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


          {/* LOGIN */}

          <div className="mt-10 border-t border-[#211d1d]/10 pt-8 text-center sm:mt-12 sm:pt-10">

            <p className="text-xs text-[#756b6b] sm:text-sm">
              Already have a VIREL account?
            </p>

            <Link
              href="/account/login"
              className="
                mt-3
                inline-block
                border-b
                border-[#211d1d]
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


          {/* BRAND */}

          <div className="mt-10 text-center sm:mt-12">

            <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
              VIREL · BRIDAL SHOES
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}