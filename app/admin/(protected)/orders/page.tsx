import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;

  color?: string;
  size: string;
  quantity: number;
};

export default async function AdminOrdersPage() {
  // =====================================================
  // CHECK LOGIN
  // =====================================================

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // =====================================================
  // CHECK ADMIN
  // =====================================================

  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email !== adminEmail
  ) {
    redirect("/admin/login");
  }

  // =====================================================
  // GET ORDERS
  // =====================================================

  const {
    data: orders,
    error,
  } =
    await supabaseAdmin
      .from("orders")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Unable to load orders:",
      error
    );
  }

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
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    value: string
  ) => {
    try {
      return new Date(
        value
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] tracking-[0.3em] text-gray-400 sm:text-[10px]">
              VIREL MANAGEMENT
            </p>

            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Orders
            </h2>

            <p className="mt-3 text-xs leading-5 text-gray-400">
              Manage customer purchases,
              payments and fulfillment.
            </p>

          </div>

          <div className="border border-black/10 bg-white px-5 py-4 sm:px-6">

            <p className="text-[9px] tracking-[0.2em] text-gray-400">
              TOTAL ORDERS
            </p>

            <p className="mt-1 font-serif text-2xl">
              {orders?.length ?? 0}
            </p>

          </div>

        </div>


        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mt-10 sm:mt-12">

          {!orders ||
          orders.length === 0 ? (

            /* =============================================
               EMPTY
            ============================================= */

            <div className="border border-black/10 bg-white px-6 py-20 text-center sm:py-28">

              <p className="text-[9px] tracking-[0.3em] text-gray-400">
                VIREL ORDERS
              </p>

              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                No orders yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-gray-400 sm:text-sm">
                New customer orders will appear
                here after a successful payment.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {orders.map(
                (order) => {

                  const items =
                    Array.isArray(
                      order.items
                    )
                      ? (
                          order.items as OrderItem[]
                        )
                      : [];

                  const firstItem =
                    items[0];

                  const itemCount =
                    items.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        Number(
                          item.quantity ||
                            0
                        ),
                      0
                    );

                  return (

                    <div
                      key={order.id}
                      className="border border-black/10 bg-white"
                    >

                      {/* =================================
                          ORDER TOP
                      ================================= */}

                      <div className="flex flex-col gap-5 border-b border-black/10 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <Link
                              href={`/admin/orders/${order.order_number}`}
                              className="text-sm font-medium underline-offset-4 hover:underline sm:text-base"
                            >
                              {order.order_number}
                            </Link>

                            <span className="text-[9px] tracking-[0.15em] text-gray-400">
                              {formatDate(
                                order.created_at
                              )}
                            </span>

                          </div>

                          <p className="mt-2 text-xs text-gray-400">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </p>

                        </div>


                        {/* STATUS */}

                        <div className="flex flex-wrap gap-2">

                          <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-2 text-[9px] tracking-[0.12em] text-green-700">
                            {String(
                              order.payment_status ||
                                "UNKNOWN"
                            ).toUpperCase()}
                          </span>

                          <span className="inline-flex w-fit rounded-full bg-[#f2eee7] px-3 py-2 text-[9px] tracking-[0.12em]">
                            {String(
                              order.order_status ||
                                "UNKNOWN"
                            ).toUpperCase()}
                          </span>

                        </div>

                      </div>


                      {/* =================================
                          ORDER BODY
                      ================================= */}

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto]">

                        {/* =================================
                            CUSTOMER
                        ================================= */}

                        <div className="border-b border-black/10 px-5 py-6 lg:border-b-0 lg:border-r lg:px-6">

                          <p className="text-[9px] tracking-[0.2em] text-gray-400">
                            CUSTOMER
                          </p>

                          <p className="mt-4 text-sm">
                            {order.first_name}{" "}
                            {order.last_name}
                          </p>

                          <p className="mt-2 break-all text-xs text-gray-400">
                            {order.email}
                          </p>

                          {order.phone && (
                            <p className="mt-1 text-xs text-gray-400">
                              {order.phone}
                            </p>
                          )}

                        </div>


                        {/* =================================
                            FIRST ITEM
                        ================================= */}

                        <div className="border-b border-black/10 px-5 py-6 lg:border-b-0 lg:border-r lg:px-6">

                          <p className="text-[9px] tracking-[0.2em] text-gray-400">
                            ITEMS
                          </p>

                          {firstItem ? (

                            <div className="mt-4">

                              <p className="text-sm">
                                {firstItem.name}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">

                                <span>
                                  Color:{" "}
                                  {firstItem.color ||
                                    "Ivory"}
                                </span>

                                <span>
                                  Size:{" "}
                                  {firstItem.size}
                                </span>

                                <span>
                                  Qty:{" "}
                                  {firstItem.quantity}
                                </span>

                              </div>


                              {/* MORE ITEMS */}

                              {items.length >
                                1 && (

                                <p className="mt-3 text-[9px] tracking-[0.12em] text-[#a88989]">
                                  +{" "}
                                  {items.length -
                                    1}{" "}
                                  MORE ITEM
                                  {items.length -
                                    1 >
                                  1
                                    ? "S"
                                    : ""}
                                </p>

                              )}

                            </div>

                          ) : (

                            <p className="mt-4 text-sm text-gray-400">
                              No item information
                            </p>

                          )}

                        </div>


                        {/* =================================
                            TOTAL + ACTION
                        ================================= */}

                        <div className="flex flex-col justify-between gap-6 px-5 py-6 sm:flex-row sm:items-center lg:min-w-[220px] lg:flex-col lg:items-end lg:px-6">

                          <div className="text-left sm:text-right lg:text-right">

                            <p className="text-[9px] tracking-[0.2em] text-gray-400">
                              TOTAL
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                              {formatUSD(
                                Number(
                                  order.total
                                )
                              )}
                            </p>

                          </div>


                          <div className="flex items-center gap-4">

                            <Link
                              href="/admin/chat"
                              className="text-[9px] tracking-[0.18em] text-gray-400 transition hover:text-black"
                            >
                              CHAT
                            </Link>

                            <Link
                              href={`/admin/orders/${order.order_number}`}
                              className="bg-black px-5 py-3 text-[9px] tracking-[0.18em] text-white transition hover:bg-[#a88989]"
                            >
                              VIEW ORDER
                            </Link>

                          </div>

                        </div>

                      </div>


                      {/* =================================
                          MULTIPLE ITEMS
                      ================================= */}

                      {items.length >
                        1 && (

                        <div className="border-t border-black/10 bg-[#faf9f6] px-5 py-5 sm:px-6">

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

                            {items.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={`${item.id}-${item.color || "Ivory"}-${item.size}-${index}`}
                                  className="border border-black/10 bg-white px-4 py-4"
                                >

                                  <p className="text-xs">
                                    {item.name}
                                  </p>

                                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400">

                                    <span>
                                      {item.color ||
                                        "Ivory"}
                                    </span>

                                    <span>
                                      Size{" "}
                                      {item.size}
                                    </span>

                                    <span>
                                      Qty{" "}
                                      {item.quantity}
                                    </span>

                                  </div>

                                  <p className="mt-3 text-xs">
                                    {formatUSD(
                                      Number(
                                        item.price
                                      ) *
                                        Number(
                                          item.quantity
                                        )
                                    )}
                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}