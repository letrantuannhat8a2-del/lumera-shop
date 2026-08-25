"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Country = {
  name: string;
  iso2: string;
};

type LocationItem = {
  name: string;
  state_code?: string;
};

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

const STORAGE_KEY = "lumera_addresses";

const API =
  "https://countriesnow.space/api/v0.1";

/* =========================================================
   COUNTRY LIST
   Không gọi API để lấy country nữa
========================================================= */

const COUNTRY_CODES = [
  "AF",
  "AL",
  "DZ",
  "AD",
  "AO",
  "AG",
  "AR",
  "AM",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BT",
  "BO",
  "BA",
  "BW",
  "BR",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "CF",
  "TD",
  "CL",
  "CN",
  "CO",
  "KM",
  "CG",
  "CD",
  "CR",
  "CI",
  "HR",
  "CU",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FJ",
  "FI",
  "FR",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GR",
  "GD",
  "GT",
  "GN",
  "GW",
  "GY",
  "HT",
  "HN",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IL",
  "IT",
  "JM",
  "JP",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MR",
  "MU",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NZ",
  "NI",
  "NE",
  "NG",
  "MK",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PL",
  "PT",
  "QA",
  "RO",
  "RU",
  "RW",
  "KN",
  "LC",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SE",
  "CH",
  "SY",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UY",
  "UZ",
  "VU",
  "VA",
  "VE",
  "VN",
  "YE",
  "ZM",
  "ZW",
];

