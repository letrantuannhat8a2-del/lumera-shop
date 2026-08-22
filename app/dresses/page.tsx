import Image from "next/image";
import Link from "next/link";

import Header from "../components/Header";
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
    .eq(
      "is_active",
      true
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

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
    .select(
      "product_id, stock"
    );

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
      <section className="px-12 pb-12 pt-16">

        <p className="text-[10px] tracking-[0.32em] text-gray-400">
          LUMÉRA COLLECTION
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Dresses
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500">
          Discover refined silhouettes
          designed with understated
          elegance and timeless femininity.
        </p>

      </section>

      {/* PRODUCTS */}
      <section className="px-12 pb-28">

        {!products ||
        products.length === 0 ? (

          <div className="border-t border-black/10 py-24 text-center">

            <p className="font-serif text-2xl">
              No products available
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
                  <Link
                    key={
                      product.id
                    }
                    href={`/dresses/${product.slug}`}
                    className="group block"
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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center">

                          <p className="text-[9px] tracking-[0.25em] text-gray-400">
                            IMAGE COMING SOON
                          </p>

                        </div>

                      )}

                      {productStock ===
                        0 && (
                        <div className="absolute inset-x-0 bottom-0 bg-white/90 py-3 text-center">

                          <p className="text-[9px] tracking-[0.2em]">
                            SOLD OUT
                          </p>

                        </div>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="mt-5 flex items-start justify-between gap-5">

                      <div>

                        <h2 className="font-serif text-xl">
                          {
                            product.name
                          }
                        </h2>

                        <p className="mt-2 text-xs text-gray-400">
                          Ivory
                        </p>

                      </div>

                      <p className="text-sm">
                        {formatUSD(
                          Number(
                            product.price
                          )
                        )}
                      </p>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}