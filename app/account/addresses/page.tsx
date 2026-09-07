"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  countries,
  type CountryConfig,
} from "./locationData";

type Address = {
  id: string;

  fullName: string;
  phone: string;

  country: string;
  countryCode: string;

  region: string;
  city: string;
  district: string;

  street: string;
  postalCode: string;

  isDefault: boolean;
};

type AddressApiItem = {
  id: string;

  full_name: string;
  phone: string;

  country: string;
  country_code: string;

  region: string | null;
  city: string | null;
  district: string | null;

  street: string;
  postal_code: string | null;

  is_default: boolean;
};

type AddressApiResponse = {
  success?: boolean;
  addresses?: AddressApiItem[];
  address?: AddressApiItem;
  error?: string;
};

export default function AddressesPage() {
  // =====================================================
  // ADDRESSES
  // =====================================================

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [countryCode, setCountryCode] =
    useState("US");

  const [region, setRegion] =
    useState("");

  const [city, setCity] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [street, setStreet] =
    useState("");

  const [postalCode, setPostalCode] =
    useState("");

  // =====================================================
  // SELECTED COUNTRY
  // =====================================================

  const selectedCountry: CountryConfig =
    countries.find(
      (country: CountryConfig) =>
        country.code === countryCode
    ) ?? countries[0];

  // =====================================================
  // LOAD ADDRESSES
  // =====================================================

  async function loadAddresses() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch("/api/addresses", {
          method: "GET",
          cache: "no-store",
        });

      const data: AddressApiResponse =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to load your addresses."
        );

        return;
      }

      const mappedAddresses: Address[] =
        (data.addresses ?? []).map(
          (item: AddressApiItem) => ({
            id: item.id,

            fullName:
              item.full_name ?? "",

            phone:
              item.phone ?? "",

            country:
              item.country ?? "",

            countryCode:
              item.country_code ?? "",

            region:
              item.region ?? "",

            city:
              item.city ?? "",

            district:
              item.district ?? "",

            street:
              item.street ?? "",

            postalCode:
              item.postal_code ?? "",

            isDefault:
              Boolean(
                item.is_default
              ),
          })
        );

      setAddresses(
        mappedAddresses
      );
    } catch (err) {
      console.error(
        "Load addresses error:",
        err
      );

      setError(
        "Something went wrong while loading your addresses."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    loadAddresses();
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  function resetForm() {
    setFullName("");
    setPhone("");

    setCountryCode("US");

    setRegion("");
    setCity("");
    setDistrict("");

    setStreet("");
    setPostalCode("");
  }

  // =====================================================
  // ADD ADDRESS
  // =====================================================

  async function handleAddAddress(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch("/api/addresses", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName:
              fullName.trim(),

            phone:
              phone.trim(),

            country:
              selectedCountry.name,

            countryCode,

            region:
              region.trim(),

            city:
              city.trim(),

            district:
              district.trim(),

            street:
              street.trim(),

            postalCode:
              postalCode.trim(),
          }),
        });

      const data: AddressApiResponse =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to save this address."
        );

        return;
      }

      setMessage(
        "Your address has been saved."
      );

      resetForm();

      setShowForm(false);

      await loadAddresses();
    } catch (err) {
      console.error(
        "Add address error:",
        err
      );

      setError(
        "Something went wrong while saving the address."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // SET DEFAULT ADDRESS
  // =====================================================

  async function handleSetDefault(
    id: string
  ) {
    setError("");
    setMessage("");

    try {
      const response =
        await fetch("/api/addresses", {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to update your default address."
        );

        return;
      }

      setMessage(
        "Default address updated."
      );

      await loadAddresses();
    } catch (err) {
      console.error(
        "Set default address error:",
        err
      );

      setError(
        "Something went wrong while updating your address."
      );
    }
  }

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this address?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response =
        await fetch("/api/addresses", {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to remove this address."
        );

        return;
      }

      setMessage(
        "Address removed."
      );

      await loadAddresses();
    } catch (err) {
      console.error(
        "Delete address error:",
        err
      );

      setError(
        "Something went wrong while removing the address."
      );
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* =================================================
          HEADER
      ================================================= */}

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
            className="text-[9px] tracking-[0.25em] text-black/50 transition hover:text-black"
          >
            BACK TO ACCOUNT
          </Link>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">

        {/* TITLE */}

        <p className="text-[9px] tracking-[0.4em] text-black/40">
          ACCOUNT / ADDRESSES
        </p>

        <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <h1 className="font-serif text-4xl sm:text-5xl">
              Addresses
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">
              Manage your saved shipping
              addresses for faster checkout.
            </p>

          </div>

          {/* ADD BUTTON */}

          <button
            type="button"
            onClick={() => {
              setShowForm(
                !showForm
              );

              setError("");
              setMessage("");
            }}
            className="w-full bg-black px-6 py-4 text-[9px] tracking-[0.3em] text-white transition hover:bg-black/80 sm:w-auto"
          >
            {showForm
              ? "CANCEL"
              : "ADD NEW ADDRESS"}
          </button>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="mt-8 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            ADD ADDRESS FORM
        ================================================= */}

        {showForm && (
          <form
            onSubmit={
              handleAddAddress
            }
            className="mt-10 border border-black/10 bg-white p-6 sm:p-9"
          >

            <p className="text-[9px] tracking-[0.35em] text-black/40">
              NEW SHIPPING ADDRESS
            </p>

            {/* FULL NAME */}

            <div className="mt-8">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                FULL NAME
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                required
                autoComplete="name"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
              />

            </div>

            {/* PHONE */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                PHONE NUMBER
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                required
                autoComplete="tel"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
              />

            </div>

            {/* COUNTRY */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                COUNTRY
              </label>

              <select
                value={countryCode}
                onChange={(event) => {
                  setCountryCode(
                    event.target.value
                  );

                  setRegion("");
                  setCity("");
                  setDistrict("");
                }}
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
              >
                {countries.map(
                  (
                    country: CountryConfig
                  ) => (
                    <option
                      key={
                        country.code
                      }
                      value={
                        country.code
                      }
                    >
                      {country.name}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* REGION + CITY */}

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              {/* REGION */}

              {selectedCountry.hasRegion && (
                <div>

                  <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                    {
                      selectedCountry.regionLabel
                    }
                  </label>

                  <input
                    type="text"
                    value={region}
                    onChange={(event) =>
                      setRegion(
                        event.target.value
                      )
                    }
                    required={
                      selectedCountry.regionRequired
                    }
                    autoComplete="address-level1"
                    className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                  />

                </div>
              )}

              {/* CITY */}

              {selectedCountry.hasCity && (
                <div>

                  <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                    {
                      selectedCountry.cityLabel
                    }
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    required={
                      selectedCountry.cityRequired
                    }
                    autoComplete="address-level2"
                    className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                  />

                </div>
              )}

            </div>

            {/* DISTRICT */}

            {selectedCountry.hasDistrict && (
              <div className="mt-6">

                <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                  {
                    selectedCountry.districtLabel
                  }
                </label>

                <input
                  type="text"
                  value={district}
                  onChange={(event) =>
                    setDistrict(
                      event.target.value
                    )
                  }
                  required={
                    selectedCountry.districtRequired
                  }
                  className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>
            )}

            {/* STREET */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                STREET ADDRESS
              </label>

              <input
                type="text"
                value={street}
                onChange={(event) =>
                  setStreet(
                    event.target.value
                  )
                }
                required
                autoComplete="street-address"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
              />

            </div>

            {/* POSTAL CODE */}

            <div className="mt-6">

              <label className="mb-2 block text-[9px] tracking-[0.2em] text-black/50">
                {
                  selectedCountry.postalLabel
                }
              </label>

              <input
                type="text"
                value={postalCode}
                onChange={(event) =>
                  setPostalCode(
                    event.target.value
                  )
                }
                autoComplete="postal-code"
                className="w-full border border-black/15 bg-[#f8f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
              />

            </div>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="mt-8 w-full bg-black py-4 text-[9px] tracking-[0.3em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "SAVING..."
                : "SAVE ADDRESS"}
            </button>

          </form>
        )}

        {/* =================================================
            ADDRESS LIST
        ================================================= */}

        <div className="mt-10">

          {/* LOADING */}

          {loading ? (

            <div className="border border-black/10 bg-white px-6 py-16 text-center">

              <p className="text-xs tracking-[0.2em] text-black/40">
                LOADING ADDRESSES...
              </p>

            </div>

          ) : addresses.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="border border-black/10 bg-white px-6 py-16 text-center">

              <h2 className="font-serif text-2xl">
                No saved addresses
              </h2>

              <p className="mt-3 text-sm text-black/50">
                Add a shipping address
                to make checkout faster.
              </p>

              {!showForm && (
                <button
                  type="button"
                  onClick={() =>
                    setShowForm(true)
                  }
                  className="mt-7 border-b border-black pb-1 text-[9px] tracking-[0.25em]"
                >
                  ADD ADDRESS
                </button>
              )}

            </div>

          ) : (

            /* =================================================
               ADDRESS CARDS
            ================================================= */

            <div className="space-y-5">

              {addresses.map(
                (address: Address) => (

                  <article
                    key={address.id}
                    className="border border-black/10 bg-white p-6 sm:p-8"
                  >

                    {/* NAME + DEFAULT */}

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="font-serif text-xl sm:text-2xl">
                            {
                              address.fullName
                            }
                          </h2>

                          {address.isDefault && (
                            <span className="border border-black/20 px-2 py-1 text-[7px] tracking-[0.18em] text-black/50">
                              DEFAULT
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm text-black/50">
                          {
                            address.phone
                          }
                        </p>

                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="mt-6 border-t border-black/10 pt-6">

                      <p className="text-sm leading-7 text-black/70">

                        {address.street}

                        <br />

                        {address.district && (
                          <>
                            {
                              address.district
                            }

                            <br />
                          </>
                        )}

                        {address.city}

                        {address.region && (
                          <>
                            {address.city
                              ? ", "
                              : ""}

                            {
                              address.region
                            }
                          </>
                        )}

                        {address.postalCode && (
                          <>
                            {" "}
                            {
                              address.postalCode
                            }
                          </>
                        )}

                        <br />

                        {
                          address.country
                        }

                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4 border-t border-black/10 pt-5">

                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSetDefault(
                              address.id
                            )
                          }
                          className="text-[8px] tracking-[0.22em] underline underline-offset-4"
                        >
                          SET AS DEFAULT
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            address.id
                          )
                        }
                        className="text-[8px] tracking-[0.22em] text-red-500 underline underline-offset-4"
                      >
                        REMOVE
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}