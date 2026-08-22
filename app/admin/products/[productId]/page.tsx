import Link from "next/link";
import ImageUploader from "./ImageUploader";
import {
  notFound,
  redirect,
} from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

type Variant = {
  size: string;
  stock: number;
};

export default async function EditProductPage({
  params,
}: PageProps) {
  // =====================================
  // CHECK ADMIN LOGIN
  // =====================================

  const supabase =
    await createClient();

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

  const { productId } =
    await params;

  // =====================================
  // GET PRODUCT
  // =====================================

  const {
    data: product,
    error: productError,
  } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (
    productError ||
    !product
  ) {
    notFound();
  }

  // =====================================
  // GET VARIANTS
  // =====================================

  const {
    data: variants,
    error: variantError,
  } = await supabaseAdmin
    .from("product_variants")
    .select(
      "size, stock"
    )
    .eq(
      "product_id",
      productId
    );

  if (variantError) {
    console.error(
      "Unable to load variants:",
      variantError
    );
  }

  const productVariants:
    Variant[] =
      variants?.map(
        (variant) => ({
          size:
            variant.size,

          stock:
            Number(
              variant.stock
            ),
        })
      ) ?? [];

  const sizes: string[] =
    Array.isArray(
      product.sizes
    )
      ? product.sizes
      : [];

  // =====================================
  // UPDATE PRODUCT
  // =====================================

  async function updateProduct(
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
      user.email !==
        adminEmail
    ) {
      redirect(
        "/admin/login"
      );
    }

    const price =
      Number(
        formData.get(
          "price"
        )
      );
const name =
  String(
    formData.get(
      "name"
    ) ?? ""
  ).trim();
    const description =
      String(
        formData.get(
          "description"
        ) ?? ""
      ).trim();

    const isActive =
      formData.get(
        "isActive"
      ) === "on";

    // PRICE VALIDATION
    if (
      !Number.isFinite(
        price
      ) ||
      price <= 0
    ) {
      return;
    }

    // =====================================
    // UPDATE PRODUCT INFO
    // =====================================

    const {
      error:
        updateProductError,
    } = await supabaseAdmin
      .from("products")
      .update({
  name,

  price:
    Number(
      price.toFixed(2)
    ),

  description:
    description ||
    null,

  is_active:
    isActive,

  updated_at:
    new Date()
      .toISOString(),
})
      .eq(
        "id",
        productId
      );

    if (
      updateProductError
    ) {
      console.error(
        "Unable to update product:",
        updateProductError
      );

      return;
    }

    // =====================================
    // UPDATE STOCK BY SIZE
    // =====================================

    for (
      const size of sizes
    ) {
      const stockValue =
        Number(
          formData.get(
            `stock_${size}`
          )
        );

      const safeStock =
        Number.isFinite(
          stockValue
        )
          ? Math.max(
              0,
              Math.floor(
                stockValue
              )
            )
          : 0;

      const {
        error:
          stockError,
      } =
        await supabaseAdmin
          .from(
            "product_variants"
          )
          .upsert(
            {
              product_id:
                productId,

              size,

              stock:
                safeStock,

              updated_at:
                new Date()
                  .toISOString(),
            },
            {
              onConflict:
                "product_id,size",
            }
          );

      if (
        stockError
      ) {
        console.error(
          `Unable to update stock ${size}:`,
          stockError
        );

        return;
      }
    }

    // =====================================
    // REFRESH WEBSITE
    // =====================================

    revalidatePath(
      "/admin/products"
    );

    revalidatePath(
      `/admin/products/${productId}`
    );

    revalidatePath(
      "/dresses"
    );

    revalidatePath(
      `/dresses/${product.slug}`
    );

    redirect(
      `/admin/products/${productId}`
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* HEADER */}
      <header className="border-b border-black/10 bg-white px-10 py-7">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="font-serif text-2xl tracking-[0.25em]">
              LUMÉRA
            </h1>

            <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
              ADMINISTRATION
            </p>
          </div>

          <div className="flex items-center gap-8">

            <Link
              href="/admin/orders"
              className="text-[10px] tracking-[0.18em] text-gray-400 hover:text-black"
            >
              ORDERS
            </Link>

            <Link
              href="/admin/products"
              className="text-[10px] tracking-[0.18em]"
            >
              PRODUCTS
            </Link>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-[1100px] px-10 py-12">

        {/* TITLE */}
        <div className="flex items-end justify-between border-b border-black/10 pb-10">

          <div>

            <p className="text-[10px] tracking-[0.3em] text-gray-400">
              EDIT PRODUCT
            </p>

            <h2 className="mt-3 font-serif text-5xl">
              {product.name}
            </h2>

            <p className="mt-4 text-sm text-gray-400">
              Product ID:{" "}
              {product.id}
            </p>

          </div>

          <Link
            href="/admin/products"
            className="text-[10px] tracking-[0.18em] underline underline-offset-4"
          >
            ← BACK TO PRODUCTS
          </Link>

        </div>

        {/* FORM */}
        <form
          action={
            updateProduct
          }
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.7fr]"
        >

          {/* LEFT */}
          <div className="space-y-8">

            {/* BASIC INFO */}
            <div className="bg-white p-8">

              <h3 className="text-[11px] tracking-[0.25em]">
                PRODUCT INFORMATION
              </h3>

              <div className="mt-7 space-y-6">

                {/* NAME */}
                <div>

                  <label className="text-[10px] tracking-[0.18em] text-gray-400">
                    PRODUCT NAME
                  </label>

             <input
  name="name"
  defaultValue={product.name}
  className="
    w-full
    border
    px-4
    py-3
  "
