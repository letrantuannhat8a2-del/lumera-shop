import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export default async function AdminOrdersPage() {
  // KIỂM TRA ĐĂNG NHẬP
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // CHỈ CHO EMAIL ADMIN TRUY CẬP
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || user.email !== adminEmail) {
    redirect("/admin/login");
  }

  // LẤY DANH SÁCH ĐƠN HÀNG
  const { data: orders, error } =
    await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Unable to load orders:",
      error
    );
  }

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

     

      {/* CONTENT */}
      <section className="px-10 py-12">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-[10px] tracking-[0.3em] text-gray-400">
              LUMÉRA MANAGEMENT
            </p>

            <h2 className="mt-3 font-serif text-5xl">
              Orders
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {orders?.length ?? 0} orders
          </p>

        </div>

        {/* TABLE */}
        <div className="mt-12 overflow-hidden border border-black/10 bg-white">

          <div className="grid grid-cols-[1.1fr_1.3fr_1fr_0.8fr_0.8fr_0.9fr] border-b border-black/10 bg-[#f3f0eb] px-6 py-4 text-[10px] tracking-[0.18em] text-gray-500">

            <span>ORDER</span>
            <span>CUSTOMER</span>
            <span>ITEM</span>
            <span>TOTAL</span>
            <span>PAYMENT</span>
            <span>STATUS</span>

          </div>

          {!orders ||
          orders.length === 0 ? (

            <div className="px-6 py-20 text-center">
              <p className="font-serif text-2xl">
                No orders yet
              </p>

              <p className="mt-2 text-sm text-gray-400">
                New customer orders will appear here.
              </p>
            </div>

          ) : (

            orders.map((order) => {
              const items =
                Array.isArray(order.items)
                  ? (order.items as OrderItem[])
                  : [];

              const firstItem =
                items[0];

              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1.1fr_1.3fr_1fr_0.8fr_0.8fr_0.9fr] items-center border-b border-black/10 px-6 py-6 last:border-b-0"
                >
<Link
 href="/admin/chat"
 className="text-gray-400 hover:text-black"
>
 CHAT
</Link>
                  {/* ORDER */}
                  <div>
                  <Link
  href={`/admin/orders/${order.order_number}`}
  className="text-sm font-medium underline-offset-4 hover:underline"
>
  {order.order_number}
</Link>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </div>

                  {/* CUSTOMER */}
                  <div>
                    <p className="text-sm">
                      {order.first_name}{" "}
                      {order.last_name}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {order.email}
                    </p>
                  </div>

                  {/* ITEM */}
                  <div>
                    {firstItem ? (
                      <>
                        <p className="text-sm">
                          {firstItem.name}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Size{" "}
                          {firstItem.size}
                          {" · "}
                          Qty{" "}
                          {firstItem.quantity}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">
                        —
                      </p>
                    )}
                  </div>

                  {/* TOTAL */}
                  <p className="text-sm">
                    {formatUSD(
                      Number(order.total)
                    )}
                  </p>

                  {/* PAYMENT */}
                  <div>
                    <span className="inline-block rounded-full bg-green-50 px-3 py-2 text-[10px] tracking-[0.12em] text-green-700">
                      {String(
                        order.payment_status
                      ).toUpperCase()}
                    </span>
                  </div>

                  {/* ORDER STATUS */}
                  <div>
                    <span className="inline-block rounded-full bg-[#f2eee7] px-3 py-2 text-[10px] tracking-[0.12em]">
                      {String(
                        order.order_status
                      ).toUpperCase()}
                    </span>
                  </div>

                </div>
              );
            })

          )}

        </div>
      </section>

    </main>
  );
}