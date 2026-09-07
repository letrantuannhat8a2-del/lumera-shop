"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "../../lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [loadingPassword, setLoadingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ========================================
  // LOAD CURRENT USER
  // ========================================

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (error) {
        console.error(
          "GET USER ERROR:",
          error
        );
        return;
      }

      if (!user) {
        return;
      }

      setFirstName(
        user.user_metadata?.first_name ||
          ""
      );

      setLastName(
        user.user_metadata?.last_name ||
          ""
      );
    }

    loadProfile();
  }, [supabase]);

  // ========================================
  // UPDATE PROFILE
  // ========================================

  async function updateProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loadingProfile) return;

    setLoadingProfile(true);
    setMessage("");
    setError("");

    try {
      const cleanFirstName =
        firstName.trim();

      const cleanLastName =
        lastName.trim();

      const { error } =
        await supabase.auth.updateUser({
          data: {
            first_name:
              cleanFirstName,

            last_name:
              cleanLastName,

            full_name:
              `${cleanFirstName} ${cleanLastName}`.trim(),
          },
        });

      if (error) {
        console.error(
          "UPDATE PROFILE ERROR:",
          error
        );

        setError(error.message);
        setLoadingProfile(false);
        return;
      }

      setFirstName(
        cleanFirstName
      );

      setLastName(
        cleanLastName
      );

      setMessage(
        "Your profile has been updated."
      );

    } catch (err) {
      console.error(
        "UPDATE PROFILE EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while updating your profile."
      );

    } finally {
      setLoadingProfile(false);
    }
  }

  // ========================================
  // UPDATE PASSWORD
  // ========================================

  async function updatePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loadingPassword) return;

    setLoadingPassword(true);
    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );

      setLoadingPassword(false);
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );

      setLoadingPassword(false);
      return;
    }

    try {
      const { error } =
        await supabase.auth.updateUser({
          password:
            newPassword,
        });

      if (error) {
        console.error(
          "UPDATE PASSWORD ERROR:",
          error
        );

        setError(error.message);
        setLoadingPassword(false);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Your password has been updated."
      );

    } catch (err) {
      console.error(
        "UPDATE PASSWORD EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while updating your password."
      );

    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-[#211d1d]/10 bg-[#fcf8f6]">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/account"
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

          <Link
            href="/account"
            className="
              shrink-0
              text-[9px]
              tracking-[0.2em]
              text-[#756b6b]
              transition
              hover:text-[#211d1d]
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            BACK TO ACCOUNT
          </Link>

        </div>

      </header>


      {/* ========================================
          PROFILE
      ======================================== */}

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">

        {/* TITLE */}

        <div>

          <p className="text-[9px] tracking-[0.4em] text-[#a88989]">
            VIREL / PROFILE
          </p>

          <h1 className="mt-5 font-serif text-4xl sm:text-5xl">
            Account Details
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-[#756b6b]">
            Manage your personal information
            and account security.
          </p>

        </div>


        {/* ========================================
            MESSAGES
        ======================================== */}

        {message && (

          <div className="mt-8 border border-[#b8d7c0] bg-[#f0f8f2] px-5 py-4 text-sm text-[#52755b]">
            {message}
          </div>

        )}

        {error && (

          <div className="mt-8 border border-[#dfbcbc] bg-[#fbf0f0] px-5 py-4 text-sm text-[#9b5e5e]">
            {error}
          </div>

        )}


        {/* ========================================
            FORMS
        ======================================== */}

        <div className="mt-12 grid gap-10 lg:grid-cols-2">


          {/* ======================================
              PERSONAL INFORMATION
          ====================================== */}

          <form
            onSubmit={updateProfile}
            className="border border-[#211d1d]/10 bg-white p-6 sm:p-9"
          >

            <p className="text-[9px] tracking-[0.35em] text-[#a88989]">
              PERSONAL INFORMATION
            </p>


            {/* FIRST NAME */}

            <div className="mt-8">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-[#756b6b]">
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
                autoComplete="given-name"
                className="
                  w-full
                  border
                  border-[#211d1d]/15
                  bg-[#fcf8f6]
                  px-4
                  py-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                "
              />

            </div>


            {/* LAST NAME */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-[#756b6b]">
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
                autoComplete="family-name"
                className="
                  w-full
                  border
                  border-[#211d1d]/15
                  bg-[#fcf8f6]
                  px-4
                  py-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                "
              />

            </div>


            {/* SAVE */}

            <button
              type="submit"
              disabled={
                loadingProfile ||
                loadingPassword
              }
              className="
                mt-8
                w-full
                bg-[#211d1d]
                py-4
                text-[9px]
                tracking-[0.3em]
                text-white
                transition
                hover:bg-[#a88989]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loadingProfile
                ? "SAVING..."
                : "SAVE DETAILS"}
            </button>

          </form>


          {/* ======================================
              PASSWORD
          ====================================== */}

          <form
            onSubmit={updatePassword}
            className="border border-[#211d1d]/10 bg-white p-6 sm:p-9"
          >

            <p className="text-[9px] tracking-[0.35em] text-[#a88989]">
              ACCOUNT SECURITY
            </p>

            <h2 className="mt-6 font-serif text-2xl">
              Change Password
            </h2>

            <p className="mt-3 text-xs leading-5 text-[#756b6b]">
              Choose a new password to keep
              your VIREL account secure.
            </p>


            {/* NEW PASSWORD */}

            <div className="mt-8">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-[#756b6b]">
                NEW PASSWORD
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                minLength={8}
                autoComplete="new-password"
                className="
                  w-full
                  border
                  border-[#211d1d]/15
                  bg-[#fcf8f6]
                  px-4
                  py-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                "
              />

              <p className="mt-2 text-[10px] text-[#8d8080]">
                Minimum 8 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-[#756b6b]">
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
                minLength={8}
                autoComplete="new-password"
                className="
                  w-full
                  border
                  border-[#211d1d]/15
                  bg-[#fcf8f6]
                  px-4
                  py-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#211d1d]
                "
              />

            </div>


            {/* UPDATE */}

            <button
              type="submit"
              disabled={
                loadingProfile ||
                loadingPassword
              }
              className="
                mt-8
                w-full
                bg-[#211d1d]
                py-4
                text-[9px]
                tracking-[0.3em]
                text-white
                transition
                hover:bg-[#a88989]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loadingPassword
                ? "UPDATING..."
                : "UPDATE PASSWORD"}
            </button>

          </form>

        </div>


        {/* ========================================
            BACK
        ======================================== */}

        <div className="mt-10 border-t border-[#211d1d]/10 pt-7 sm:mt-12 sm:pt-8">

          <Link
            href="/account"
            className="
              inline-flex
              items-center
              text-[9px]
              tracking-[0.25em]
              text-[#756b6b]
              transition
              hover:text-[#211d1d]
            "
          >
            ← BACK TO MY ACCOUNT
          </Link>

        </div>


        {/* ========================================
            BRAND
        ======================================== */}

        <div className="mt-10 text-center sm:mt-12">

          <p className="font-serif text-lg tracking-[0.25em]">
            VIREL
          </p>

          <p className="mt-2 text-[8px] tracking-[0.3em] text-[#a88989]">
            BRIDAL SHOES · REFINED SILHOUETTES
          </p>

        </div>

      </section>

    </main>
  );
}