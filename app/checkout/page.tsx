"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import PayPalCheckout from "../components/PayPalCheckout";
import { useCart } from "../context/CartContext";
import { createClient } from "../lib/supabase/client";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  district: string;
  postalCode: string;
};

type SavedAddress = {
  id: string;
  user_id: string;

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

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();

  const [shippingMethod, setShippingMethod] =
    useState<"standard" | "express">(
      "standard"
    );

  const [formData, setFormData] =
    useState<CheckoutFormData>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",

      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateRegion: "",
      district: "",
      postalCode: "",
    });

  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const expressShippingFee = 57.42;

  const shippingFee =
    shippingMethod === "express"
      ? expressShippingFee
      : 0;

  const total =
    subtotal + shippingFee;

  // =====================================================
  // FORMAT USD
  // =====================================================

  const formatUSD = (
    value: number
  ) =>
    new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(value);

  // =====================================================
  // LOAD CURRENT USER + SAVED ADDRESSES
  // =====================================================

  useEffect(() => {
    async function loadAddresses() {
      try {
        setLoadingAddresses(true);

        const supabase =
          createClient();

        // -----------------------------------------------
        // GET CURRENT USER
        // -----------------------------------------------

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (user?.email) {
          setFormData(
            (current) => ({
              ...current,

              email:
                current.email ||
                user.email ||
                "",
            })
          );
        }

        // -----------------------------------------------
        // GET SAVED ADDRESSES
        // -----------------------------------------------

        const response =
          await fetch(
            "/api/addresses",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          console.error(
            "Failed to load saved addresses:",
            result
          );

          return;
        }

        const addresses: SavedAddress[] =
          Array.isArray(
            result.addresses
          )
            ? result.addresses
            : [];

        setSavedAddresses(
          addresses
        );

        // -----------------------------------------------
        // AUTO SELECT DEFAULT
        // -----------------------------------------------

        const defaultAddress =
          addresses.find(
            (address) =>
              address.is_default
          ) ??
          addresses[0];

        if (defaultAddress) {
          setSelectedAddressId(
            defaultAddress.id
          );

          applySavedAddress(
            defaultAddress
          );
        }
      } catch (error) {
        console.error(
          "Load addresses error:",
          error
        );
      } finally {
        setLoadingAddresses(
          false
        );
      }
    }

    loadAddresses();
  }, []);

  // =====================================================
  // APPLY SAVED ADDRESS
  // =====================================================

  function applySavedAddress(
    address: SavedAddress
  ) {
    const nameParts =
      address.full_name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const firstName =
      nameParts.length > 0
        ? nameParts[0]
        : "";

    const lastName =
      nameParts.length > 1
        ? nameParts
            .slice(1)
            .join(" ")
        : "";

    setFormData(
      (current) => ({
        ...current,

        firstName:
          firstName ||
          current.firstName,

        lastName:
          lastName ||
          current.lastName,

        phone:
          address.phone ||
          current.phone,

        country:
          address.country ||
          current.country,

        addressLine1:
          address.street ||
          current.addressLine1,

        addressLine2:
          current.addressLine2,

        city:
          address.city ||
          current.city,

        stateRegion:
          address.region ||
          current.stateRegion,

        district:
          address.district ||
          current.district,

        postalCode:
          address.postal_code ||
          current.postalCode,
      })
    );
  }

  // =====================================================
  // SELECT SAVED ADDRESS
  // =====================================================

  function handleSavedAddressChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const addressId =
      event.target.value;

    setSelectedAddressId(
      addressId
    );

    if (!addressId) {
      return;
    }

    const address =
      savedAddresses.find(
        (item) =>
          item.id === addressId
      );

    if (address) {
      applySavedAddress(
        address
      );
    }
  }

  // =====================================================
  // FORM CHANGE
  // =====================================================

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    // User manually edits
    // the saved address.
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "phone" ||
      name === "country" ||
      name === "addressLine1" ||
      name === "addressLine2" ||
      name === "city" ||
      name === "stateRegion" ||
      name === "district" ||
      name === "postalCode"
    ) {
      setSelectedAddressId("");
    }
  }

  // =====================================================
  // FORM VALIDATION
  // =====================================================

  const isFormComplete =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.country.trim() !== "" &&
    formData.addressLine1.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.postalCode.trim() !== "";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcf8f6] text-[#211d1d]">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header active="shop" />

      {/* =================================================
          TITLE
      ================================================= */}

      <section className="border-b border-[#211d1d]/10 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-14 lg:pb-16 lg:pt-20">

        <p className="text-[9px] tracking-[0.35em] text-[#a88989] sm:text-[10px]">
          VIREL · SECURE CHECKOUT
        </p>

        <div className="mt-4 flex items-end justify-between gap-5">

          <h1 className="font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
            Checkout
          </h1>

          <Link
            href="/cart"
            className="hidden pb-1 text-[9px] tracking-[0.2em] text-[#756b6b] underline underline-offset-4 transition hover:text-[#211d1d] sm:block"
          >
            RETURN TO BAG
          </Link>

        </div>

      </section>

      {/* =================================================
          EMPTY CART
      ================================================= */}

      {cart.length === 0 ? (

        <section className="px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-14 lg:px-14">

          <div className="mx-auto max-w-2xl border border-[#211d1d]/10 bg-white px-6 py-20 text-center sm:px-10 sm:py-28">

            <p className="text-[9px] tracking-[0.3em] text-[#a88989]">
              VIREL
            </p>

            <h2 className="mt-4 font-serif text-2xl sm:text-3xl">
              Your shopping bag is empty
            </h2>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#756b6b] sm:text-sm">
              Discover our collection of bridal shoes,
              sculptural heels and refined silhouettes.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center justify-center bg-[#211d1d] px-9 py-4 text-[9px] tracking-[0.25em] text-white transition duration-300 hover:bg-[#a88989] sm:px-11 sm:py-5"
            >
              SHOP SHOES
            </Link>

          </div>

        </section>

      ) : (

        /* =================================================
           CHECKOUT CONTENT
        ================================================= */

        <section className="grid grid-cols-1 gap-10 px-5 pb-24 pt-8 sm:gap-14 sm:px-8 sm:pb-28 sm:pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-14">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="min-w-0">

            {/* =================================================
                CONTACT
            ================================================= */}

            <div className="border-t border-[#211d1d]/10 pt-7 sm:pt-8">

              <div className="flex items-baseline justify-between gap-4">

                <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                  CONTACT INFORMATION
                </h2>

                <span className="text-[8px] tracking-[0.15em] text-[#a88989]">
                  VIREL
                </span>

              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">

                <input
                  name="firstName"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="First name *"
                  autoComplete="given-name"
                  className="min-w-0 border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                <input
                  name="lastName"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="Last name *"
                  autoComplete="family-name"
                  className="min-w-0 border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                <input
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  type="email"
                  placeholder="Email address *"
                  autoComplete="email"
                  className="min-w-0 border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                <input
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  type="tel"
                  placeholder="Phone number *"
                  autoComplete="tel"
                  className="min-w-0 border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

              </div>

            </div>

            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            {savedAddresses.length > 0 && (

              <div className="mt-10 border-t border-[#211d1d]/10 pt-7 sm:mt-12 sm:pt-8">

                <div className="flex items-baseline justify-between gap-4">

                  <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                    SAVED ADDRESS
                  </h2>

                  <Link
                    href="/account/addresses"
                    className="text-[8px] tracking-[0.15em] text-[#756b6b] underline underline-offset-4 sm:text-[9px]"
                  >
                    MANAGE
                  </Link>

                </div>

                <div className="mt-6">

                  <select
                    value={
                      selectedAddressId
                    }
                    onChange={
                      handleSavedAddressChange
                    }
                    disabled={
                      loadingAddresses
                    }
                    className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                  >

                    <option value="">
                      Use a saved address
                    </option>

                    {savedAddresses.map(
                      (
                        address: SavedAddress
                      ) => (

                        <option
                          key={
                            address.id
                          }
                          value={
                            address.id
                          }
                        >
                          {
                            address.full_name
                          }

                          {" · "}

                          {
                            address.city ||
                            address.country
                          }

                          {address.is_default
                            ? " · Default"
                            : ""}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

            )}

            {/* =================================================
                SHIPPING ADDRESS
            ================================================= */}

            <div className="mt-10 border-t border-[#211d1d]/10 pt-7 sm:mt-12 sm:pt-8">

              <div className="flex items-baseline justify-between gap-4">

                <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                  SHIPPING ADDRESS
                </h2>

                {loadingAddresses && (
                  <span className="text-[8px] tracking-[0.15em] text-[#a88989]">
                    LOADING...
                  </span>
                )}

              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">

                {/* COUNTRY */}

                <select
                  name="country"
                  value={
                    formData.country
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:col-span-2 sm:px-5 sm:py-4"
                >

                  <option value="">
                    Country / Region *
                  </option>

                  <option value="United States">
                    United States
                  </option>

                  <option value="United Kingdom">
                    United Kingdom
                  </option>

                  <option value="Canada">
                    Canada
                  </option>

                  <option value="Australia">
                    Australia
                  </option>

                  <option value="Singapore">
                    Singapore
                  </option>

                  <option value="Japan">
                    Japan
                  </option>

                  <option value="South Korea">
                    South Korea
                  </option>

                  <option value="France">
                    France
                  </option>

                  <option value="Germany">
                    Germany
                  </option>

                  <option value="Italy">
                    Italy
                  </option>

                  <option value="Spain">
                    Spain
                  </option>

                  <option value="Netherlands">
                    Netherlands
                  </option>

                  <option value="Switzerland">
                    Switzerland
                  </option>

                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>

                  <option value="New Zealand">
                    New Zealand
                  </option>

                  <option value="Sweden">
                    Sweden
                  </option>

                  <option value="Norway">
                    Norway
                  </option>

                  <option value="Denmark">
                    Denmark
                  </option>

                  <option value="Finland">
                    Finland
                  </option>

                  <option value="Ireland">
                    Ireland
                  </option>

                  <option value="Thailand">
                    Thailand
                  </option>

                </select>

                {/* STREET */}

                <input
                  name="addressLine1"
                  value={
                    formData.addressLine1
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="Street address *"
                  autoComplete="street-address"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:col-span-2 sm:px-5 sm:py-4"
                />

                {/* ADDRESS LINE 2 */}

                <input
                  name="addressLine2"
                  value={
                    formData.addressLine2
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  autoComplete="address-line2"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:col-span-2 sm:px-5 sm:py-4"
                />

                {/* CITY */}

                <input
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="City *"
                  autoComplete="address-level2"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                {/* REGION */}

                <input
                  name="stateRegion"
                  value={
                    formData.stateRegion
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="State / Province / Region"
                  autoComplete="address-level1"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                {/* DISTRICT */}

                <input
                  name="district"
                  value={
                    formData.district
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="District / Area (optional)"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

                {/* POSTAL */}

                <input
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleChange
                  }
                  type="text"
                  placeholder="Postal / ZIP code *"
                  autoComplete="postal-code"
                  className="w-full border border-[#211d1d]/15 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#211d1d] sm:px-5 sm:py-4"
                />

              </div>

              <p className="mt-3 text-[10px] text-[#a89c9c] sm:mt-4 sm:text-[11px]">
                Fields marked with * are required.
              </p>

            </div>

            {/* =================================================
                SHIPPING METHOD
            ================================================= */}

            <div className="mt-10 border-t border-[#211d1d]/10 pt-7 sm:mt-12 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                SHIPPING METHOD
              </h2>

              <div className="mt-6 space-y-3 sm:mt-7">

                {/* STANDARD */}

                <label
                  className={`flex cursor-pointer items-start justify-between gap-4 border bg-white p-4 transition sm:items-center sm:p-5 ${
                    shippingMethod ===
                    "standard"
                      ? "border-[#211d1d]"
                      : "border-[#211d1d]/15"
                  }`}
                >

                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod ===
                        "standard"
                      }
                      onChange={() =>
                        setShippingMethod(
                          "standard"
                        )
                      }
                      className="mt-1 shrink-0 accent-[#211d1d] sm:mt-0"
                    />

                    <div className="min-w-0">

                      <p className="text-xs font-medium sm:text-sm">
                        Standard Shipping
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#8c8181] sm:text-xs">
                        International standard delivery
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 text-xs font-medium sm:text-sm">
                    FREE
                  </p>

                </label>

                {/* EXPRESS */}

                <label
                  className={`flex cursor-pointer items-start justify-between gap-4 border bg-white p-4 transition sm:items-center sm:p-5 ${
                    shippingMethod ===
                    "express"
                      ? "border-[#211d1d]"
                      : "border-[#211d1d]/15"
                  }`}
                >

                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod ===
                        "express"
                      }
                      onChange={() =>
                        setShippingMethod(
                          "express"
                        )
                      }
                      className="mt-1 shrink-0 accent-[#211d1d] sm:mt-0"
                    />

                    <div className="min-w-0">

                      <p className="text-xs font-medium sm:text-sm">
                        Express Shipping
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#8c8181] sm:text-xs">
                        Priority international delivery
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 text-xs font-medium sm:text-sm">
                    $57.42
                  </p>

                </label>

              </div>

            </div>

            {/* =================================================
                PAYMENT METHOD
            ================================================= */}

            <div className="mt-10 border-t border-[#211d1d]/10 pt-7 sm:mt-12 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                PAYMENT METHOD
              </h2>

              <div className="mt-6 border border-[#211d1d]/15 bg-white p-4 sm:mt-7 sm:p-5">

                <div className="flex items-start gap-3 sm:items-center sm:gap-4">

                  <input
                    type="radio"
                    checked
                    readOnly
                    className="accent-[#211d1d]"
                  />

                  <div>

                    <p className="text-xs font-medium sm:text-sm">
                      PayPal
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#8c8181] sm:text-xs">
                      Secure payment via PayPal.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                PAYPAL
            ================================================= */}

            <div className="mt-8 sm:mt-10">

              {isFormComplete ? (

                <PayPalCheckout
                  total={total}
                  subtotal={subtotal}
                  shippingFee={
                    shippingFee
                  }
                  shippingMethod={
                    shippingMethod
                  }
                  formData={formData}
                  items={cart}
                />

              ) : (

                <div className="flex min-h-[54px] w-full items-center justify-center bg-[#e8dfdc] px-4 py-3 text-center text-[9px] tracking-[0.16em] text-[#756b6b] sm:text-[10px]">
                  COMPLETE SHIPPING INFORMATION
                </div>

              )}

            </div>

          </div>


          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">

            <div className="border border-[#211d1d]/10 bg-white">

              {/* SUMMARY HEADER */}

              <div className="border-b border-[#211d1d]/10 bg-[#f7ece9] px-5 py-5 sm:px-7 sm:py-6">

                <p className="text-[9px] tracking-[0.3em] text-[#a88989]">
                  VIREL
                </p>

                <h2 className="mt-2 font-serif text-xl sm:text-2xl">
                  Order Summary
                </h2>

              </div>

              <div className="px-5 py-6 sm:px-7 sm:py-8">

                {/* =================================================
                    ITEMS
                ================================================= */}

                <div className="space-y-5 sm:space-y-6">

                  {cart.map(
                    (item) => (

                      <div
                        key={`${item.id}-${item.color}-${item.size}`}
                        className="flex gap-3 border-b border-[#211d1d]/10 pb-5 sm:gap-5 sm:pb-6"
                      >

                        {/* IMAGE */}

                        <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-[#eee5e1] sm:h-32 sm:w-24">

                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className="object-cover"
                          />

                        </div>


                        {/* DETAILS */}

                        <div className="flex min-w-0 flex-1 justify-between gap-3 sm:gap-5">

                          <div className="min-w-0">

                            <h3 className="font-serif text-base sm:text-xl">
                              {item.name}
                            </h3>


                            {/* COLOR */}

                            <p className="mt-1.5 text-[10px] text-[#8c8181] sm:mt-2 sm:text-xs">
                              Color:{" "}
                              {item.color}
                            </p>


                            {/* SIZE */}

                            <p className="mt-1 text-[10px] text-[#8c8181] sm:text-xs">
                              Size:{" "}
                              {item.size}
                            </p>


                            {/* QUANTITY */}

                            <p className="mt-1 text-[10px] text-[#8c8181] sm:text-xs">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                          </div>


                          {/* ITEM TOTAL */}

                          <p className="shrink-0 text-[10px] sm:text-sm">
                            {formatUSD(
                              item.price *
                                item.quantity
                            )}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>


                {/* =================================================
                    TOTALS
                ================================================= */}

                <div className="mt-6 space-y-4 text-xs sm:mt-7 sm:space-y-5 sm:text-sm">

                  {/* SUBTOTAL */}

                  <div className="flex justify-between gap-4">

                    <span className="text-[#756b6b]">
                      Subtotal
                    </span>

                    <span>
                      {formatUSD(
                        subtotal
                      )}
                    </span>

                  </div>


                  {/* SHIPPING */}

                  <div className="flex justify-between gap-4">

                    <span className="text-[#756b6b]">
                      Shipping
                    </span>

                    <span>
                      {shippingFee ===
                      0
                        ? "FREE"
                        : formatUSD(
                            shippingFee
                          )}
                    </span>

                  </div>


                  {/* TOTAL */}

                  <div className="flex justify-between gap-4 border-t border-[#211d1d]/10 pt-5 text-sm font-medium sm:pt-6 sm:text-base">

                    <span>
                      TOTAL
                    </span>

                    <span>
                      {formatUSD(
                        total
                      )}
                    </span>

                  </div>

                </div>


                {/* =================================================
                    TRUST
                ================================================= */}

                <div className="mt-7 border-t border-[#211d1d]/10 pt-6">

                  <p className="text-center text-[8px] tracking-[0.2em] text-[#a88989] sm:text-[9px]">
                    SECURE · REFINED · VIREL
                  </p>

                  <p className="mt-2 text-center text-[10px] leading-5 text-[#8c8181] sm:text-xs">
                    Your payment information is securely
                    processed by PayPal.
                  </p>

                </div>


                {/* =================================================
                    RETURN
                ================================================= */}

                <Link
                  href="/cart"
                  className="mt-6 block text-center text-[9px] tracking-[0.15em] text-[#756b6b] underline underline-offset-4 transition hover:text-[#211d1d] sm:mt-7 sm:text-[10px]"
                >
                  RETURN TO BAG
                </Link>

              </div>

            </div>


            {/* =================================================
                SHIPPING MESSAGE
            ================================================= */}

            <div className="mt-4 border border-[#211d1d]/10 bg-[#f5e8e5] px-5 py-5 text-center sm:px-7">

              <p className="text-[8px] tracking-[0.2em] text-[#8d7171] sm:text-[9px]">
                COMPLIMENTARY SHIPPING
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#756b6b] sm:text-xs">
                Enjoy complimentary standard shipping
                on qualifying orders.
              </p>

            </div>

          </aside>

        </section>

      )}

    </main>
  );
}