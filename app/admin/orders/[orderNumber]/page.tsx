import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { sendOrderStatusEmail } from "../../../lib/email";
import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type PageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: PageProps) {
  // CHECK ADMIN LOGIN
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email !== adminEmail
  ) {
    redirect("/admin/login");
  }

  const { orderNumber } =
    await params;

  // GET ORDER
  const {
    data: order,
    error,
  } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq(
      "order_number",
      orderNumber
    )
    .single();

  if (error || !order) {
    notFound();
  }

  // ==========================
  // UPDATE ORDER STATUS
  // ==========================

  async function updateOrderStatus(
    formData: FormData
  ) {
    "use server";

    // CHECK ADMIN AGAIN
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const adminEmail =
      process.env.ADMIN_EMAIL;

    if (
      !user ||
      !adminEmail ||
      user.email !== adminEmail
    ) {
      redirect("/admin/login");
    }

    const newStatus =
      formData.get("status");

    const allowedStatuses = [
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      typeof newStatus !== "string" ||
      !allowedStatuses.includes(
        newStatus
      )
    ) {
      return;
    }

    // KHÔNG UPDATE/GỬI EMAIL
    // NẾU STATUS KHÔNG THAY ĐỔI
    if (
      newStatus ===
      order.order_status
    ) {
      return;
    }

    // UPDATE SUPABASE
    const {
      data: updatedOrder,
      error: updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        order_status:
          newStatus,
      })
      .eq(
        "order_number",
        orderNumber
      )
      .select()
      .single();

    if (
      updateError ||
      !updatedOrder
    ) {
      console.error(
        "Unable to update order:",
        updateError
      );

      return;
    }

    // ==========================
    // SEND STATUS EMAIL
    // ==========================

    if (
      newStatus === "shipped" ||
      newStatus === "delivered" ||
      newStatus === "cancelled"
    ) {
      try {
        await sendOrderStatusEmail({
          order_number:
            updatedOrder.order_number,

          first_name:
            updatedOrder.first_name,

          email:
            updatedOrder.email,

          order_status:
            updatedOrder.order_status,
        });

        console.log(
          `Order status email sent: ${newStatus}`
        );
      } catch (
        emailError
      ) {
        console.error(
          "Order status email error:",
          emailError
        );
      }
    }

    revalidatePath(
      `/admin/orders/${orderNumber}`
    );

    revalidatePath(
      "/admin/orders"
    );
  }

  // ==========================
  // ORDER ITEMS
  // ==========================

  const items: OrderItem[] =
    Array.isArray(order.items)
      ? (order.items as OrderItem[])
      : [];

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

  const orderDate =
    new Date(
      order.created_at
    ).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* HEADER */}
      <header className="border-b border-black/10 px-10 py-7">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="font-serif text-2xl tracking-[0.25em]">
              LUMÉRA
            </h1>

            <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
              ADMINISTRATION
            </p>

          </div>

          <Link
            href="/admin/orders"
            className="text-[10px] tracking-[0.2em] underline underline-offset-4"
          >
            ← BACK TO ORDERS
          </Link>

        </div>

      </header>

      <section className="mx-auto max-w-[1400px] px-10 py-12">

        {/* ORDER TITLE */}
        <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-10 md:flex-row md:items-end">

          <div>

            <p className="text-[10px] tracking-[0.3em] text-gray-400">
              ORDER DETAILS
            </p>

            <h2 className="mt-3 font-serif text-5xl">
              {order.order_number}
            </h2>

            <p className="mt-4 text-sm text-gray-500">
              Placed on{" "}
              {orderDate}
            </p>

          </div>

          <div className="flex gap-3">

            <span className="rounded-full bg-green-50 px-4 py-2 text-[10px] tracking-[0.15em] text-green-700">
              {String(
                order.payment_status
              ).toUpperCase()}
            </span>

            <span className="rounded-full bg-[#eee9e1] px-4 py-2 text-[10px] tracking-[0.15em]">
              {String(
                order.order_status
              ).toUpperCase()}
            </span>

          </div>

        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* ITEMS */}
            <div className="bg-white p-8">

              <h3 className="text-[11px] tracking-[0.25em]">
                ORDER ITEMS
              </h3>

              <div className="mt-7">

                {items.map(
                  (item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-6 border-b border-black/10 py-6 first:pt-0 last:border-b-0 last:pb-0"
                    >

                      <div className="relative h-40 w-28 shrink-0 overflow-hidden bg-[#eee9e3]">

                        <Image
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          fill
                          sizes="112px"
                          className="object-cover"
                        />

                      </div>

                      <div className="flex flex-1 justify-between gap-8">

                        <div>

                          <p className="font-serif text-2xl">
                            {
                              item.name
                            }
                          </p>

                          <p className="mt-3 text-sm text-gray-500">
                            Size:{" "}
                            {
                              item.size
                            }
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Unit price:{" "}
                            {formatUSD(
                              Number(
                                item.price
                              )
                            )}
                          </p>

                        </div>

                        <p className="text-sm font-medium">
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

                    </div>
                  )
                )}

              </div>

            </div>

            {/* CUSTOMER */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

              <div className="bg-white p-8">

                <h3 className="text-[11px] tracking-[0.25em]">
                  CUSTOMER
                </h3>

                <div className="mt-7 space-y-3 text-sm">

                  <p className="font-medium">
                    {
                      order.first_name
                    }{" "}
                    {
                      order.last_name
                    }
                  </p>

                  <p className="text-gray-500">
                    {
                      order.email
                    }
                  </p>

                  <p className="text-gray-500">
                    {order.phone ||
                      "No phone provided"}
                  </p>

                </div>

              </div>

              {/* SHIPPING ADDRESS */}
              <div className="bg-white p-8">

                <h3 className="text-[11px] tracking-[0.25em]">
                  SHIPPING ADDRESS
                </h3>

                <div className="mt-7 space-y-2 text-sm text-gray-600">

                  <p className="text-black">
                    {
                      order.first_name
                    }{" "}
                    {
                      order.last_name
                    }
                  </p>

                  <p>
                    {
                      order.address_line1
                    }
                  </p>

                  {order.address_line2 && (
                    <p>
                      {
                        order.address_line2
                      }
                    </p>
                  )}

                  <p>
                    {
                      order.city
                    }

                    {order.state_region
                      ? `, ${order.state_region}`
                      : ""}
                  </p>

                  <p>
                    {
                      order.postal_code
                    }
                  </p>

                  <p>
                    {
                      order.country
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* PAYPAL */}
            <div className="bg-white p-8">

              <h3 className="text-[11px] tracking-[0.25em]">
                PAYMENT INFORMATION
              </h3>

              <div className="mt-7 grid grid-cols-1 gap-6 text-sm md:grid-cols-2">

                <div>

                  <p className="text-xs text-gray-400">
                    PAYMENT METHOD
                  </p>

                  <p className="mt-2">
                    PayPal
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    PAYMENT STATUS
                  </p>

                  <p className="mt-2">
                    {
                      order.payment_status
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    PAYPAL ORDER ID
                  </p>

                  <p className="mt-2 break-all">
                    {
                      order.paypal_order_id
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    PAYPAL CAPTURE ID
                  </p>

                  <p className="mt-2 break-all">
                    {order.paypal_capture_id ||
                      "—"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="sticky top-8 bg-white p-8">

              <h3 className="text-[11px] tracking-[0.25em]">
                ORDER SUMMARY
              </h3>

              <div className="mt-8 space-y-5 text-sm">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    {formatUSD(
                      Number(
                        order.subtotal
                      )
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    {Number(
                      order.shipping_fee
                    ) === 0
                      ? "FREE"
                      : formatUSD(
                          Number(
                            order.shipping_fee
                          )
                        )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Shipping method
                  </span>

                  <span className="capitalize">
                    {
                      order.shipping_method
                    }
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Currency
                  </span>

                  <span>
                    {
                      order.currency
                    }
                  </span>

                </div>

                <div className="flex justify-between border-t border-black/10 pt-6">

                  <span className="font-medium">
                    TOTAL
                  </span>

                  <span className="font-serif text-2xl">
                    {formatUSD(
                      Number(
                        order.total
                      )
                    )}
                  </span>

                </div>

              </div>

              {/* ORDER STATUS */}
              <div className="mt-8 border-t border-black/10 pt-6">

                <p className="text-[10px] tracking-[0.2em] text-gray-400">
                  ORDER STATUS
                </p>

                <p className="mt-3 text-sm uppercase tracking-[0.15em]">
                  {
                    order.order_status
                  }
                </p>

                <form
                  action={
                    updateOrderStatus
                  }
                  className="mt-6"
                >

                  <select
                    name="status"
                    defaultValue={
                      order.order_status
                    }
                    className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                  >

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                  <button
                    type="submit"
                    className="mt-3 w-full bg-black px-5 py-4 text-[10px] tracking-[0.22em] text-white transition hover:bg-black/80"
                  >
                    UPDATE STATUS
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}