import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/sever";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function NewProductPage() {
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

  // =====================================
  // CREATE PRODUCT
  // =====================================

  async function createProduct(
    formData: FormData
  ) {
    "use server";

    // CHECK ADMIN AGAIN
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

    // =====================================
    // BASIC PRODUCT DATA
    // =====================================

    const name =
      String(
        formData.get("name") ?? ""
      ).trim();

    const slug =
      String(
        formData.get("slug") ?? ""
      )
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(
          /[^a-z0-9-]/g,
          ""
        );

    const price =
      Number(
        formData.get("price")
      );

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

    if (
      !name ||
      !slug ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      console.error(
        "Invalid product information."
      );

      return;
    }

    // =====================================
    // PREVENT DUPLICATE SLUG
    // =====================================

    const {
      data: existingProduct,
    } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingProduct) {
      console.error(
        "Product slug already exists."
      );

      return;
    }

    // =====================================
    // UPLOAD PRODUCT product-images
    // =====================================

    const imageUrls: (
      | string
      | null
    )[] = [];

    for (
      let index = 1;
      index <= 5;
      index++
    ) {
      const image =
        formData.get(
          `image_${index}`
        );

      // No image selected
      if (
        !(image instanceof File) ||
        image.size === 0
      ) {
        imageUrls.push(
          null
        );

        continue;
      }

      // Only accept image files
      if (
        !image.type.startsWith(
          "image/"
        )
      ) {
        console.error(
          `File ${index} is not an image.`
        );

        return;
      }

      // Maximum 10 MB each
      if (
        image.size >
        10 * 1024 * 1024
      ) {
        console.error(
          `Image ${index} is larger than 10 MB.`
        );

        return;
      }

      const originalName =
        image.name
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          )
          .replace(
            /[^a-z0-9._-]/g,
            ""
          );

      const fileName =
        `${Date.now()}-${index}-${originalName}`;

      const filePath =
        `${slug}/${fileName}`;

      const {
        error: uploadError,
      } =
        await supabaseAdmin.storage
          .from(
            "product-image"
          )
          .upload(
            filePath,
            image,
            {
              contentType:
                image.type,

              upsert: false,
            }
          );

      if (uploadError) {
        console.error(
          `Unable to upload image ${index}:`,
          uploadError
        );

        return;
      }

      const {
        data: publicUrlData,
      } =
        supabaseAdmin.storage
          .from(
            "product-image"
          )
          .getPublicUrl(
            filePath
          );

      imageUrls.push(
        publicUrlData.publicUrl
      );
    }

    // =====================================
    // SIZES
    // =====================================

    const sizes = [
      "XS",
      "S",
      "M",
      "L",
      "XL",
    ];

    // =====================================
    // CREATE PRODUCT
    // =====================================

    const {
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .insert({
        id: slug,

        name,

        slug,

        price:
          Number(
            price.toFixed(2)
          ),

        currency: "USD",

        description:
          description || null,

        category:
          "dresses",

        image_1:
          imageUrls[0] ??
          null,

        image_2:
          imageUrls[1] ??
          null,

        image_3:
          imageUrls[2] ??
          null,

        image_4:
          imageUrls[3] ??
          null,

        image_5:
          imageUrls[4] ??
          null,

        sizes,

        // Old total stock field
        // is no longer the inventory source.
        stock: 0,

        is_active:
          isActive,
      });

    if (productError) {
      console.error(
        "Unable to create product:",
        productError
      );

      return;
    }

    // =====================================
    // CREATE STOCK BY SIZE
    // =====================================

    const variantRows =
      sizes.map((size) => {
        const stock =
          Number(
            formData.get(
              `stock_${size}`
            )
          );

        const safeStock =
          Number.isFinite(
            stock
          )
            ? Math.max(
                0,
                Math.floor(
                  stock
                )
              )
            : 0;

        return {
          product_id:
            slug,

          size,

          stock:
            safeStock,
        };
      });

    const {
      error: variantError,
    } = await supabaseAdmin
      .from(
        "product_variants"
      )
      .insert(
        variantRows
      );

    if (variantError) {
      console.error(
        "Unable to create product variants:",
        variantError
      );

      return;
    }

    // =====================================
    // DONE
    // =====================================

    redirect(
      `/admin/products/${slug}`
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

          <Link
            href="/admin/products"
            className="text-[10px] tracking-[0.18em] underline underline-offset-4"
          >
            ← BACK TO PRODUCTS
          </Link>

        </div>

      </header>

      <section className="mx-auto max-w-[1100px] px-10 py-12">

        {/* TITLE */}
        <div className="border-b border-black/10 pb-10">

          <p className="text-[10px] tracking-[0.3em] text-gray-400">
            PRODUCT MANAGEMENT
          </p>

          <h2 className="mt-3 font-serif text-5xl">
            Add Product
          </h2>

        </div>

        {/* FORM */}
        <form
          action={
            createProduct
          }
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.7fr]"
        >

          {/* LEFT */}
          <div className="space-y-8">

            {/* PRODUCT INFORMATION */}
            <div className="bg-white p-8">

              <h3 className="text-[11px] tracking-[0.25em]">
                PRODUCT INFORMATION
              </h3>

              <div className="mt-7 space-y-6">

                {/* NAME */}
                <div>

                  <label
                    htmlFor="name"
                    className="text-[10px] tracking-[0.18em] text-gray-400"
                  >
                    PRODUCT NAME
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="TYPE-2"
                    required
                    className="mt-3 w-full border border-black/20 px-5 py-4 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* SLUG */}
                <div>

                  <label
                    htmlFor="slug"
                    className="text-[10px] tracking-[0.18em] text-gray-400"
                  >
                    SLUG
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="type-2"
                    required
                    className="mt-3 w-full border border-black/20 px-5 py-4 text-sm outline-none focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Example: type-2
                  </p>

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
                    min="0.01"
                    step="0.01"
                    placeholder="68.51"
                    required
                    className="mt-3 w-full border border-black/20 px-5 py-4 text-sm outline-none focus:border-black"
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
                    placeholder="Product description..."
                    className="mt-3 w-full resize-none border border-black/20 px-5 py-4 text-sm leading-7 outline-none focus:border-black"
                  />

                </div>

              </div>

            </div>

            {/* PRODUCT IMAGES */}
            <div className="bg-white p-8">

              <div>

                <h3 className="text-[11px] tracking-[0.25em]">
                  PRODUCT IMAGE
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-400">
                  Upload up to 5 images.
                  The first image will be
                  used as the main product
                  image.
                </p>

              </div>

              <div className="mt-7 space-y-5">

                {[1, 2, 3, 4, 5].map(
                  (number) => (
                    <div
                      key={
                        number
                      }
                      className="border border-black/10 p-5"
                    >

                      <label
                        htmlFor={`image_${number}`}
                        className="text-[10px] tracking-[0.18em] text-gray-400"
                      >
                        {number ===
                        1
                          ? "MAIN IMAGE"
                          : `IMAGE ${number}`}
                      </label>

                      <input
                        id={`image_${number}`}
                        name={`image_${number}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required={
                          number ===
                          1
                        }
                        className="mt-4 block w-full cursor-pointer text-xs file:mr-5 file:border-0 file:bg-black file:px-5 file:py-3 file:text-[9px] file:tracking-[0.15em] file:text-white"
                      />

                    </div>
                  )
                )}

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

                {[
                  "XS",
                  "S",
                  "M",
                  "L",
                  "XL",
                ].map(
                  (size) => (
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
                          0
                        }
                        required
                        className="mt-3 w-full border border-black/20 px-4 py-4 text-center text-sm outline-none focus:border-black"
                      />

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="sticky top-8 space-y-6">

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
                      Make this product
                      visible and available
                      for purchase.
                    </p>

                  </div>

                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4"
                  />

                </label>

              </div>

              {/* INFO */}
              <div className="bg-white p-8">

                <p className="text-[10px] leading-6 text-gray-400">
                  Images will be uploaded
                  securely to LUMÉRA storage
                  when you create the
                  product.
                </p>

              </div>

              {/* CREATE */}
              <button
                type="submit"
                className="w-full bg-black px-6 py-5 text-[10px] tracking-[0.25em] text-white transition hover:bg-black/80"
              >
                CREATE PRODUCT
              </button>

            </div>

          </div>

        </form>

      </section>

    </main>
  );
}