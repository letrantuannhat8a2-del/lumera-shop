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
    <main className="min-h-screen bg-[#faf9f7] text-black">
      <Header />

      {/* TITLE */}
      <section className="px-12 pb-10 pt-14">
        <p className="text-xs tracking-[0.3em] text-gray-400">
          SECURE CHECKOUT
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Checkout
        </h1>
      </section>

      {cart.length === 0 ? (
        <section className="px-12 pb-32">
          <div className="border-t border-black/10 py-20 text-center">
            <p className="text-lg">
              Your shopping bag is empty.
            </p>

            <Link
              href="/dresses"
              className="mt-8 inline-block bg-black px-10 py-4 text-xs tracking-[0.2em] text-white"
            >
              SHOP DRESSES
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-16 px-12 pb-28 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT */}
          <div>

            {/* CONTACT */}
            <div className="border-t border-black/10 pt-8">
              <h2 className="text-sm tracking-[0.2em]">
                CONTACT INFORMATION
              </h2>

              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="First name *"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last name *"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email address *"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone number"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

              </div>
            </div>

            {/* ADDRESS */}
            <div className="mt-12 border-t border-black/10 pt-8">

              <h2 className="text-sm tracking-[0.2em]">
                SHIPPING ADDRESS
              </h2>

              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black md:col-span-2"
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
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black md:col-span-2"
                />

                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black md:col-span-2"
                />

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  placeholder="City *"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

                <input
                  name="stateRegion"
                  value={formData.stateRegion}
                  onChange={handleChange}
                  type="text"
                  placeholder="State / Province / Region"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  type="text"
                  placeholder="Postal / ZIP code *"
                  className="border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
                />

              </div>

              <p className="mt-4 text-[11px] text-gray-400">
                Fields marked with * are required.
              </p>
            </div>

            {/* SHIPPING */}
            <div className="mt-12 border-t border-black/10 pt-8">

              <h2 className="text-sm tracking-[0.2em]">
                SHIPPING METHOD
              </h2>

              <div className="mt-7 space-y-3">

                <label
                  className={`flex cursor-pointer items-center justify-between border bg-white p-5 ${
                    shippingMethod === "standard"
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod === "standard"
                      }
                      onChange={() =>
                        setShippingMethod("standard")
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Standard Shipping
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        International standard delivery
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium">
                    FREE
                  </p>
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between border bg-white p-5 ${
                    shippingMethod === "express"
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={
                        shippingMethod === "express"
                      }
                      onChange={() =>
                        setShippingMethod("express")
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Express Shipping
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Priority international delivery
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium">
                    $57.42
                  </p>
                </label>

              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-12 border-t border-black/10 pt-8">
              <h2 className="text-sm tracking-[0.2em]">
                PAYMENT METHOD
              </h2>

              <div className="mt-7 border border-black bg-white p-5">

                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    checked
                    readOnly
                  />

                  <div>
                    <p className="text-sm font-medium">
                      PayPal
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Secure payment via PayPal.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* PAYPAL */}
            <div className="mt-10">

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
                <div className="flex h-[52px] w-full items-center justify-center bg-gray-300 text-xs tracking-[0.18em] text-gray-500">
                  COMPLETE SHIPPING INFORMATION
                </div>
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-10 lg:self-start">

            <div className="bg-white p-8">

              <h2 className="text-sm tracking-[0.2em]">
                ORDER SUMMARY
              </h2>

              <div className="mt-8 space-y-6">

                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-5 border-b border-black/10 pb-6"
                  >
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-[#eee9e3]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 justify-between gap-5">

                      <div>
                        <h3 className="font-serif text-xl">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs text-gray-500">
                          Size: {item.size}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm">
                        {formatUSD(
                          item.price *
                            item.quantity
                        )}
                      </p>

                    </div>
                  </div>
                ))}

              </div>

              <div className="mt-7 space-y-5 text-sm">

                <div className="flex justify-between">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatUSD(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Shipping
                  </span>

                  <span>
                    {shippingFee === 0
                      ? "FREE"
                      : formatUSD(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-black/10 pt-6 text-base font-medium">

                  <span>
                    TOTAL
                  </span>

                  <span>
                    {formatUSD(total)}
                  </span>

                </div>

              </div>

              <Link
                href="/cart"
                className="mt-7 block text-center text-xs underline underline-offset-4"
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