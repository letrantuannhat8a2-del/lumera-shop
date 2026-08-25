"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";


type Order = {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  currency: string;
  payment_status: string;
  status?: string | null;
  items: any;
  shipping_address?: any;
  customer_name?: string | null;
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const orderNumber =
    params.orderNumber as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [email, setEmail] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/account/orders/${encodeURIComponent(orderNumber)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (cancelled) return;

        if (response.status === 401) {
          router.replace("/account/login");
          return;
        }

        if (response.status === 404) {
          setOrder(null);
          return;
        }

        if (!response.ok) {
          console.error(
            "Order API error:",
            result
          );
          setOrder(null);
          return;
        }

        setEmail(result.email ?? "");
        setOrder(result.order as Order);
      } catch (error) {
        console.error(
          "Order loading error:",
          error
        );

        if (!cancelled) {
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (orderNumber) {
      loadOrder();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [orderNumber, router]);

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  function formatMoney(
    amount: number,
    currency: string
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          currency || "USD",
      }
    ).format(amount);
  }

  function getItems() {
    if (
      !order ||
      !Array.isArray(
        order.items
      )
    ) {
      return [];
    }

    return order.items;
  }

  function getItemName(
    item: any
  ) {
    return (
      item?.name ||
      item?.title ||
      item?.product_name ||
      item?.productName ||
      "LUMÉRA Dress"
    );
  }

  function getItemSize(
    item: any
  ) {
    return item?.size || "";
  }

  function getItemQuantity(
    item: any
  ) {
    return (
      item?.quantity ??
      item?.qty ??
      1
    );
  }

  function getItemPrice(
    item: any
  ) {
    return Number(
      item?.price ??
        item?.unit_price ??
        item?.amount ??
        0
    );
  }

  // ==================================================
  // GET PRODUCT IMAGE
  // ==================================================

  function getItemImage(
    item: any
  ): string | null {
    // ------------------------------------------
    // 1. Direct image fields
    // ------------------------------------------

    const directImage =
      item?.image ||
      item?.image_url ||
      item?.imageUrl ||
      item?.image_1 ||
      item?.image1 ||
      item?.thumbnail ||
      item?.thumbnail_url ||
      item?.thumbnailUrl ||
      item?.product_image ||
      item?.productImage;

    if (
      typeof directImage ===
        "string" &&
      directImage.trim()
    ) {
      return directImage.trim();
    }

    // ------------------------------------------
    // 2. Images array
    // ------------------------------------------

    if (
      Array.isArray(
        item?.images
      )
    ) {
      const firstImage =
        item.images.find(
          (image: any) =>
            typeof image ===
              "string" &&
            image.trim()
        );

      if (firstImage) {
        return firstImage.trim();
      }
    }

    // ------------------------------------------
    // 3. Images object
    // ------------------------------------------

    if (
      item?.images &&
      typeof item.images ===
        "object"
    ) {
      const objectImage =
        item.images?.image_1 ||
        item.images?.image ||
        item.images?.url ||
        item.images?.src;

      if (
        typeof objectImage ===
          "string" &&
        objectImage.trim()
      ) {
        return objectImage.trim();
      }
    }

    // ------------------------------------------
    // 4. Product nested object
    // ------------------------------------------

    const nestedProduct =
      item?.product;

    if (
      nestedProduct &&
      typeof nestedProduct ===
        "object"
    ) {
      const productImage =
        nestedProduct?.image ||
        nestedProduct?.image_url ||
        nestedProduct?.imageUrl ||
        nestedProduct?.image_1 ||
        nestedProduct?.thumbnail;

      if (
        typeof productImage ===
          "string" &&
        productImage.trim()
      ) {
        return productImage.trim();
      }

      if (
        Array.isArray(
          nestedProduct?.images
        )
      ) {
        const firstProductImage =
          nestedProduct.images.find(
            (image: any) =>
              typeof image ===
                "string" &&
              image.trim()
          );

        if (firstProductImage) {
          return firstProductImage.trim();
        }
      }
    }

    return null;
  }

  function getStatus() {
    return (
      order?.status ||
      order?.payment_status ||
      "processing"
    ).toLowerCase();
  }

  function getStatusLabel(
    status: string
  ) {
    return status
      .replaceAll(
        "_",
        " "
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  function getStatusStyle(
    status: string
  ) {
    switch (status) {
      case "paid":
      case "delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "shipped":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "processing":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "cancelled":
      case "canceled":
        return "border-red-200 bg-red-50 text-red-600";

      default:
        return "border-black/10 bg-[#f8f6f2] text-black/60";
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5">
        <p className="text-center text-[10px] tracking-[0.3em] text-black/40">
          LOADING ORDER...
        </p>
      </main>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#f8f6f2] text-black">
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">
            <Link
              href="/"
              className="shrink-0 font-serif text-2xl tracking-[0.2em] sm:text-3xl sm:tracking-[0.25em]"
            >
              LUMÉRA
            </Link>

            <Link
              href="/account/orders"
              className="text-[8px] tracking-[0.16em] text-black/50 hover:text-black sm:text-[10px] sm:tracking-[0.2em]"
            >
              MY ORDERS
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-xl px-5 py-20 text-center sm:px-6 sm:py-32">
          <p className="text-[8px] tracking-[0.3em] text-black/40 sm:text-[9px] sm:tracking-[0.35em]">
            ORDER NOT FOUND
          </p>

          <h1 className="mt-4 font-serif text-3xl sm:mt-5 sm:text-4xl">
            We couldn't find this order
          </h1>

          <p className="mt-4 text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
            This order may no longer exist or may
            not belong to the account currently
            signed in.
          </p>

          <Link
            href="/account/orders"
            className="mt-7 inline-block bg-black px-7 py-4 text-[9px] tracking-[0.22em] text-white sm:mt-8 sm:px-8 sm:text-[10px] sm:tracking-[0.25em]"
          >
            BACK TO MY ORDERS
          </Link>
        </section>
      </main>
    );
  }

  const items =
    getItems();

  const status =
    getStatus();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f6f2] text-black">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/"
            className="shrink-0 font-serif text-2xl tracking-[0.2em] sm:text-3xl sm:tracking-[0.25em]"
          >
            LUMÉRA
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">

            <Link
              href="/account"
              className="text-[8px] tracking-[0.16em] text-black/50 hover:text-black sm:text-[10px] sm:tracking-[0.2em]"
            >
              MY ACCOUNT
            </Link>

            <Link
              href="/account/orders"
              className="text-[8px] tracking-[0.16em] text-black/50 hover:text-black sm:text-[10px] sm:tracking-[0.2em]"
            >
              MY ORDERS
            </Link>

          </div>
        </div>
      </header>

      {/* ========================================
          CONTENT
      ======================================== */}

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 md:px-10 md:py-24">

        {/* BACK */}

        <Link
          href="/account/orders"
          className="text-[8px] tracking-[0.18em] text-black/40 transition hover:text-black sm:text-[10px] sm:tracking-[0.2em]"
        >
          ← BACK TO MY ORDERS
        </Link>

        {/* ======================================
            TITLE
        ====================================== */}

        <div className="mt-9 flex flex-col gap-5 border-b border-black/10 pb-8 sm:mt-12 sm:gap-6 sm:pb-10 md:flex-row md:items-end md:justify-between">

          <div className="min-w-0">

            <p className="text-[8px] tracking-[0.3em] text-black/40 sm:text-[9px] sm:tracking-[0.35em]">
              ORDER DETAILS
            </p>

            <h1 className="mt-3 break-all font-serif text-3xl sm:mt-4 sm:text-4xl md:text-5xl">
              {order.order_number}
            </h1>

            <p className="mt-2 text-xs text-black/50 sm:mt-3 sm:text-sm">
              Placed on{" "}
              {formatDate(
                order.created_at
              )}
            </p>

          </div>

          <span
            className={`inline-flex w-fit border px-4 py-2 text-[8px] tracking-[0.17em] sm:px-5 sm:text-[9px] sm:tracking-[0.2em] ${getStatusStyle(
              status
            )}`}
          >
            {getStatusLabel(
              status
            )}
          </span>

        </div>

        {/* ======================================
            ORDER PROGRESS
        ====================================== */}

        <div className="mt-8 border border-black/10 bg-white p-5 sm:mt-10 sm:p-6 md:p-8">

          <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
            ORDER STATUS
          </p>

          <div className="mt-7 grid grid-cols-3 sm:mt-8">

            {/* ORDERED */}

            <div className="relative min-w-0">

              <div className="flex items-center">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[10px] text-white sm:h-8 sm:w-8 sm:text-xs">
                  ✓
                </div>

                <div className="h-px flex-1 bg-black" />

              </div>

              <p className="mt-2 text-[7px] tracking-[0.1em] sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">
                ORDERED
              </p>

            </div>

            {/* SHIPPED */}

            <div className="relative min-w-0">

              <div className="flex items-center">

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] sm:h-8 sm:w-8 sm:text-xs ${
                    status === "shipped" ||
                    status === "delivered"
                      ? "bg-black text-white"
                      : "border border-black/20 bg-white text-black/30"
                  }`}
                >
                  {status === "shipped" ||
                  status === "delivered"
                    ? "✓"
                    : "2"}
                </div>

                <div
                  className={`h-px flex-1 ${
                    status === "delivered"
                      ? "bg-black"
                      : "bg-black/10"
                  }`}
                />

              </div>

              <p className="mt-2 text-[7px] tracking-[0.1em] sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">
                SHIPPED
              </p>

            </div>

            {/* DELIVERED */}

            <div className="min-w-0">

              <div className="flex items-center">

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] sm:h-8 sm:w-8 sm:text-xs ${
                    status === "delivered"
                      ? "bg-black text-white"
                      : "border border-black/20 bg-white text-black/30"
                  }`}
                >
                  {status === "delivered"
                    ? "✓"
                    : "3"}
                </div>

              </div>

              <p className="mt-2 text-[7px] tracking-[0.1em] sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">
                DELIVERED
              </p>

            </div>

          </div>

        </div>

        {/* ======================================
            PRODUCTS
        ====================================== */}

        <div className="mt-8 sm:mt-10">

          <div className="border-b border-black/10 pb-4 sm:pb-5">

            <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
              YOUR ITEMS
            </p>

            <h2 className="mt-1.5 font-serif text-xl sm:mt-2 sm:text-2xl">
              Order items
            </h2>

          </div>

          <div className="divide-y divide-black/10 border-b border-black/10 bg-white">

            {items.length > 0 ? (

              items.map(
                (
                  item: any,
                  index: number
                ) => {

                  const quantity =
                    getItemQuantity(
                      item
                    );

                  const price =
                    getItemPrice(
                      item
                    );

                  const image =
                    getItemImage(
                      item
                    );

                  return (
                    <div
                      key={index}
                      className="
                        flex
                        flex-col
                        gap-4
                        px-5
                        py-5
                        sm:gap-5
                        sm:px-8
                        sm:py-7
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >

                      {/* PRODUCT */}

                      <div className="flex min-w-0 items-center gap-3 sm:gap-5">

                        {/* ==================================
                            PRODUCT IMAGE
                        ================================== */}

                        <div
                          className="
                            relative
                            h-24
                            w-20
                            shrink-0
                            overflow-hidden
                            bg-[#f8f6f2]
                            sm:h-28
                            sm:w-24
                          "
                        >

                          {image ? (

                            <Image
                              src={image}
                              alt={getItemName(
                                item
                              )}
                              fill
                              sizes="
                                (max-width: 640px) 80px,
                                96px
                              "
                              className="
                                object-cover
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                              "
                            >
                              <span
                                className="
                                  text-[7px]
                                  tracking-[0.15em]
                                  text-black/30
                                  sm:text-[8px]
                                  sm:tracking-[0.2em]
                                "
                              >
                                LUMÉRA
                              </span>
                            </div>

                          )}

                        </div>

                        {/* INFO */}

                        <div className="min-w-0">

                          <p className="truncate font-serif text-base sm:text-xl">
                            {getItemName(
                              item
                            )}
                          </p>

                          {getItemSize(
                            item
                          ) && (
                            <p className="mt-1.5 text-[8px] tracking-[0.12em] text-black/40 sm:mt-2 sm:text-[10px] sm:tracking-[0.15em]">
                              SIZE{" "}
                              {getItemSize(
                                item
                              )}
                            </p>
                          )}

                          <p className="mt-1 text-[8px] tracking-[0.12em] text-black/40 sm:text-[10px] sm:tracking-[0.15em]">
                            QTY{" "}
                            {quantity}
                          </p>

                        </div>

                      </div>

                      {/* PRICE */}

                      <p className="text-xs sm:text-sm">

                        {price > 0
                          ? formatMoney(
                              price *
                                quantity,
                              order.currency
                            )
                          : `× ${quantity}`}

                      </p>

                    </div>
                  );
                }
              )

            ) : (

              <div className="px-5 py-8 text-xs text-black/40 sm:px-8 sm:py-10 sm:text-sm">
                No item information available.
              </div>

            )}

          </div>

        </div>

        {/* ======================================
            SUMMARY + PAYMENT
        ====================================== */}

        <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 md:grid-cols-2">

          {/* PAYMENT */}

          <div>

            <p className="border-b border-black/10 pb-4 text-[8px] tracking-[0.28em] text-black/40 sm:pb-5 sm:text-[9px] sm:tracking-[0.3em]">
              PAYMENT
            </p>

            <div className="bg-white p-5 sm:p-6 md:p-8">

              <div className="flex justify-between gap-5">

                <span className="text-xs text-black/50 sm:text-sm">
                  Payment status
                </span>

                <span className="text-xs sm:text-sm">
                  {(
                    order.payment_status ||
                    "pending"
                  ).toUpperCase()}
                </span>

              </div>

            </div>

          </div>

          {/* TOTAL */}

          <div>

            <p className="border-b border-black/10 pb-4 text-[8px] tracking-[0.28em] text-black/40 sm:pb-5 sm:text-[9px] sm:tracking-[0.3em]">
              ORDER SUMMARY
            </p>

            <div className="bg-white p-5 sm:p-6 md:p-8">

              <div className="flex justify-between gap-5">

                <span className="text-xs text-black/50 sm:text-sm">
                  Total
                </span>

                <span className="font-serif text-lg sm:text-xl">
                  {formatMoney(
                    Number(
                      order.total
                    ),
                    order.currency
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            SHIPPING
        ====================================== */}

        <div className="mt-8 sm:mt-10">

          <p className="border-b border-black/10 pb-4 text-[8px] tracking-[0.28em] text-black/40 sm:pb-5 sm:text-[9px] sm:tracking-[0.3em]">
            DELIVERY INFORMATION
          </p>

          <div className="bg-white p-5 sm:p-6 md:p-8">

            {order.shipping_address ? (

              <div className="break-words text-xs leading-7 text-black/60 sm:text-sm">

                {typeof order.shipping_address ===
                "string" ? (

                  <p>
                    {
                      order.shipping_address
                    }
                  </p>

                ) : (

                  <>

                    {order.shipping_address
                      ?.name && (
                      <p className="text-black">
                        {
                          order.shipping_address
                            .name
                        }
                      </p>
                    )}

                    {order.shipping_address
                      ?.address && (
                      <p>
                        {
                          order.shipping_address
                            .address
                        }
                      </p>
                    )}

                    {(order.shipping_address
                      ?.city ||
                      order.shipping_address
                        ?.province) && (

                      <p>

                        {
                          order.shipping_address
                            ?.city
                        }

                        {order.shipping_address
                          ?.city &&
                        order.shipping_address
                          ?.province
                          ? ", "
                          : ""}

                        {
                          order.shipping_address
                            ?.province
                        }

                      </p>

                    )}

                    {order.shipping_address
                      ?.phone && (
                      <p className="mt-2">
                        {
                          order.shipping_address
                            .phone
                        }
                      </p>
                    )}

                  </>

                )}

              </div>

            ) : (

              <p className="text-xs text-black/40 sm:text-sm">
                Delivery information is not
                available for this order.
              </p>

            )}

          </div>

        </div>

        {/* ======================================
            ACCOUNT EMAIL
        ====================================== */}

        <div className="mt-8 border-t border-black/10 pt-6 sm:mt-10 sm:pt-8">

          <p className="text-[8px] tracking-[0.22em] text-black/40 sm:text-[9px] sm:tracking-[0.25em]">
            ORDER PLACED BY
          </p>

          <p className="mt-1.5 break-all text-xs text-black/60 sm:mt-2 sm:text-sm">
            {email}
          </p>

        </div>

        {/* ======================================
            BOTTOM NAV
        ====================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-6">

          <Link
            href="/account/orders"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              bg-black
              px-7
              py-4
              text-[9px]
              tracking-[0.22em]
              text-white
              transition
              hover:bg-black/80
              sm:w-auto
              sm:px-8
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            BACK TO MY ORDERS
          </Link>

          <Link
            href="/dresses"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              border
              border-black
              px-7
              py-4
              text-[9px]
              tracking-[0.22em]
              transition
              hover:bg-black
              hover:text-white
              sm:w-auto
              sm:px-8
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            CONTINUE SHOPPING
          </Link>

        </div>

      </section>

    </main>
  );
}