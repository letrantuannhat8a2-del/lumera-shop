"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Header from "../components/Header";
import PayPalCheckout from "../components/PayPalCheckout";
import { useCart } from "../context/CartContext";

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
  postalCode: string;
};

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();

  const [shippingMethod, setShippingMethod] =
    useState<"standard" | "express">("standard");

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
      postalCode: "",
    });

  const expressShippingFee = 57.42;

  const shippingFee =
    shippingMethod === "express"
      ? expressShippingFee
      : 0;

  const total = subtotal + shippingFee;

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const isFormComplete =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.country.trim() !== "" &&
    formData.addressLine1.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.postalCode.trim() !== "";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf9f7] text-black">

      <Header />

      {/* ========================================
          TITLE
      ======================================== */}

      <section className="px-5 pb-9 pt-11 sm:px-8 sm:pb-10 sm:pt-14 lg:px-12">

        <p className="text-[9px] tracking-[0.3em] text-gray-400 sm:text-xs">
          SECURE CHECKOUT
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:mt-4 sm:text-5xl">
          Checkout
        </h1>

      </section>


      {/* ========================================
          EMPTY CART
      ======================================== */}

      {cart.length === 0 ? (

        <section className="px-5 pb-20 sm:px-8 sm:pb-32 lg:px-12">

          <div className="border-t border-black/10 py-16 text-center sm:py-20">

            <p className="text-sm sm:text-lg">
              Your shopping bag is empty.
            </p>

            <Link
              href="/dresses"
              className="
                mt-7
                inline-block
                bg-black
                px-8
                py-4
                text-[10px]
                tracking-[0.2em]
                text-white
                transition
                hover:bg-neutral-800
                sm:mt-8
                sm:px-10
                sm:text-xs
              "
            >
              SHOP DRESSES
            </Link>

          </div>

        </section>

      ) : (

        /* ========================================
           CHECKOUT CONTENT
        ======================================== */

        <section className="grid grid-cols-1 gap-10 px-5 pb-20 sm:gap-14 sm:px-8 sm:pb-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-12 lg:pb-28">

          {/* ======================================
              LEFT
          ====================================== */}

          <div className="min-w-0">

            {/* ====================================
                CONTACT
            ==================================== */}

            <div className="border-t border-black/10 pt-7 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                CONTACT INFORMATION
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-5">

                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="First name *"
                  className="min-w-0 border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last name *"
                  className="min-w-0 border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email address *"
                  className="min-w-0 border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone number"
                  className="min-w-0 border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />

              </div>

            </div>


            {/* ====================================
                ADDRESS
            ==================================== */}

            <div className="mt-10 border-t border-black/10 pt-7 sm:mt-12 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                SHIPPING ADDRESS
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-5">

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:col-span-2 sm:px-5 sm:py-4"
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

                  <option value="Other">
                    Other
                  </option>

                </select>


                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  type="text"
                  placeholder="Street address *"
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:col-span-2 sm:px-5 sm:py-4"
                />


                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:col-span-2 sm:px-5 sm:py-4"
                />


                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  placeholder="City *"
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />


                <input
                  name="stateRegion"
                  value={formData.stateRegion}
                  onChange={handleChange}
                  type="text"
                  placeholder="State / Province / Region"
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />


                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  type="text"
                  placeholder="Postal / ZIP code *"
                  className="w-full border border-black/20 bg-white px-4 py-3.5 text-sm outline-none focus:border-black sm:px-5 sm:py-4"
                />

              </div>

              <p className="mt-3 text-[10px] text-gray-400 sm:mt-4 sm:text-[11px]">
                Fields marked with * are required.
              </p>

            </div>


            {/* ====================================
                SHIPPING
            ==================================== */}

            <div className="mt-10 border-t border-black/10 pt-7 sm:mt-12 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                SHIPPING METHOD
              </h2>

              <div className="mt-6 space-y-3 sm:mt-7">

                {/* STANDARD */}

                <label
                  className={`flex cursor-pointer items-start justify-between gap-4 border bg-white p-4 sm:items-center sm:p-5 ${
                    shippingMethod === "standard"
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >

                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod === "standard"
                      }
                      onChange={() =>
                        setShippingMethod(
                          "standard"
                        )
                      }
                      className="mt-1 shrink-0 sm:mt-0"
                    />

                    <div className="min-w-0">

                      <p className="text-xs font-medium sm:text-sm">
                        Standard Shipping
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-gray-500 sm:text-xs">
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
                  className={`flex cursor-pointer items-start justify-between gap-4 border bg-white p-4 sm:items-center sm:p-5 ${
                    shippingMethod === "express"
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >

                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod === "express"
                      }
                      onChange={() =>
                        setShippingMethod(
                          "express"
                        )
                      }
                      className="mt-1 shrink-0 sm:mt-0"
                    />

                    <div className="min-w-0">

                      <p className="text-xs font-medium sm:text-sm">
                        Express Shipping
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-gray-500 sm:text-xs">
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


            {/* ====================================
                PAYMENT
            ==================================== */}

            <div className="mt-10 border-t border-black/10 pt-7 sm:mt-12 sm:pt-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                PAYMENT METHOD
              </h2>

              <div className="mt-6 border border-black bg-white p-4 sm:mt-7 sm:p-5">

                <div className="flex items-start gap-3 sm:items-center sm:gap-4">

                  <input
                    type="radio"
                    checked
                    readOnly
                  />

                  <div>

                    <p className="text-xs font-medium sm:text-sm">
                      PayPal
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-gray-500 sm:text-xs">
                      Secure payment via PayPal.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* ====================================
                PAYPAL
            ==================================== */}

            <div className="mt-8 sm:mt-10">

              {isFormComplete ? (

                <PayPalCheckout
                  total={total}
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  shippingMethod={shippingMethod}
                  formData={formData}
                  items={cart}
                />

              ) : (

                <div className="flex min-h-[52px] w-full items-center justify-center bg-gray-300 px-4 py-3 text-center text-[9px] leading-4 tracking-[0.14em] text-gray-500 sm:text-xs sm:tracking-[0.18em]">
                  COMPLETE SHIPPING INFORMATION
                </div>

              )}

            </div>

          </div>


          {/* ======================================
              RIGHT — ORDER SUMMARY
          ====================================== */}

          <div className="min-w-0 lg:sticky lg:top-10 lg:self-start">

            <div className="bg-white p-5 sm:p-8">

              <h2 className="text-[10px] tracking-[0.2em] sm:text-sm">
                ORDER SUMMARY
              </h2>


              {/* ITEMS */}

              <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">

                {cart.map((item) => (

                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3 border-b border-black/10 pb-5 sm:gap-5 sm:pb-6"
                  >

                    <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-[#eee9e3] sm:h-32 sm:w-24">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="
                          (max-width: 640px) 80px,
                          96px
                        "
                        className="object-cover"
                      />

                    </div>


                    <div className="flex min-w-0 flex-1 justify-between gap-3 sm:gap-5">

                      <div className="min-w-0">

                        <h3 className="truncate font-serif text-base sm:text-xl">
                          {item.name}
                        </h3>

                        <p className="mt-1.5 text-[10px] text-gray-500 sm:mt-2 sm:text-xs">
                          Size: {item.size}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                          Quantity: {item.quantity}
                        </p>

                      </div>


                      <p className="shrink-0 text-[10px] sm:text-sm">
                        {formatUSD(
                          item.price *
                            item.quantity
                        )}
                      </p>

                    </div>

                  </div>

                ))}

              </div>


              {/* TOTALS */}

              <div className="mt-6 space-y-4 text-xs sm:mt-7 sm:space-y-5 sm:text-sm">

                <div className="flex justify-between gap-4">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatUSD(
                      subtotal
                    )}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shippingFee === 0
                      ? "FREE"
                      : formatUSD(
                          shippingFee
                        )}
                  </span>

                </div>


                <div className="flex justify-between gap-4 border-t border-black/10 pt-5 text-sm font-medium sm:pt-6 sm:text-base">

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


              {/* RETURN */}

              <Link
                href="/cart"
                className="
                  mt-6
                  block
                  text-center
                  text-[10px]
                  underline
                  underline-offset-4
                  sm:mt-7
                  sm:text-xs
                "
              >
                RETURN TO BAG
              </Link>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}