"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state_region: string;
  postal_code: string;
};

const emptyProfile: Profile = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state_region: "",
  postal_code: "",
};

export default function AccountDetailsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] =
    useState<Profile>(emptyProfile);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/account/login");
        return;
      }

      /*
       * Your orders table contains the customer information.
       * We use the most recent order belonging to this email
       * to pre-fill the account details.
       */

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
            first_name,
            last_name,
            email,
            phone,
            country,
            address_line1,
            address_line2,
            city,
            state_region,
            postal_code
          `
        )
        .eq("email", user.email ?? "")
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Failed to load account details:",
          error
        );
      }

      setProfile({
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        email: user.email ?? "",
        phone: data?.phone ?? "",
        country: data?.country ?? "",
        address_line1: data?.address_line1 ?? "",
        address_line2: data?.address_line2 ?? "",
        city: data?.city ?? "",
        state_region: data?.state_region ?? "",
        postal_code: data?.postal_code ?? "",
      });

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  function handleChange(
    field: keyof Profile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      router.replace("/account/login");
      return;
    }

    /*
     * At the moment your customer information is stored
     * inside orders.
     *
     * We update the customer's existing orders so the
     * information remains consistent with your current
     * database structure.
     */

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        country: profile.country,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state_region: profile.state_region,
        postal_code: profile.postal_code,
      })
      .eq("email", user.email);

    if (updateError) {
      console.error(
        "Failed to update account details:",
        updateError
      );

      setError(
        "We couldn't save your information. Please try again."
      );

      setSaving(false);
      return;
    }

    setMessage(
      "Your account details have been updated."
    );

    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2]">
        <p className="text-[10px] tracking-[0.3em] text-black/40">
          LOADING ACCOUNT...
        </p>
      </main>
    );
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
              href="/account/orders"
              className="text-[10px] tracking-[0.2em] text-black/50 transition hover:text-black"
            >
              MY ORDERS
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="text-[10px] tracking-[0.2em] text-black/50 transition hover:text-black"
            >
              SIGN OUT
            </button>

          </div>

        </div>

      </header>


      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">

        {/* TITLE */}

        <div className="max-w-2xl">

          <p className="text-[9px] tracking-[0.4em] text-black/40">
            CUSTOMER ACCOUNT
          </p>

          <h1 className="mt-5 font-serif text-5xl md:text-6xl">
            Account Details
          </h1>

          <p className="mt-5 text-sm leading-6 text-black/50">
            Manage your personal information and
            delivery details for your LUMÉRA account.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSave}
          className="mt-14"
        >

          {/* PERSONAL INFORMATION */}

          <section className="border border-black/10 bg-white">

            <div className="border-b border-black/10 px-6 py-6 md:px-8">

              <p className="text-[9px] tracking-[0.3em] text-black/40">
                PERSONAL INFORMATION
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Your details
              </h2>

            </div>


            <div className="grid gap-6 px-6 py-8 md:grid-cols-2 md:px-8">

              {/* FIRST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  FIRST NAME
                </label>

                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(event) =>
                    handleChange(
                      "first_name",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* LAST NAME */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  LAST NAME
                </label>

                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(event) =>
                    handleChange(
                      "last_name",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* EMAIL */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full cursor-not-allowed border border-black/10 bg-[#eeeeeb] px-4 py-4 text-sm text-black/50 outline-none"
                />

                <p className="mt-2 text-[11px] text-black/40">
                  Your email address is linked to
                  your login account and cannot be
                  changed here.
                </p>

              </div>


              {/* PHONE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  PHONE NUMBER
                </label>

                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="+1 000 000 0000"
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>

            </div>

          </section>


          {/* SHIPPING ADDRESS */}

          <section className="mt-8 border border-black/10 bg-white">

            <div className="border-b border-black/10 px-6 py-6 md:px-8">

              <p className="text-[9px] tracking-[0.3em] text-black/40">
                SHIPPING ADDRESS
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Delivery information
              </h2>

            </div>


            <div className="grid gap-6 px-6 py-8 md:grid-cols-2 md:px-8">

              {/* COUNTRY */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  COUNTRY
                </label>

                <input
                  type="text"
                  value={profile.country}
                  onChange={(event) =>
                    handleChange(
                      "country",
                      event.target.value
                    )
                  }
                  placeholder="United Kingdom"
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* CITY */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  CITY
                </label>

                <input
                  type="text"
                  value={profile.city}
                  onChange={(event) =>
                    handleChange(
                      "city",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* ADDRESS 1 */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  ADDRESS
                </label>

                <input
                  type="text"
                  value={profile.address_line1}
                  onChange={(event) =>
                    handleChange(
                      "address_line1",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* ADDRESS 2 */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  APARTMENT, SUITE, ETC.{" "}
                  <span className="text-black/30">
                    OPTIONAL
                  </span>
                </label>

                <input
                  type="text"
                  value={profile.address_line2}
                  onChange={(event) =>
                    handleChange(
                      "address_line2",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* STATE */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  STATE / REGION
                </label>

                <input
                  type="text"
                  value={profile.state_region}
                  onChange={(event) =>
                    handleChange(
                      "state_region",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>


              {/* POSTAL CODE */}

              <div>

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  POSTAL CODE
                </label>

                <input
                  type="text"
                  value={profile.postal_code}
                  onChange={(event) =>
                    handleChange(
                      "postal_code",
                      event.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>

            </div>

          </section>


          {/* MESSAGE */}

          {message && (
            <div className="mt-6 border border-green-200 bg-green-50 px-5 py-4">

              <p className="text-sm text-green-700">
                {message}
              </p>

            </div>
          )}


          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}


          {/* ACTIONS */}

          <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

            <Link
              href="/account"
              className="text-center text-[10px] tracking-[0.25em] text-black/50 transition hover:text-black sm:text-left"
            >
              ← BACK TO MY ACCOUNT
            </Link>


            <button
              type="submit"
              disabled={saving}
              className="bg-black px-10 py-4 text-[10px] tracking-[0.3em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "SAVING..."
                : "SAVE CHANGES"}
            </button>

          </div>

        </form>


        {/* SECURITY */}

        <section className="mt-16 border-t border-black/10 pt-10">

          <p className="text-[9px] tracking-[0.3em] text-black/40">
            ACCOUNT SECURITY
          </p>

          <div className="mt-5 flex flex-col justify-between gap-5 border border-black/10 bg-white p-6 md:flex-row md:items-center md:px-8">

            <div>

              <h2 className="font-serif text-xl">
                Password & Security
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Keep your LUMÉRA account secure by
                regularly updating your password.
              </p>

            </div>

            <Link
              href="/account/reset-password"
              className="whitespace-nowrap border border-black px-7 py-3 text-center text-[9px] tracking-[0.25em] transition hover:bg-black hover:text-white"
            >
              CHANGE PASSWORD
            </Link>

          </div>

        </section>

      </section>

    </main>
  );
}