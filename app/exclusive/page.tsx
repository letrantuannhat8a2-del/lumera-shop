import Image from "next/image";
import Link from "next/link";

import { supabaseAdmin } from "../lib/supabaseAdmin";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_1: string | null;
  image_2: string | null;
  category: string | null;
};

async function getExclusiveProducts() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      image_1,
      image_2,
      category
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load exclusive products:",
      error
    );

    return [];
  }

  return (data ?? []) as Product[];
}

export default async function ExclusivePage() {
  const products =
    await getExclusiveProducts();

  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#201b1b]/10 bg-[#fcfaf7]">

        <div className="mx-auto flex h-[86px] max-w-[1800px] items-center justify-between px-6 lg:px-10">

          {/* LOGO */}

          <Link
            href="/"
            className="text-center"
          >
            <span className="block font-serif text-[34px] leading-none tracking-[0.25em] sm:text-[39px]">
              VIREL
            </span>

            <span className="mt-1 block text-[7px] tracking-[0.45em] text-[#8e7475]">
              BRIDAL SHOES
            </span>
          </Link>


          {/* BACK */}

          <Link
            href="/"
            className="text-[8px] tracking-[0.2em] transition hover:text-[#b47d80]"
          >
            ← BACK TO HOME
          </Link>

        </div>

      </header>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="px-6 pb-14 pt-20 text-center sm:px-10 sm:pb-20 sm:pt-28">

        <p className="text-[8px] tracking-[0.4em] text-[#aa8586]">
          THE VIREL EDIT
        </p>

        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
          Exclusive
          <br />
          <span className="italic">
            Collection.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-xs leading-7 text-[#766969] sm:text-sm">
          Discover the pieces that define
          the VIREL aesthetic — elegant,
          feminine and created for the
          moments worth remembering.
        </p>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="px-5 pb-20 sm:px-8 md:px-12 lg:px-16">

        <div className="mx-auto max-w-[1700px]">

          {products.length > 0 ? (

            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">

              {products.map(
                (product) => (

                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="group"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[0.82] overflow-hidden bg-[#f4eeea]">

                      <Image
                        src={
                          product.image_1 ||
                          product.image_2 ||
                          "/image/image_1.png"
                        }
                        alt={
                          product.name
                        }
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />

                      {/* EXCLUSIVE */}

                      <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[7px] tracking-[0.12em] text-[#9a7475]">
                        EXCLUSIVE
                      </span>

                      {/* HEART */}

                      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg">
                        ♡
                      </span>

                    </div>


                    {/* INFO */}

                    <div className="pt-4">

                      <h2 className="text-[9px] tracking-[0.12em]">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-[10px]">
                        $
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </p>

                      <p className="mt-2 text-[8px] tracking-[0.12em] text-[#9a8585]">
                        {product.category ||
                          "BRIDAL SHOES"}
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          ) : (

            <div className="border border-black/10 bg-white px-6 py-24 text-center">

              <p className="text-[8px] tracking-[0.3em] text-[#aa8586]">
                VIREL
              </p>

              <h2 className="mt-4 font-serif text-3xl">
                Coming Soon
              </h2>

              <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#766969]">
                Our exclusive collection
                is currently being curated.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex border border-[#201b1b] px-8 py-4 text-[8px] tracking-[0.2em] transition hover:bg-[#201b1b] hover:text-white"
              >
                SHOP ALL SHOES
              </Link>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="border-t border-black/10 bg-[#f0dfdb] px-6 py-20 text-center sm:px-10 sm:py-28">

        <p className="text-[8px] tracking-[0.4em] text-[#9e7778]">
          VIREL BRIDAL SHOES
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
          Designed for
          <br />
          <span className="italic">
            unforgettable moments.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-xs leading-7 text-[#766969]">
          Elegant silhouettes, delicate
          details and timeless design —
          created to accompany you on
          the days that matter most.
        </p>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-black/10 bg-[#faf5f2] px-6 py-12 sm:px-10 lg:px-16">

        <div className="mx-auto flex max-w-[1700px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="font-serif text-xl tracking-[0.2em]">
              VIREL
            </p>

            <p className="mt-1 text-[7px] tracking-[0.3em] text-[#a77d7f]">
              BRIDAL SHOES
            </p>

          </div>

          <div className="flex gap-6">

            <Link
              href="/"
              className="text-[8px] tracking-[0.15em] text-[#625959] hover:text-black"
            >
              HOME
            </Link>

            <Link
              href="/shop"
              className="text-[8px] tracking-[0.15em] text-[#625959] hover:text-black"
            >
              SHOP
            </Link>

            <Link
              href="/about"
              className="text-[8px] tracking-[0.15em] text-[#625959] hover:text-black"
            >
              ABOUT
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}