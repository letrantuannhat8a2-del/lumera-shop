import Link from "next/link";
import { redirect } from "next/navigation";

import DeleteButton from "./DeleteButton";

import { createClient } from "@/app/lib/supabase/sever";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type Variant = {
  product_id: string;
  size: string;
  stock: number;
};

export default async function AdminProductsPage() {
  // ========================================
  // CHECK ADMIN LOGIN
  // ========================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ) {
    redirect("/admin/login");
  }

  // ========================================
  // GET PRODUCTS
  // ========================================

  const {
    data: products,
    error: productError,
  } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (productError) {
    console.error(
      "Unable to load products:",
      productError
    );
  }

  // ========================================
  // GET SIZE STOCK
  // ========================================

  const {
    data: variants,
    error: variantError,
  } = await supabaseAdmin
    .from("product_variants")
    .select(
      "product_id, size, stock"
    )
    .order("size", {
      ascending: true,
    });

  if (variantError) {
    console.error(
      "Unable to load variants:",
      variantError
    );
  }

  // ========================================
  // FORMAT USD
  // ========================================

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

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-black/10 bg-white">

        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-6 sm:min-h-24 sm:px-10">

          <div>

            <p className="font-serif text-2xl tracking-[0.2em] sm:text-3xl">
              VIREL
            </p>

            <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
              ADMINISTRATION
            </p>

          </div>

          <nav className="flex items-center gap-6 sm:gap-8">

            <Link
              href="/admin/orders"
              className="text-[9px] tracking-[0.18em] text-gray-400 transition hover:text-black sm:text-[10px]"
            >
              ORDERS
            </Link>

            <Link
              href="/admin/products"
              className="text-[9px] tracking-[0.18em] sm:text-[10px]"
            >
              PRODUCTS
            </Link>

          </nav>

        </div>

      </header>

      {/* ========================================
          CONTENT
      ======================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">

        {/* ========================================
            TITLE
        ======================================== */}

        <div className="flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] tracking-[0.3em] text-gray-400">
              VIREL MANAGEMENT
            </p>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
              Products
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-400">
              Manage VIREL bridal shoes,
              pricing, availability and
              inventory by shoe size.
            </p>

          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">

            <p className="text-sm text-gray-500">
              {products?.length ?? 0} products
            </p>

            <Link
              href="/admin/products/new"
              className="bg-black px-6 py-4 text-[9px] tracking-[0.2em] text-white transition hover:bg-black/80 sm:text-[10px]"
            >
              ADD PRODUCT
            </Link>

          </div>

        </div>

        {/* ========================================
            PRODUCTS
        ======================================== */}

        <div className="mt-10">

          {!products ||
          products.length === 0 ? (

            <div className="border border-black/10 bg-white px-8 py-20 text-center">

              <p className="font-serif text-2xl">
                No products yet
              </p>

              <p className="mt-3 text-sm text-gray-400">
                Add your first VIREL bridal
                shoe to begin.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-7 inline-block border-b border-black pb-1 text-[10px] tracking-[0.2em]"
              >
                ADD PRODUCT
              </Link>

            </div>

          ) : (

            <div className="space-y-5">

              {products.map(
                (product) => {

                  const productVariants =
                    (
                      variants as
                        | Variant[]
                        | null
                    )
                      ?.filter(
                        (variant) =>
                          variant.product_id ===
                          product.id
                      )
                      .sort(
                        (a, b) =>
                          Number(a.size) -
                          Number(b.size)
                      ) ?? [];

                  const totalStock =
                    productVariants.reduce(
                      (
                        total,
                        variant
                      ) =>
                        total +
                        Number(
                          variant.stock
                        ),
                      0
                    );

                  return (
                    <article
                      key={product.id}
                      className="border border-black/10 bg-white p-6 sm:p-7"
                    >

                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr_1.5fr_0.9fr] lg:items-center">

                        {/* =================================
                            PRODUCT
                        ================================= */}

                        <div className="min-w-0">

                          <p className="text-[9px] tracking-[0.25em] text-gray-400">
                            PRODUCT
                          </p>

                          <h2 className="mt-3 font-serif text-2xl">
                            {product.name}
                          </h2>

                          <p className="mt-2 truncate text-xs text-gray-400">
                            {product.id}
                          </p>

                          <p className="mt-2 text-[10px] tracking-[0.15em] text-gray-400">
                            {product.category ||
                              "BRIDAL SHOES"}
                          </p>

                        </div>

                        {/* =================================
                            PRICE
                        ================================= */}

                        <div>

                          <p className="text-[9px] tracking-[0.25em] text-gray-400">
                            PRICE
                          </p>

                          <p className="mt-3 text-sm">
                            {formatUSD(
                              Number(
                                product.price
                              )
                            )}
                          </p>

                        </div>

                        {/* =================================
                            INVENTORY
                        ================================= */}

                        <div>

                          <div className="flex items-center justify-between gap-4">

                            <p className="text-[9px] tracking-[0.25em] text-gray-400">
                              INVENTORY BY SIZE
                            </p>

                            <p className="shrink-0 text-[10px] text-gray-400">
                              {totalStock}{" "}
                              total
                            </p>

                          </div>

                          {productVariants.length ===
                          0 ? (

                            <p className="mt-4 text-xs text-gray-400">
                              No shoe sizes
                              configured.
                            </p>

                          ) : (

                            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">

                              {productVariants.map(
                                (
                                  variant
                                ) => {

                                  const stock =
                                    Number(
                                      variant.stock
                                    );

                                  return (
                                    <div
                                      key={`${product.id}-${variant.size}`}
                                      className={`border px-3 py-3 text-center ${
                                        stock ===
                                        0
                                          ? "border-red-100 bg-red-50"
                                          : "border-black/10 bg-[#faf9f7]"
                                      }`}
                                    >

                                      <p className="text-[10px] tracking-[0.12em]">
                                        {variant.size}
                                      </p>

                                      <p
                                        className={`mt-2 text-sm ${
                                          stock ===
                                          0
                                            ? "text-red-600"
                                            : ""
                                        }`}
                                      >
                                        {stock}
                                      </p>

                                    </div>
                                  );
                                }
                              )}

                            </div>

                          )}

                        </div>

                        {/* =================================
                            STATUS + ACTION
                        ================================= */}

                        <div className="lg:text-right">

                          <p className="text-[9px] tracking-[0.25em] text-gray-400">
                            STATUS
                          </p>

                          <div className="mt-3">

                            <span
                              className={`inline-block rounded-full px-4 py-2 text-[9px] tracking-[0.15em] ${
                                product.is_active
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {product.is_active
                                ? "ACTIVE"
                                : "HIDDEN"}
                            </span>

                          </div>

                          {/* CHAT */}

                          <Link
                            href="/admin/chat"
                            className="mt-5 inline-block text-[10px] tracking-[0.15em] text-gray-400 transition hover:text-black"
                          >
                            CHAT
                          </Link>

                          {/* ACTIONS */}

                          <div className="mt-5 flex flex-wrap justify-start gap-5 text-[10px] tracking-[0.15em] lg:justify-end">

                            <Link
                              href={`/admin/products/${product.id}`}
                              className="underline underline-offset-4 transition hover:opacity-50"
                            >
                              EDIT PRODUCT
                            </Link>

                            <DeleteButton
                              id={
                                product.id
                              }
                            />

                          </div>

                        </div>

                      </div>

                    </article>
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