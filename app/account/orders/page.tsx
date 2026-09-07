"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderItem = {
  id?: string;
  name?: string;
  title?: string;
  product_name?: string;
  size?: string;
  quantity?: number;
  qty?: number;
  image?: string;
  image_url?: string;
  price?: number;
};

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  currency: string;
  payment_status: string;
  order_status: string | null;
  items: OrderItem[] | null;
};

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setLoading(true);

      try {
        const response = await fetch(
          "/api/account/orders",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result =
          await response.json();

        console.log(
          "VIREL MY ORDERS RESPONSE:",
          result
        );

        if (!mounted) {
          return;
        }

        if (response.status === 401) {
          router.replace(
            "/account/login"
          );

          return;
        }

        if (!response.ok) {
          console.error(
            "Orders API error:",
            result
          );

          setOrders([]);

          return;
        }

        setEmail(
          result?.email ?? ""
        );

        const receivedOrders =
          Array.isArray(
            result?.orders
          )
            ? result.orders
            : [];

        setOrders(
          receivedOrders as Order[]
        );

      } catch (error) {
        console.error(
          "Orders loading error:",
          error
        );

        if (mounted) {
          setOrders([]);
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [router]);

  // ========================================
  // FORMAT DATE
  // ========================================

  function formatDate(
    date: string
  ) {
    if (!date) {
      return "—";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  // ========================================
  // FORMAT MONEY
  // ========================================

  function formatMoney(
    amount: number,
    currency: string
  ) {
    const safeAmount =
      Number(amount) || 0;

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          currency || "USD",
      }
    ).format(safeAmount);
  }

  // ========================================
  // GET ITEMS
  // ========================================

  function getItems(
    order: Order
  ): OrderItem[] {
    if (
      !Array.isArray(
        order?.items
      )
    ) {
      return [];
    }

    return order.items;
  }

  // ========================================
  // ITEM NAME
  // ========================================

  function getItemName(
    item: OrderItem
  ) {
    return (
      item.name ||
      item.title ||
      item.product_name ||
      "VIREL Shoe"
    );
  }

  // ========================================
  // ITEM SIZE
  // ========================================

  function getItemSize(
    item: OrderItem
  ) {
    return item.size || "";
  }

  // ========================================
  // ITEM QUANTITY
  // ========================================

  function getItemQuantity(
    item: OrderItem
  ) {
    const quantity =
      Number(
        item.quantity ??
          item.qty ??
          1
      );

    return quantity > 0
      ? quantity
      : 1;
  }

  // ========================================
  // ITEM IMAGE
  // ========================================

  function getItemImage(
    item: OrderItem
  ) {
    return (
      item.image ||
      item.image_url ||
      ""
    );
  }

  // ========================================
  // ORDER STATUS
  // ========================================

  function getOrderStatus(
    order: Order
  ) {
    return (
      order.order_status ||
      order.payment_status ||
      "processing"
    ).toLowerCase();
  }

  // ========================================
  // STATUS LABEL
  // ========================================

  function statusLabel(
    status: string
  ) {
    return status
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  // ========================================
  // STATUS STYLE
  // ========================================

  function getStatusStyle(
    status: string
  ) {
    switch (status) {
      case "paid":
      case "delivered":
        return "border-[#b8d7c0] bg-[#f0f8f2] text-[#52755b]";

      case "shipped":
        return "border-[#b9cddd] bg-[#f1f6fa] text-[#58718a]";

      case "processing":
      case "pending":
        return "border-[#ddc9a4] bg-[#faf6ec] text-[#90774d]";

      case "cancelled":
      case "canceled":
        return "border-[#dfbcbc] bg-[#fbf0f0] text-[#9b5e5e]";

      default:
        return "border-[#211d1d]/10 bg-[#f8f2f0] text-[#211d1d]/60";
    }
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf8f6] px-5">

        <div className="text-center">

          <p className="text-[9px] tracking-[0.35em] text-[#a88989]">
            VIREL
          </p>

          <p className="mt-3 text-[10px] tracking-[0.3em] text-[#211d1d]/40">
            LOADING ORDERS...
          </p>

          <div className="mx-auto mt-5 h-px w-10 bg-[#211d1d]/20" />

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-[#211d1d]/10 bg-white">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/"
            className="shrink-0 font-serif text-2xl tracking-[0.25em] sm:text-3xl sm:tracking-[0.3em]"
          >
            VIREL
          </Link>

          <div className="flex items-center gap-4 sm:gap-7">

            <Link
              href="/account"
              className="text-[8px] tracking-[0.16em] text-[#211d1d]/50 transition hover:text-[#211d1d] sm:text-[10px] sm:tracking-[0.2em]"
            >
              MY ACCOUNT
            </Link>

            <Link
              href="/shop"
              className="text-[8px] tracking-[0.16em] text-[#211d1d]/50 transition hover:text-[#211d1d] sm:text-[10px] sm:tracking-[0.2em]"
            >
              SHOP
            </Link>

          </div>

        </div>

      </header>


      {/* ========================================
          PAGE
      ======================================== */}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 md:px-10 md:py-24">

        {/* TITLE */}

        <div className="max-w-2xl">

          <p className="text-[8px] tracking-[0.4em] text-[#a88989] sm:text-[9px]">
            VIREL · CUSTOMER ACCOUNT
          </p>

          <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl md:text-6xl">
            My Orders
          </h1>

          <p className="mt-4 text-xs leading-6 text-[#756b6b] sm:mt-5 sm:text-sm sm:leading-7">
            View your VIREL order history,
            payment status and delivery information.
          </p>

        </div>


        {/* ========================================
            ACCOUNT SUMMARY
        ======================================== */}

        <div className="mt-10 grid border border-[#211d1d]/10 bg-white sm:mt-14 md:grid-cols-3">

          {/* ACCOUNT */}

          <div className="border-b border-[#211d1d]/10 px-5 py-5 sm:px-6 sm:py-6 md:border-b-0 md:border-r">

            <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
              ACCOUNT
            </p>

            <p className="mt-2 truncate text-xs sm:mt-3 sm:text-sm">
              {email || "—"}
            </p>

          </div>


          {/* ORDERS */}

          <div className="border-b border-[#211d1d]/10 px-5 py-5 sm:px-6 sm:py-6 md:border-b-0 md:border-r">

            <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
              ORDERS
            </p>

            <p className="mt-2 font-serif text-xl sm:mt-3 sm:text-2xl">
              {orders.length}
            </p>

          </div>


          {/* STATUS */}

          <div className="px-5 py-5 sm:px-6 sm:py-6">

            <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
              ACCOUNT STATUS
            </p>

            <p className="mt-2 text-xs sm:mt-3 sm:text-sm">
              Active
            </p>

          </div>

        </div>


        {/* ========================================
            ORDER HISTORY
        ======================================== */}

        <div className="mt-12 sm:mt-16">

          <div className="flex items-end justify-between gap-4 border-b border-[#211d1d]/10 pb-4 sm:pb-5">

            <div>

              <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
                ORDER HISTORY
              </p>

              <h2 className="mt-1.5 font-serif text-xl sm:mt-2 sm:text-2xl">
                Your orders
              </h2>

            </div>

            <span className="shrink-0 text-[10px] text-[#211d1d]/40 sm:text-xs">
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>

          </div>


          {/* ======================================
              NO ORDERS
          ====================================== */}

          {orders.length === 0 ? (

            <div className="border-b border-[#211d1d]/10 bg-white px-5 py-16 text-center sm:px-6 sm:py-24">

              <p className="text-[8px] tracking-[0.35em] text-[#a88989]">
                VIREL
              </p>

              <p className="mt-4 font-serif text-2xl sm:text-3xl">
                No orders yet
              </p>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-[#756b6b] sm:mt-4 sm:text-sm">
                You haven't placed an order with
                VIREL yet. Discover our collection
                and find your next pair.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block bg-[#211d1d] px-8 py-4 text-[9px] tracking-[0.22em] text-white transition hover:bg-[#a88989] sm:mt-8 sm:px-10 sm:text-[10px] sm:tracking-[0.25em]"
              >
                SHOP COLLECTION
              </Link>

            </div>

          ) : (

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">

              {orders.map(
                (order) => {

                  const items =
                    getItems(order);

                  const status =
                    getOrderStatus(
                      order
                    );

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden border border-[#211d1d]/10 bg-white transition hover:border-[#a88989]/50"
                    >

                      {/* ==================================
                          ORDER HEADER
                      ================================== */}

                      <div className="grid gap-5 border-b border-[#211d1d]/10 px-5 py-5 sm:gap-6 sm:px-8 sm:py-7 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">

                        <div>

                          <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
                            ORDER NUMBER
                          </p>

                          <p className="mt-1.5 break-all font-serif text-lg sm:mt-2 sm:text-xl">
                            {order.order_number}
                          </p>

                        </div>


                        <div>

                          <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
                            DATE
                          </p>

                          <p className="mt-1.5 text-xs sm:mt-2 sm:text-sm">
                            {formatDate(
                              order.created_at
                            )}
                          </p>

                        </div>


                        <div>

                          <p className="text-[8px] tracking-[0.3em] text-[#a88989] sm:text-[9px]">
                            TOTAL
                          </p>

                          <p className="mt-1.5 text-xs sm:mt-2 sm:text-sm">
                            {formatMoney(
                              Number(
                                order.total
                              ),
                              order.currency
                            )}
                          </p>

                        </div>


                        <div>

                          <span
                            className={`inline-flex border px-3 py-2 text-[8px] tracking-[0.12em] sm:px-4 sm:text-[9px] sm:tracking-[0.15em] ${getStatusStyle(
                              status
                            )}`}
                          >
                            {statusLabel(
                              status
                            )}
                          </span>

                        </div>

                      </div>


                      {/* ==================================
                          ITEMS
                      ================================== */}

                      <div className="divide-y divide-[#211d1d]/10">

                        {items.length > 0 ? (

                          items.map(
                            (
                              item,
                              index
                            ) => {

                              const image =
                                getItemImage(
                                  item
                                );

                              const quantity =
                                getItemQuantity(
                                  item
                                );

                              return (
                                <div
                                  key={`${order.id}-${item.id ?? index}-${index}`}
                                  className="flex items-center justify-between gap-4 px-5 py-5 sm:gap-5 sm:px-8 sm:py-6"
                                >

                                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">

                                    {image ? (

                                      <div className="h-20 w-14 shrink-0 overflow-hidden bg-[#f5ece9] sm:h-20 sm:w-16">

                                        <img
                                          src={image}
                                          alt={getItemName(
                                            item
                                          )}
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                        />

                                      </div>

                                    ) : (

                                      <div className="flex h-20 w-14 shrink-0 items-center justify-center bg-[#f5ece9] sm:w-16">

                                        <span className="text-[7px] tracking-[0.15em] text-[#a88989] sm:text-[8px] sm:tracking-[0.2em]">
                                          VIREL
                                        </span>

                                      </div>

                                    )}


                                    <div className="min-w-0">

                                      <p className="truncate font-serif text-base sm:text-lg">
                                        {getItemName(
                                          item
                                        )}
                                      </p>

                                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[8px] tracking-[0.1em] text-[#8d8080] sm:mt-2 sm:gap-4 sm:text-[10px] sm:tracking-[0.12em]">

                                        {getItemSize(
                                          item
                                        ) && (
                                          <span>
                                            SIZE{" "}
                                            {getItemSize(
                                              item
                                            )}
                                          </span>
                                        )}

                                        <span>
                                          QTY{" "}
                                          {quantity}
                                        </span>

                                      </div>

                                    </div>

                                  </div>


                                  <p className="shrink-0 text-xs text-[#756b6b] sm:text-sm">
                                    ×{" "}
                                    {quantity}
                                  </p>

                                </div>
                              );
                            }
                          )

                        ) : (

                          <div className="px-5 py-7 text-xs text-[#756b6b] sm:px-8 sm:py-8 sm:text-sm">
                            Order details unavailable.
                          </div>

                        )}

                      </div>


                      {/* ==================================
                          ORDER FOOTER
                      ================================== */}

                      <div className="flex flex-col gap-5 border-t border-[#211d1d]/10 px-5 py-5 sm:px-8 sm:py-5 md:flex-row md:items-center md:justify-between">

                        <div className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-6">

                          <p className="text-[8px] tracking-[0.16em] text-[#8d8080] sm:text-[9px] sm:tracking-[0.2em]">

                            PAYMENT{" "}

                            <span className="text-[#211d1d]/70">
                              {(
                                order.payment_status ||
                                "pending"
                              ).toUpperCase()}
                            </span>

                          </p>

                          <p className="text-[8px] tracking-[0.16em] text-[#8d8080] sm:text-[9px] sm:tracking-[0.2em]">

                            {items.length}{" "}

                            {items.length === 1
                              ? "ITEM"
                              : "ITEMS"}

                          </p>

                        </div>


                        <Link
                          href={`/account/orders/${encodeURIComponent(
                            order.order_number
                          )}`}
                          className="inline-flex w-full items-center justify-center border border-[#211d1d] px-6 py-3 text-[8px] tracking-[0.2em] transition hover:bg-[#211d1d] hover:text-white sm:w-auto sm:px-7 sm:text-[9px] sm:tracking-[0.25em]"
                        >
                          VIEW ORDER
                        </Link>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </div>


        {/* ========================================
            BOTTOM LINKS
        ======================================== */}

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">

          <Link
            href="/account"
            className="text-[9px] tracking-[0.2em] text-[#756b6b] transition hover:text-[#211d1d] sm:text-[10px] sm:tracking-[0.25em]"
          >
            ← BACK TO MY ACCOUNT
          </Link>

          <Link
            href="/shop"
            className="text-[9px] tracking-[0.2em] text-[#756b6b] transition hover:text-[#211d1d] sm:text-[10px] sm:tracking-[0.25em]"
          >
            CONTINUE SHOPPING →
          </Link>

        </div>

      </section>

    </main>
  );
}