/>

                </div>

                {/* PRICE */}
                <div>

                  <label
                    htmlFor="price"
                    className="text-[10px] tracking-[0.18em] text-gray-400"
                  >
                    PRICE — USD
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    defaultValue={
                      Number(
                        product.price
                      )
                    }
                    required
                    className="mt-3 w-full border border-black/20 bg-white px-5 py-4 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* DESCRIPTION */}
                <div>

                  <label
                    htmlFor="description"
                    className="text-[10px] tracking-[0.18em] text-gray-400"
                  >
                    DESCRIPTION
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    defaultValue={
                      product.description ??
                      ""
                    }
                    className="mt-3 w-full resize-none border border-black/20 bg-white px-5 py-4 text-sm leading-7 outline-none focus:border-black"
                  />

                </div>

              </div>

            </div>

            {/* INVENTORY */}
            <div className="bg-white p-8">

              <div className="flex items-center justify-between">

                <h3 className="text-[11px] tracking-[0.25em]">
                  INVENTORY BY SIZE
                </h3>

                <p className="text-[10px] text-gray-400">
                  Units available
                </p>

              </div>

              <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-5">

                {sizes.map(
                  (size) => {
                    const variant =
                      productVariants.find(
                        (item) =>
                          item.size ===
                          size
                      );

                    return (
                      <div
                        key={
                          size
                        }
                      >

                        <label
                          htmlFor={`stock_${size}`}
                          className="text-[10px] tracking-[0.15em] text-gray-400"
                        >
                          {
                            size
                          }
                        </label>

                        <input
                          id={`stock_${size}`}
                          name={`stock_${size}`}
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={
                            variant?.stock ??
                            0
                          }
                          className="mt-3 w-full border border-black/20 px-4 py-4 text-center text-sm outline-none focus:border-black"
                        />

                      </div>
                    );
                  }
                )}

              </div>

              <p className="mt-5 text-xs leading-6 text-gray-400">
                Set stock to 0
                to mark a size as
                sold out.
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="sticky top-8 space-y-6">
<ImageUploader

 productId={product.id}

 slug={product.slug}

 images={[
  product.image_1,
  product.image_2,
  product.image_3,
  product.image_4,
  product.image_5,
 ]}

/>
              {/* STATUS */}
              <div className="bg-white p-8">

                <h3 className="text-[11px] tracking-[0.25em]">
                  PRODUCT STATUS
                </h3>

                <label className="mt-7 flex cursor-pointer items-center justify-between border border-black/10 p-5">

                  <div>

                    <p className="text-sm">
                      Active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Product is visible
                      and available for
                      purchase.
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={
                      product.is_active
                    }
                    className="h-4 w-4"
                  />

                </label>

              </div>

              {/* SUMMARY */}
              <div className="bg-white p-8">

                <h3 className="text-[11px] tracking-[0.25em]">
                  CURRENT PRODUCT
                </h3>

                <div className="mt-7 space-y-5 text-sm">

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Name
                    </span>

                    <span>
                      {
                        product.name
                      }
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Slug
                    </span>

                    <span>
                      {
                        product.slug
                      }
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Currency
                    </span>

                    <span>
                      {
                        product.currency
                      }
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Status
                    </span>

                    <span>
                      {product.is_active
                        ? "Active"
                        : "Hidden"}
                    </span>

                  </div>

                </div>

              </div>

              {/* SAVE */}
              <button
                type="submit"
                className="w-full bg-black px-6 py-5 text-[10px] tracking-[0.25em] text-white transition hover:bg-black/80"
              >
                SAVE CHANGES
              </button>

              <Link
                href={`/dresses/${product.slug}`}
                target="_blank"
                className="block border border-black/20 px-6 py-5 text-center text-[10px] tracking-[0.22em] transition hover:border-black"
              >
                VIEW PRODUCT
              </Link>

            </div>

          </div>

        </form>

      </section>

    </main>
  );
}