export default function AddressesPage() {
  /* =========================================================
     SAVED ADDRESSES
  ========================================================= */

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  /* =========================================================
     FORM
  ========================================================= */

  const [showForm, setShowForm] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  /*
    Mặc định Japan
  */
  const [countryCode, setCountryCode] =
    useState("JP");

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

  /* =========================================================
     LOCATION DATA
  ========================================================= */

  const [regions, setRegions] =
    useState<LocationItem[]>([]);

  const [cities, setCities] =
    useState<LocationItem[]>([]);

  const [loadingRegions, setLoadingRegions] =
    useState(false);

  const [loadingCities, setLoadingCities] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  /* =========================================================
     COUNTRY LIST
  ========================================================= */

  const countries =
    useMemo<Country[]>(() => {
      const displayNames =
        new Intl.DisplayNames(
          ["en"],
          {
            type: "region",
          }
        );

      return COUNTRY_CODES
        .map((iso2) => ({
          iso2,
          name:
            displayNames.of(iso2) ||
            iso2,
        }))
        .sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        );
    }, []);

  /* =========================================================
     SELECTED COUNTRY
  ========================================================= */

  const selectedCountry =
    useMemo(() => {
      return countries.find(
        (country) =>
          country.iso2 ===
          countryCode
      );
    }, [
      countries,
      countryCode,
    ]);

  /* =========================================================
     LOCATION LABELS
  ========================================================= */

  const locationLabels =
    useMemo(() => {
      switch (countryCode) {
        case "JP":
          return {
            region: "PREFECTURE",
            city: "CITY",
            district: "WARD / DISTRICT",
            postal: "POSTAL CODE",
          };

        case "US":
          return {
            region: "STATE",
            city: "CITY",
            district: "COUNTY / DISTRICT",
            postal: "ZIP CODE",
          };

        case "GB":
          return {
            region: "COUNTY / REGION",
            city: "CITY / TOWN",
            district: "DISTRICT",
            postal: "POSTCODE",
          };

        case "CA":
          return {
            region: "PROVINCE / TERRITORY",
            city: "CITY",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        case "AU":
          return {
            region: "STATE / TERRITORY",
            city: "CITY / SUBURB",
            district: "DISTRICT",
            postal: "POSTCODE",
          };

        case "KR":
          return {
            region: "PROVINCE / CITY",
            city: "CITY",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        case "TH":
          return {
            region: "PROVINCE",
            city: "DISTRICT",
            district: "SUBDISTRICT",
            postal: "POSTAL CODE",
          };

        case "FR":
          return {
            region: "REGION",
            city: "CITY / COMMUNE",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        case "DE":
          return {
            region: "STATE",
            city: "CITY",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        case "IT":
          return {
            region: "REGION",
            city: "CITY / COMUNE",
            district: "PROVINCE",
            postal: "POSTAL CODE",
          };

        case "ES":
          return {
            region:
              "AUTONOMOUS COMMUNITY",
            city:
              "CITY / MUNICIPALITY",
            district: "PROVINCE",
            postal: "POSTAL CODE",
          };

        case "NL":
          return {
            region: "PROVINCE",
            city: "CITY / TOWN",
            district: "MUNICIPALITY",
            postal: "POSTAL CODE",
          };

        case "CH":
          return {
            region: "CANTON",
            city:
              "CITY / MUNICIPALITY",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        case "NZ":
          return {
            region: "REGION",
            city: "CITY / TOWN",
            district: "DISTRICT",
            postal: "POSTCODE",
          };

        case "SG":
          return {
            region: "REGION",
            city: "CITY",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };

        default:
          return {
            region:
              "STATE / PROVINCE / REGION",
            city: "CITY / TOWN",
            district: "DISTRICT",
            postal: "POSTAL CODE",
          };
      }
    }, [countryCode]);

  /* =========================================================
     LOAD SAVED ADDRESSES
  ========================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setAddresses(parsed);
      }
    } catch {
      setAddresses([]);
    }
  }, []);

  /* =========================================================
     LOAD REGIONS
  ========================================================= */

  useEffect(() => {
    async function loadRegions() {
      setRegions([]);
      setCities([]);

      setRegion("");
      setCity("");
      setDistrict("");

      if (!selectedCountry) {
        return;
      }

      setLoadingRegions(true);

      try {
        const response =
          await fetch(
            `${API}/countries/states`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                country:
                  selectedCountry.name,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load regions"
          );
        }

        const result =
          await response.json();

        const data =
          result?.data?.states;

        if (Array.isArray(data)) {
          setRegions(
            data.map(
              (
                item: {
                  name: string;
                  state_code?: string;
                }
              ) => ({
                name: item.name,
                state_code:
                  item.state_code,
              })
            )
          );
        }
      } catch (error) {
        console.error(
          "REGION ERROR:",
          error
        );

        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    }

    loadRegions();
  }, [selectedCountry]);

  /* =========================================================
     LOAD CITIES
  ========================================================= */

  useEffect(() => {
    async function loadCities() {
      setCities([]);
      setCity("");

      if (
        !selectedCountry ||
        !region
      ) {
        return;
      }

      setLoadingCities(true);

      try {
        const response =
          await fetch(
            `${API}/countries/state/cities`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                country:
                  selectedCountry.name,

                state: region,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load cities"
          );
        }

        const result =
          await response.json();

        const data =
          Array.isArray(
            result?.data
          )
            ? result.data
            : [];

        setCities(
          data.map(
            (name: string) => ({
              name,
            })
          )
        );
      } catch (error) {
        console.error(
          "CITY ERROR:",
          error
        );

        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, [
    selectedCountry,
    region,
  ]);

  /* =========================================================
     SAVE LOCAL STORAGE
  ========================================================= */

  function persistAddresses(
    next: Address[]
  ) {
    setAddresses(next);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  }

  /* =========================================================
     RESET FORM
  ========================================================= */

  function resetForm() {
    setFullName("");
    setPhone("");

    setCountryCode("JP");

    setRegion("");
    setCity("");
    setDistrict("");

    setStreet("");
    setPostalCode("");

    setRegions([]);
    setCities([]);
  }

  /* =========================================================
     SAVE ADDRESS
  ========================================================= */

  function saveAddress(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!fullName.trim()) {
      return;
    }

    if (!phone.trim()) {
      return;
    }

    if (!selectedCountry) {
      return;
    }

    if (!street.trim()) {
      return;
    }

    if (!region) {
      return;
    }

    if (!city) {
      return;
    }

    setSaving(true);

    const newAddress: Address = {
      id: crypto.randomUUID(),

      fullName:
        fullName.trim(),

      phone:
        phone.trim(),

      country:
        selectedCountry.name,

      countryCode:
        selectedCountry.iso2,

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

      isDefault:
        addresses.length === 0,
    };

    persistAddresses([
      ...addresses,
      newAddress,
    ]);

    resetForm();

    setShowForm(false);

    setSaving(false);
  }

  /* =========================================================
     REMOVE ADDRESS
  ========================================================= */

  function removeAddress(
    id: string
  ) {
    const target =
      addresses.find(
        (item) =>
          item.id === id
      );

    let remaining =
      addresses.filter(
        (item) =>
          item.id !== id
      );

    if (
      target?.isDefault &&
      remaining.length > 0
    ) {
      remaining =
        remaining.map(
          (
            item,
            index
          ) => ({
            ...item,
            isDefault:
              index === 0,
          })
        );
    }

    persistAddresses(
      remaining
    );
  }

  /* =========================================================
     SET DEFAULT
  ========================================================= */

  function setDefaultAddress(
    id: string
  ) {
    const next =
      addresses.map(
        (item) => ({
          ...item,
          isDefault:
            item.id === id,
        })
      );

    persistAddresses(next);
  }

  /* =========================================================
     STYLES
  ========================================================= */

  const inputClass = `
    h-13
    w-full
    border
    border-black/15
    bg-[#f8f6f2]
    px-4
    text-sm
    outline-none
    transition
    focus:border-black
    sm:h-14
  `;

  const selectClass = `
    h-13
    w-full
    appearance-none
    border
    border-black/15
    bg-[#f8f6f2]
    px-4
    pr-10
    text-sm
    outline-none
    transition
    focus:border-black
    disabled:cursor-not-allowed
    disabled:opacity-40
    sm:h-14
  `;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-[#f8f6f2]">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/account"
            className="
              shrink-0
              font-serif
              text-2xl
              tracking-[0.18em]
              sm:text-3xl
              sm:tracking-[0.22em]
            "
          >
            LUMÉRA
          </Link>

          <Link
            href="/account"
            className="
              shrink-0
              text-[8px]
              tracking-[0.2em]
              text-black/50
              transition
              hover:text-black
              sm:text-[9px]
              sm:tracking-[0.25em]
            "
          >
            BACK TO ACCOUNT
          </Link>

        </div>

      </header>

      {/* PAGE */}

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16 md:px-10">

        {/* TITLE */}

        <div className="flex flex-col justify-between gap-7 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:pb-10">

          <div>

            <p className="text-[8px] tracking-[0.38em] text-black/35 sm:text-[9px] sm:tracking-[0.4em]">
              DELIVERY
            </p>

            <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl md:text-6xl">
              Addresses
            </h1>

            <p className="mt-4 max-w-lg text-xs leading-6 text-black/45 sm:text-sm">
              Save your delivery details
              for a faster and easier
              checkout.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              }

              setShowForm(
                !showForm
              );
            }}
            className="
              self-start
              bg-black
              px-7
              py-3.5
              text-[8px]
              tracking-[0.25em]
              text-white
              transition
              hover:bg-black/80
              sm:self-auto
              sm:px-9
              sm:py-4
              sm:text-[9px]
            "
          >
            {showForm
              ? "CLOSE"
              : "ADD NEW ADDRESS"}
          </button>

        </div>

        {/* FORM */}

        {showForm && (

          <form
            onSubmit={
              saveAddress
            }
            className="
              mt-8
              border
              border-black/10
              bg-white
              p-5
              sm:mt-10
              sm:p-8
              md:p-10
            "
          >

            <p className="text-[8px] tracking-[0.35em] text-black/35 sm:text-[9px] sm:tracking-[0.4em]">
              NEW DELIVERY ADDRESS
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Where should we deliver?
            </h2>

            {/* NAME + PHONE */}

            <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                  FULL NAME
                </label>

                <input
                  required
                  value={fullName}
                  onChange={(event) =>
                    setFullName(
                      event.target.value
                    )
                  }
                  placeholder="Full name"
                  autoComplete="name"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                  PHONE NUMBER
                </label>

                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="+81 90 0000 0000"
                  autoComplete="tel"
                  className={inputClass}
                />

              </div>

            </div>

            {/* COUNTRY */}

            <div className="mt-5 sm:mt-6">

              <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                COUNTRY
              </label>

              <div className="relative">

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
                  className={selectClass}
                >

                  <option value="">
                    Select country
                  </option>

                  {countries.map(
                    (country) => (
                      <option
                        key={
                          country.iso2
                        }
                        value={
                          country.iso2
                        }
                      >
                        {country.name}
                      </option>
                    )
                  )}

                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
                  ↓
                </span>

              </div>

            </div>

            {/* REGION */}

            <div className="mt-5 sm:mt-6">

              <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                {locationLabels.region}
              </label>

              <div className="relative">

                <select
                  required
                  value={region}
                  onChange={(event) => {

                    setRegion(
                      event.target.value
                    );

                    setCity("");
                    setDistrict("");

                  }}
                  disabled={
                    !selectedCountry ||
                    loadingRegions ||
                    regions.length === 0
                  }
                  className={selectClass}
                >

                  <option value="">
                    {!selectedCountry
                      ? "Select country first"
                      : loadingRegions
                        ? "Loading..."
                        : regions.length === 0
                          ? "No regions available"
                          : `Select ${locationLabels.region.toLowerCase()}`}
                  </option>

                  {regions.map(
                    (item) => (
                      <option
                        key={
                          item.name
                        }
                        value={
                          item.name
                        }
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
                  ↓
                </span>

              </div>

            </div>

            {/* CITY */}

            <div className="mt-5 sm:mt-6">

              <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                {locationLabels.city}
              </label>

              <div className="relative">

                <select
                  required
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  disabled={
                    !region ||
                    loadingCities ||
                    cities.length === 0
                  }
                  className={selectClass}
                >

                  <option value="">
                    {!region
                      ? `Select ${locationLabels.region.toLowerCase()} first`
                      : loadingCities
                        ? "Loading..."
                        : cities.length === 0
                          ? "No cities available"
                          : `Select ${locationLabels.city.toLowerCase()}`}
                  </option>

                  {cities.map(
                    (item) => (
                      <option
                        key={
                          item.name
                        }
                        value={
                          item.name
                        }
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
                  ↓
                </span>

              </div>

            </div>

            {/* DISTRICT */}

            <div className="mt-5 sm:mt-6">

              <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                {locationLabels.district}
              </label>

              <input
                value={district}
                onChange={(event) =>
                  setDistrict(
                    event.target.value
                  )
                }
                placeholder={
                  locationLabels.district.toLowerCase()
                }
                className={inputClass}
              />

            </div>

            {/* STREET + POSTAL */}

            <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 md:grid-cols-[1fr_220px]">

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                  STREET ADDRESS
                </label>

                <input
                  required
                  value={street}
                  onChange={(event) =>
                    setStreet(
                      event.target.value
                    )
                  }
                  placeholder="House number and street name"
                  autoComplete="street-address"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.2em] text-black/45 sm:text-[9px]">
                  {locationLabels.postal}
                </label>

                <input
                  value={postalCode}
                  onChange={(event) =>
                    setPostalCode(
                      event.target.value
                    )
                  }
                  placeholder={
                    countryCode === "JP"
                      ? "150-0001"
                      : countryCode === "US"
                        ? "10001"
                        : countryCode === "GB"
                          ? "SW1A 1AA"
                          : "Postal code"
                  }
                  autoComplete="postal-code"
                  className={inputClass}
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">

              <button
                type="submit"
                disabled={
                  saving ||
                  !selectedCountry
                }
                className="
                  w-full
                  bg-black
                  px-10
                  py-4
                  text-[8px]
                  tracking-[0.3em]
                  text-white
                  transition
                  hover:bg-black/80
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                  sm:text-[9px]
                "
              >
                {saving
                  ? "SAVING..."
                  : "SAVE ADDRESS"}
              </button>

              <button
                type="button"
                onClick={() => {

                  resetForm();

                  setShowForm(
                    false
                  );

                }}
                className="
                  w-full
                  px-8
                  py-4
                  text-[8px]
                  tracking-[0.25em]
                  text-black/50
                  transition
                  hover:text-black
                  sm:w-auto
                  sm:text-[9px]
                "
              >
                CANCEL
              </button>

            </div>

          </form>
        )}

        {/* SAVED ADDRESSES */}

        <div className="mt-10 sm:mt-14">

          {addresses.length === 0 ? (

            <div className="border border-black/10 bg-white px-6 py-20 text-center sm:px-10 sm:py-24">

              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-black/10 font-serif text-lg">
                +
              </div>

              <p className="mt-7 text-[8px] tracking-[0.35em] text-black/35 sm:text-[9px]">
                SAVED ADDRESSES
              </p>

              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                No addresses yet
              </h2>

              <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-black/45 sm:text-sm">
                Add a delivery address
                and checkout will be
                faster next time.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
                className="
                  mt-8
                  bg-black
                  px-9
                  py-4
                  text-[8px]
                  tracking-[0.3em]
                  text-white
                  sm:text-[9px]
                "
              >
                ADD ADDRESS
              </button>

            </div>

          ) : (

            <div>

              <div className="mb-5 flex items-center justify-between">

                <p className="text-[8px] tracking-[0.35em] text-black/35 sm:text-[9px]">
                  SAVED ADDRESSES
                </p>

                <p className="text-[9px] text-black/35">
                  {addresses.length}{" "}
                  {addresses.length === 1
                    ? "ADDRESS"
                    : "ADDRESSES"}
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {addresses.map(
                  (item) => (

                    <article
                      key={
                        item.id
                      }
                      className="
                        relative
                        border
                        border-black/10
                        bg-white
                        p-6
                        sm:p-8
                      "
                    >

                      {item.isDefault && (
                        <span className="
                          absolute
                          right-5
                          top-5
                          border
                          border-black/15
                          px-2.5
                          py-1.5
                          text-[7px]
                          tracking-[0.2em]
                          sm:right-7
                          sm:top-7
                          sm:text-[8px]
                        ">
                          DEFAULT
                        </span>
                      )}

                      <p className="text-[8px] tracking-[0.3em] text-black/35 sm:text-[9px]">
                        {item.country}
                      </p>

                      <h2 className="mt-5 pr-20 font-serif text-2xl sm:text-3xl">
                        {item.fullName}
                      </h2>

                      <p className="mt-2 text-xs text-black/50">
                        {item.phone}
                      </p>

                      <div className="mt-5 text-sm leading-7 text-black/60">

                        {item.street && (
                          <p>
                            {item.street}
                          </p>
                        )}

                        {item.district && (
                          <p>
                            {item.district}
                          </p>
                        )}

                        {item.city && (
                          <p>
                            {item.city}
                          </p>
                        )}

                        {item.region && (
                          <p>
                            {item.region}
                          </p>
                        )}

                        {item.postalCode && (
                          <p>
                            {item.postalCode}
                          </p>
                        )}

                        <p>
                          {item.country}
                        </p>

                      </div>

                      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-black/10 pt-5">

                        {!item.isDefault && (
                          <button
                            type="button"
                            onClick={() =>
                              setDefaultAddress(
                                item.id
                              )
                            }
                            className="
                              text-[8px]
                              tracking-[0.2em]
                              text-black/50
                              transition
                              hover:text-black
                              sm:text-[9px]
                            "
                          >
                            SET AS DEFAULT
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeAddress(
                              item.id
                            )
                          }
                          className="
                            text-[8px]
                            tracking-[0.2em]
                            text-black/40
                            transition
                            hover:text-black
                            sm:text-[9px]
                          "
                        >
                          REMOVE
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}