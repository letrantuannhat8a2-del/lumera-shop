import Image from "next/image";
import Link from "next/link";

import Header from "../components/Header";
import WishlistButton from "../components/WishlistButton";
import { supabaseAdmin } from "../lib/supabaseAdmin";

type Variant = {
  product_id: string;
  stock: number;
};

export default async function DressesPage() {
  // GET ACTIVE PRODUCTS
  const {
    data: products,
    error: productError,
  } = await supabaseAdmin
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      currency,
      image_1,
      created_at
      `
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: true,
    });

  if (productError) {
    console.error(
      "Unable to load products:",
      productError
    );
  }

  // GET STOCK
  const {
    data: variants,
  } = await supabaseAdmin
    .from("product_variants")
    .select("product_id, stock");

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

  return (
    <main className="min-h-screen bg-[#faf9f7] text-black">

      <Header active="dresses" />

      {/* TITLE */}
      <section className="px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14 lg:px-12 lg:pb-12 lg:pt-16">

        <p className="text-[9px] tracking-[0.32em] text-gray-400 sm:text-[10px]">
          LUMÉRA COLLECTION
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:mt-4 sm:text-5xl">
          Dresses
        </h1>

        <p className="mt-4 max-w-xl text-xs leading-6 text-gray-500 sm:mt-5 sm:text-sm sm:leading-7">
          Discover refined silhouettes
          designed with understated
          elegance and timeless femininity.
        </p>

      </section>

      {/* PRODUCTS */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">

        {!products ||
        products.length === 0 ? (

          <div className="border-t border-black/10 py-20 text-center sm:py-24">

            <p className="font-serif text-xl sm:text-2xl">
              No products available
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">

            {products.map(
              (product) => {

                const productStock =
                  (
                    variants as Variant[] | null
                  )
                    ?.filter(
                      (variant) =>
                        variant.product_id ===
                        product.id
                    )
                    .reduce(
                      (
                        total,
                        variant
                      ) =>
                        total +
                        Number(
                          variant.stock
                        ),
                      0
                    ) ?? 0;

                return (

                  // =========================
                  // PRODUCT CARD
                  // =========================

                  <div
                    key={product.id}
                    className="group relative min-w-0"
                  >

                    {/* PRODUCT LINK */}

                    <Link
                      href={`/dresses/${product.slug}`}
                      className="block"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[3/4] overflow-hidden bg-[#eee9e3]">

                        {product.image_1 ? (

                          <Image
                            src={
                              product.image_1
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="
                              (max-width: 640px) 50vw,
                              (max-width: 1024px) 50vw,
                              (max-width: 1280px) 33vw,
                              25vw
                            "
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center">

                            <p className="px-2 text-center text-[8px] tracking-[0.2em] text-gray-400 sm:text-[9px] sm:tracking-[0.25em]">
                              IMAGE COMING SOON
                            </p>

                          </div>

                        )}

                        {productStock ===
                          0 && (

                          <div className="absolute inset-x-0 bottom-0 bg-white/90 py-2 text-center sm:py-3">

                            <p className="text-[7px] tracking-[0.18em] sm:text-[9px] sm:tracking-[0.2em]">
                              SOLD OUT
                            </p>

                          </div>

                        )}

                      </div>


                      {/* INFO */}

                      <div className="mt-3 flex items-start justify-between gap-2 sm:mt-5 sm:gap-5">

                        <div className="min-w-0">

                          <h2 className="truncate font-serif text-base sm:text-xl">
                            {
                              product.name
                            }
                          </h2>

                          <p className="mt-1 text-[9px] text-gray-400 sm:mt-2 sm:text-xs">
                            Ivory
                          </p>

                        </div>

                        <p className="shrink-0 text-[10px] sm:text-sm">
                          {formatUSD(
                            Number(
                              product.price
                            )
                          )}
                        </p>

                      </div>

                    </Link>


                    {/* WISHLIST */}

                    <WishlistButton
                      productId={
                        product.id
                      }
                    />

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}