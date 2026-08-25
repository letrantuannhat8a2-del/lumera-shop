"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

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
    let cancelled = false;

    async function loadOrders() {
      const supabase = createClient();

      try {
        // ========================================
        // GET SESSION
        // ========================================

        const sessionRequest =
          supabase.auth.getSession();

        const sessionTimeout =
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  "SESSION_TIMEOUT"
                )
              );
            }, 10000);
          });

        const sessionResult =
          await Promise.race([
            sessionRequest,
            sessionTimeout,
          ]);

        if (cancelled) return;

        const user =
          sessionResult.data.session?.user;

        // ========================================
        // NOT LOGGED IN
        // ========================================

        if (!user) {
          router.replace(
            "/account/login"
          );
          return;
        }

        const userEmail =
          user.email ?? "";

        setEmail(userEmail);

        // ========================================
        // LOAD ORDERS
        // ========================================

        const ordersRequest =
          supabase
            .from("orders")
            .select(
              `
                id,
                order_number,
                created_at,
                total,
                currency,
                payment_status,
                order_status,
                items
              `
            )
            .eq(
              "email",
              userEmail
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

        const ordersTimeout =
          new Promise<never>(
            (_, reject) => {
              setTimeout(() => {
                reject(
                  new Error(
                    "ORDERS_TIMEOUT"
                  )
                );
              }, 15000);
            }
          );

        const result =
          await Promise.race([
            ordersRequest,
            ordersTimeout,
          ]);

        if (cancelled) return;

        const {
          data,
          error,
        } = result;

        if (error) {
          console.error(
            "Failed to load orders:",
            error
          );

          setOrders([]);
        } else {
          setOrders(
            (data ?? []) as Order[]
          );
        }
      } catch (error) {
        console.error(
          "Orders loading error:",
          error
        );

        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
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

  function getItems(
    order: Order
  ): OrderItem[] {
    if (
      !Array.isArray(
        order.items
      )
    ) {
      return [];
    }

    return order.items;
  }

  function getItemName(
    item: OrderItem
  ) {
    return (
      item.name ||
      item.title ||
      item.product_name ||
      "LUMÉRA Dress"
    );
  }

  function getItemSize(
    item: OrderItem
  ) {
    return item.size || "";
  }

  function getItemQuantity(
    item: OrderItem
  ) {
    return (
      item.quantity ??
      item.qty ??
      1
    );
  }

  function getItemImage(
    item: OrderItem
  ) {
    return (
      item.image ||
      item.image_url ||
      ""
    );
  }

  function getOrderStatus(
    order: Order
  ) {
    return (
      order.order_status ||
      order.payment_status ||
      "processing"
    ).toLowerCase();
  }

  function statusLabel(
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

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5">
        <p className="text-center text-[10px] tracking-[0.3em] text-black/40">
          LOADING ORDERS...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f6f2] text-black">

      {/* HEADER */}

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
              className="
                text-[8px]
                tracking-[0.16em]
                text-black/50
                transition
                hover:text-black
                sm:text-[10px]
                sm:tracking-[0.2em]
              "
            >
              MY ACCOUNT
            </Link>

            <Link
              href="/"
              className="
                text-[8px]
                tracking-[0.16em]
                text-black/50
                transition
                hover:text-black
                sm:text-[10px]
                sm:tracking-[0.2em]
              "
            >
              SHOP
            </Link>

          </div>

        </div>

      </header>

      {/* PAGE */}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 md:px-10 md:py-24">

        {/* TITLE */}

        <div className="max-w-2xl">

          <p className="text-[8px] tracking-[0.35em] text-black/40 sm:text-[9px] sm:tracking-[0.4em]">
            CUSTOMER ACCOUNT
          </p>

          <h1 className="mt-4 font-serif text-4xl sm:mt-5 sm:text-5xl md:text-6xl">
            My Orders
          </h1>

          <p className="mt-4 text-xs leading-6 text-black/50 sm:mt-5 sm:text-sm">
            View your LUMÉRA order history, payment
            status and delivery information.
          </p>

        </div>

        {/* SUMMARY */}

        <div className="mt-10 grid border-y border-black/10 bg-white sm:mt-14 md:grid-cols-3">

          <div className="border-b border-black/10 px-5 py-5 sm:px-6 sm:py-6 md:border-b-0 md:border-r">

            <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
              ACCOUNT
            </p>

            <p className="mt-2 truncate text-xs sm:mt-3 sm:text-sm">
              {email}
            </p>

          </div>

          <div className="border-b border-black/10 px-5 py-5 sm:px-6 sm:py-6 md:border-b-0 md:border-r">

            <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
              ORDERS
            </p>

            <p className="mt-2 font-serif text-xl sm:mt-3 sm:text-2xl">
              {orders.length}
            </p>

          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">

            <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
              ACCOUNT STATUS
            </p>

            <p className="mt-2 text-xs sm:mt-3 sm:text-sm">
              Active
            </p>

          </div>

        </div>

        {/* ORDER HISTORY */}

        <div className="mt-12 sm:mt-16">

          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4 sm:pb-5">

            <div>

              <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
                ORDER HISTORY
              </p>

              <h2 className="mt-1.5 font-serif text-xl sm:mt-2 sm:text-2xl">
                Your orders
              </h2>

            </div>

            <span className="shrink-0 text-[10px] text-black/40 sm:text-xs">
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>

          </div>

          {orders.length === 0 ? (

            <div className="border-b border-black/10 bg-white px-5 py-16 text-center sm:px-6 sm:py-24">

              <p className="font-serif text-2xl sm:text-3xl">
                No orders yet
              </p>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-black/50 sm:mt-4 sm:text-sm">
                You haven't placed an order with
                LUMÉRA yet. Discover our latest
                collection and find your next dress.
              </p>

              <Link
                href="/dresses"
                className="
                  mt-6
                  inline-block
                  bg-black
                  px-8
                  py-4
                  text-[9px]
                  tracking-[0.22em]
                  text-white
                  transition
                  hover:bg-black/80
                  sm:mt-8
                  sm:px-10
                  sm:text-[10px]
                  sm:tracking-[0.25em]
                "
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
                      className="overflow-hidden border border-black/10 bg-white transition hover:border-black/30"
                    >

                      <div className="grid gap-5 border-b border-black/10 px-5 py-5 sm:gap-6 sm:px-8 sm:py-7 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">

                        <div>

                          <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
                            ORDER NUMBER
                          </p>

                          <p className="mt-1.5 break-all font-serif text-lg sm:mt-2 sm:text-xl">
                            {order.order_number}
                          </p>

                        </div>

                        <div>

                          <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
                            DATE
                          </p>

                          <p className="mt-1.5 text-xs sm:mt-2 sm:text-sm">
                            {formatDate(
                              order.created_at
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-[8px] tracking-[0.28em] text-black/40 sm:text-[9px] sm:tracking-[0.3em]">
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

                      <div className="divide-y divide-black/10">

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
                                  key={
                                    item.id ||
                                    index
                                  }
                                  className="flex items-center justify-between gap-4 px-5 py-5 sm:gap-5 sm:px-8 sm:py-6"
                                >

                                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">

                                    {image ? (

                                      <div className="h-20 w-14 shrink-0 overflow-hidden bg-[#f8f6f2] sm:h-20 sm:w-16">

                                        <img
                                          src={image}
                                          alt={getItemName(
                                            item
                                          )}
                                          className="h-full w-full object-cover"
                                        />

                                      </div>

                                    ) : (

                                      <div className="flex h-20 w-14 shrink-0 items-center justify-center bg-[#f8f6f2] sm:w-16">

                                        <span className="text-[7px] tracking-[0.15em] text-black/30 sm:text-[8px] sm:tracking-[0.2em]">
                                          LUMÉRA
                                        </span>

                                      </div>

                                    )}

                                    <div className="min-w-0">

                                      <p className="truncate font-serif text-base sm:text-lg">
                                        {getItemName(
                                          item
                                        )}
                                      </p>

                                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[8px] tracking-[0.1em] text-black/40 sm:mt-2 sm:gap-4 sm:text-[10px] sm:tracking-[0.12em]">

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

                                  <p className="shrink-0 text-xs text-black/50 sm:text-sm">
                                    ×{" "}
                                    {quantity}
                                  </p>

                                </div>
                              );
                            }
                          )

                        ) : (

                          <div className="px-5 py-7 text-xs text-black/40 sm:px-8 sm:py-8 sm:text-sm">
                            Order details unavailable.
                          </div>

                        )}

                      </div>

                      <div className="flex flex-col gap-5 border-t border-black/10 px-5 py-5 sm:px-8 sm:py-5 md:flex-row md:items-center md:justify-between">

                        <div className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-6">

                          <p className="text-[8px] tracking-[0.16em] text-black/40 sm:text-[9px] sm:tracking-[0.2em]">

                            PAYMENT{" "}

                            <span className="text-black/70">
                              {(
                                order.payment_status ||
                                "pending"
                              ).toUpperCase()}
                            </span>

                          </p>

                          <p className="text-[8px] tracking-[0.16em] text-black/40 sm:text-[9px] sm:tracking-[0.2em]">

                            {items.length}{" "}

                            {items.length === 1
                              ? "ITEM"
                              : "ITEMS"}

                          </p>

                        </div>

                        <Link
                          href={`/account/orders/${order.order_number}`}
                          className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            border
                            border-black
                            px-6
                            py-3
                            text-[8px]
                            tracking-[0.2em]
                            transition
                            hover:bg-black
                            hover:text-white
                            sm:w-auto
                            sm:px-7
                            sm:text-[9px]
                            sm:tracking-[0.25em]
                          "
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

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">

          <Link
            href="/account"
            className="text-[9px] tracking-[0.2em] text-black/50 transition hover:text-black sm:text-[10px] sm:tracking-[0.25em]"
          >
            ← BACK TO MY ACCOUNT
          </Link>

          <Link
            href="/dresses"
            className="text-[9px] tracking-[0.2em] text-black/50 transition hover:text-black sm:text-[10px] sm:tracking-[0.25em]"
          >
            CONTINUE SHOPPING →
          </Link>

        </div>

      </section>

    </main>
  );
}