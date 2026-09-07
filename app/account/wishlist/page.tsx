import Image from "next/image";
import Link from "next/link";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

import WishlistRemoveButton from "./WishlistRemoveButton";

type WishlistItem = {
  id: string;
  product_id: string;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_1: string | null;
  image_2: string | null;
};

export default async function WishlistPage() {
  // =====================================================
  // AUTH
  // =====================================================

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

        <header className="border-b border-black/10">

          <div className="mx-auto flex h-[86px] max-w-[1800px] items-center justify-between px-6 lg:px-10">

            <Link
              href="/"
              className="text-center"
            >
              <span className="block font-serif text-[34px] leading-none tracking-[0.25em]">
                VIREL
              </span>

              <span className="mt-1 block text-[7px] tracking-[0.45em] text-[#8e7475]">
                BRIDAL SHOES
              </span>
            </Link>

            <Link
              href="/account/login"
              className="text-[8px] tracking-[0.2em] hover:text-[#b47d80]"
            >
              SIGN IN
            </Link>

          </div>

        </header>


        <section className="px-6 py-24 text-center sm:py-32">

          <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
            VIREL
          </p>

          <h1 className="mt-5 font-serif text-5xl sm:text-6xl">
            Wishlist
          </h1>

          <p className="mx-auto mt-6 max-w-md text-xs leading-7 text-[#766969]">
            Sign in to save your
            favorite VIREL pieces.
          </p>

          <Link
            href="/account/login"
            className="mt-8 inline-flex border border-black px-9 py-4 text-[8px] tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            SIGN IN
          </Link>

        </section>

      </main>
    );
  }

  // =====================================================
  // GET WISHLIST
  // =====================================================

  const {
    data: wishlistRows,
    error: wishlistError,
  } =
    await supabase
      .from("wishlist")
      .select(
        "id, product_id, created_at"
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (wishlistError) {
    console.error(
      "Wishlist page error:",
      wishlistError
    );
  }

  const wishlist =
    (wishlistRows ??
      []) as WishlistItem[];

  // =====================================================
  // NO WISHLIST
  // =====================================================

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

        <header className="border-b border-black/10">

          <div className="mx-auto flex h-[86px] max-w-[1800px] items-center justify-between px-6 lg:px-10">

            <Link
              href="/"
              className="text-center"
            >
              <span className="block font-serif text-[34px] leading-none tracking-[0.25em]">
                VIREL
              </span>

              <span className="mt-1 block text-[7px] tracking-[0.45em] text-[#8e7475]">
                BRIDAL SHOES
              </span>
            </Link>

            <Link
              href="/shop"
              className="text-[8px] tracking-[0.2em] hover:text-[#b47d80]"
            >
              CONTINUE SHOPPING
            </Link>

          </div>

        </header>


        <section className="px-6 py-24 text-center sm:py-32">

          <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
            YOUR SELECTION
          </p>

          <h1 className="mt-5 font-serif text-5xl sm:text-6xl">
            Wishlist
          </h1>

          <p className="mx-auto mt-6 max-w-md text-xs leading-7 text-[#766969]">
            Your wishlist is
            currently empty.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex border border-black px-9 py-4 text-[8px] tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            DISCOVER VIREL
          </Link>

        </section>

      </main>
    );
  }

  // =====================================================
  // GET PRODUCT IDS
  // =====================================================

  const productIds =
    wishlist.map(
      (item) =>
        item.product_id
    );

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const {
    data: products,
    error: productError,
  } =
    await supabaseAdmin
      .from("products")
      .select(
        `
          id,
          name,
          slug,
          price,
          image_1,
          image_2
        `
      )
      .in(
        "id",
        productIds
      );

  if (productError) {
    console.error(
      "Wishlist products error:",
      productError
    );
  }

  const productList =
    (products ??
      []) as Product[];

  // =====================================================
  // PRESERVE WISHLIST ORDER
  // =====================================================

  const orderedProducts =
    productIds
      .map((productId) =>
        productList.find(
          (product) =>
            product.id ===
            productId
        )
      )
      .filter(
        (
          product
        ): product is Product =>
          Boolean(product)
      );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-black/10">

        <div className="mx-auto flex h-[86px] max-w-[1800px] items-center justify-between px-6 lg:px-10">

          <Link
            href="/"
            className="text-center"
          >
            <span className="block font-serif text-[34px] leading-none tracking-[0.25em]">
              VIREL
            </span>

            <span className="mt-1 block text-[7px] tracking-[0.45em] text-[#8e7475]">
              BRIDAL SHOES
            </span>
          </Link>

          <Link
            href="/shop"
            className="text-[8px] tracking-[0.2em] transition hover:text-[#b47d80]"
          >
            CONTINUE SHOPPING
          </Link>

        </div>

      </header>


      {/* =================================================
          TITLE
      ================================================= */}

      <section className="px-6 pb-12 pt-20 text-center sm:px-10 sm:pb-16 sm:pt-24">

        <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
          YOUR SELECTION
        </p>

        <h1 className="mt-5 font-serif text-5xl sm:text-6xl md:text-7xl">
          Wishlist
        </h1>

        <p className="mt-5 text-[9px] tracking-[0.18em] text-[#8a7979]">
          {orderedProducts.length}{" "}
          {orderedProducts.length === 1
            ? "ITEM"
            : "ITEMS"}
        </p>

      </section>


      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="px-5 pb-24 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-[1700px]">

          <div className="grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 lg:grid-cols-4">

            {orderedProducts.map(
              (product) => {

                const image =
                  product.image_1 ||
                  product.image_2;

                return (
                  <div
                    key={product.id}
                    className="group"
                  >

                    {/* IMAGE */}

                    <Link
                      href={`/shop/${product.slug}`}
                      className="block"
                    >

                      <div className="relative aspect-[0.82] overflow-hidden bg-[#f4eeea]">

                        {image ? (
                          <Image
                            src={image}
                            alt={
                              product.name
                            }
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-[8px] tracking-[0.2em] text-gray-400">
                              NO IMAGE
                            </span>
                          </div>
                        )}

                        {/* HEART */}

                        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[18px]">
                          ♥
                        </span>

                      </div>

                    </Link>


                    {/* INFO */}

                    <div className="pt-4">

                      <Link
                        href={`/shop/${product.slug}`}
                        className="block"
                      >

                        <h2 className="text-[9px] tracking-[0.12em] transition group-hover:text-[#a77d7f]">
                          {product.name}
                        </h2>

                        <p className="mt-2 text-[10px]">
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </p>

                      </Link>


                      {/* ACTIONS */}

                      <div className="mt-4 flex items-center gap-5">

                        <Link
                          href={`/shop/${product.slug}`}
                          className="
                            inline-flex
                            border
                            border-black
                            px-5
                            py-3
                            text-[7px]
                            tracking-[0.18em]
                            transition
                            hover:bg-black
                            hover:text-white
                          "
                        >
                          VIEW PRODUCT
                        </Link>

                        <WishlistRemoveButton
                          productId={
                            product.id
                          }
                        />

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-black/10 bg-[#faf5f2] px-6 py-12 sm:px-10 lg:px-16">

        <div className="mx-auto flex max-w-[1700px] items-center justify-between">

          <div>

            <p className="font-serif text-xl tracking-[0.2em]">
              VIREL
            </p>

            <p className="mt-1 text-[7px] tracking-[0.3em] text-[#a77d7f]">
              BRIDAL SHOES
            </p>

          </div>

          <Link
            href="/"
            className="text-[8px] tracking-[0.15em] text-[#625959] transition hover:text-black"
          >
            HOME
          </Link>

        </div>

      </footer>

    </main>
  );
}