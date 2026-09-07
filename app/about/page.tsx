import Image from "next/image";
import Link from "next/link";

import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type AboutData = {
  image?: string;
  positionX?: number;
  positionY?: number;
  zoom?: number;
};

export default async function AboutPage() {
  // Only read the About image settings saved from Admin.
  const { data } = await supabaseAdmin
    .from("homepage_content")
    .select("about")
    .eq("id", 1)
    .single();

  const about: AboutData = data?.about ?? {};

  const image = about.image || "/image/image_4.png";
  const positionX = about.positionX ?? 50;
  const positionY = about.positionY ?? 50;
  const zoom = about.zoom ?? 1;

  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#201b1b]/10 bg-[#fcfaf7]">

        <div className="mx-auto flex h-[86px] max-w-[1800px] items-center justify-between px-6 lg:px-10">

          <Link href="/" className="text-center">
            <span className="block font-serif text-[34px] leading-none tracking-[0.25em] sm:text-[39px]">
              VIREL
            </span>

            <span className="mt-1 block text-[7px] tracking-[0.45em] text-[#8e7475]">
              BRIDAL SHOES
            </span>
          </Link>

          <Link
            href="/"
            className="text-[8px] tracking-[0.2em] transition hover:text-[#b47d80]"
          >
            ← BACK TO HOME
          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f0dfdb]">

        <div className="mx-auto grid max-w-[1700px] lg:grid-cols-2">

          {/* IMAGE — 4:3 */}

          <div className="relative aspect-[4/3] w-full overflow-hidden">

            <Image
              src={image}
              alt="VIREL bridal shoes"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{
                objectPosition: `${positionX}% ${positionY}%`,
                transform: `scale(${zoom})`,
              }}
            />

          </div>


          {/* INTRO */}

          <div className="flex items-center px-8 py-20 sm:px-14 md:px-20 lg:px-24">

            <div className="max-w-xl">

              <p className="text-[8px] tracking-[0.4em] text-[#9e7778]">
                THE VIREL STORY
              </p>

              <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
                Made for
                <br />
                <span className="italic">
                  the moment.
                </span>
              </h1>

              <p className="mt-8 text-xs leading-7 text-[#675959] sm:text-sm">
                VIREL was created with a simple
                idea: the shoes you wear on your
                most meaningful days should feel
                just as beautiful as the memories
                you create in them.
              </p>

              <p className="mt-5 text-xs leading-7 text-[#675959] sm:text-sm">
                Every pair is thoughtfully designed
                to bring together elegance, comfort
                and timeless femininity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BRAND STATEMENT
      ===================================================== */}

      <section className="bg-[#fffdfb] px-6 py-20 text-center sm:px-10 sm:py-28">

        <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
          OUR PHILOSOPHY
        </p>

        <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
          Elegance should feel
          <br />
          <span className="italic">
            effortless.
          </span>
        </h2>

        <p className="mx-auto mt-7 max-w-2xl text-xs leading-7 text-[#766969] sm:text-sm">
          We believe true luxury lives in
          the details — the balance of
          proportion, the feel of premium
          materials and the quiet confidence
          of a beautifully considered design.
        </p>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="border-y border-black/10 bg-[#faf5f2]">

        <div className="mx-auto grid max-w-[1700px] md:grid-cols-3">

          <div className="border-b border-black/10 px-8 py-14 text-center md:border-b-0 md:border-r md:px-10 lg:py-20">
            <p className="text-[8px] tracking-[0.35em] text-[#9e7778]">
              01
            </p>
            <h3 className="mt-5 font-serif text-2xl sm:text-3xl">
              Timeless Design
            </h3>
            <p className="mx-auto mt-5 max-w-xs text-xs leading-6 text-[#766969]">
              Refined silhouettes designed
              to remain beautiful beyond
              a single season.
            </p>
          </div>

          <div className="border-b border-black/10 px-8 py-14 text-center md:border-b-0 md:border-r md:px-10 lg:py-20">
            <p className="text-[8px] tracking-[0.35em] text-[#9e7778]">
              02
            </p>
            <h3 className="mt-5 font-serif text-2xl sm:text-3xl">
              Thoughtful Details
            </h3>
            <p className="mx-auto mt-5 max-w-xs text-xs leading-6 text-[#766969]">
              From delicate finishes to
              considered proportions, every
              detail has a purpose.
            </p>
          </div>

          <div className="px-8 py-14 text-center md:px-10 lg:py-20">
            <p className="text-[8px] tracking-[0.35em] text-[#9e7778]">
              03
            </p>
            <h3 className="mt-5 font-serif text-2xl sm:text-3xl">
              Made to Remember
            </h3>
            <p className="mx-auto mt-5 max-w-xs text-xs leading-6 text-[#766969]">
              Created for weddings,
              celebrations and the moments
              you will carry with you.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          CLOSING STORY
      ===================================================== */}

      <section className="bg-[#fcfaf7] px-6 py-20 sm:px-10 sm:py-28">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
            VIREL
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            For every step
            <br />
            <span className="italic">
              worth remembering.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-xs leading-7 text-[#766969] sm:text-sm">
            Whether it is your wedding day,
            a celebration with the people you
            love, or simply a moment that
            deserves something special, VIREL
            is designed to walk with you.
          </p>

          <Link
            href="/shop"
            className="mt-9 inline-flex border border-[#201b1b] px-9 py-4 text-[8px] tracking-[0.22em] transition hover:bg-[#201b1b] hover:text-white"
          >
            DISCOVER VIREL
          </Link>

        </div>

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
              className="text-[8px] tracking-[0.15em] text-[#625959] transition hover:text-black"
            >
              HOME
            </Link>

            <Link
              href="/exclusive"
              className="text-[8px] tracking-[0.15em] text-[#625959] transition hover:text-black"
            >
              COLLECTION
            </Link>

            <Link
              href="/shop"
              className="text-[8px] tracking-[0.15em] text-[#625959] transition hover:text-black"
            >
              SHOP
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}
