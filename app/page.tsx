import Image from "next/image";
import Link from "next/link";

import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#faf9f7] text-black">

      <Header />


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          flex
          w-full
          flex-col
          bg-[#eee5da]
          px-5
          py-8
          sm:px-8
          sm:py-10
          md:min-h-[650px]
          md:flex-row
          md:items-stretch
          md:px-16
          md:py-14
          lg:px-24
        "
      >

        {/* TEXT */}

        <div
          className="
            flex
            w-full
            min-w-0
            flex-col
            justify-center
            pb-8
            md:w-1/2
            md:pb-0
            md:pr-8
            lg:pr-12
          "
        >

          <p
            className="
              mb-4
              text-[9px]
              tracking-[0.3em]
              sm:mb-5
              sm:text-[10px]
              md:mb-5
              md:text-xs
              md:tracking-[0.4em]
            "
          >
            SUMMER 2026
          </p>


          <h2
            className="
              max-w-full
              font-serif
              text-[clamp(3.2rem,15vw,6rem)]
              leading-[0.86]
              tracking-[-0.035em]
              sm:text-[clamp(4rem,12vw,7rem)]
              md:text-[clamp(3rem,6vw,7rem)]
              md:tracking-[-0.02em]
            "
          >
            EFFORTLESS
            <br />
            ELEGANCE
          </h2>


          <p
            className="
              mt-6
              max-w-md
              text-[11px]
              leading-5
              text-gray-700
              sm:mt-7
              sm:text-xs
              sm:leading-6
              md:mt-7
              md:text-sm
              md:leading-7
            "
          >
            Timeless dresses. Modern silhouettes.
            <br className="hidden sm:block" />
            {" "}
            Made to move with you.
          </p>


          <Link
            href="/dresses"
            className="
              mt-6
              inline-flex
              w-full
              items-center
              justify-center
              bg-black
              px-6
              py-4
              text-[9px]
              tracking-[0.2em]
              text-white
              transition
              hover:bg-black/80
              sm:mt-7
              sm:w-fit
              sm:px-7
              md:mt-8
              md:px-8
              md:py-4
              md:text-sm
              md:tracking-widest
            "
          >
            SHOP COLLECTION
          </Link>

        </div>


        {/* IMAGE */}

        <div
          className="
            relative
            w-full
            min-w-0
            aspect-[3/4]
            overflow-hidden
            bg-[#eee9e3]
            md:w-1/2
            md:aspect-auto
          "
        >

          <Image
            src="/image/image_1.png"
            alt="Luxury white dress"
            fill
            className="object-cover object-top"
            priority
            sizes="
              (max-width: 767px) 100vw,
              50vw
            "
          />

        </div>

      </section>


      {/* ==================================================
          NEW ARRIVALS
      ================================================== */}

      <section
        className="
          w-full
          bg-white
          px-4
          py-12
          sm:px-6
          sm:py-14
          md:px-12
          md:py-20
        "
      >

        <div className="mx-auto w-full max-w-[1700px]">

          <p
            className="
              mb-2
              text-center
              text-[8px]
              tracking-[0.3em]
              text-gray-500
              sm:mb-3
              sm:text-[9px]
              md:text-xs
              md:tracking-[0.4em]
            "
          >
            DISCOVER
          </p>

          <h2
            className="
              mb-8
              text-center
              text-base
              tracking-[0.18em]
              sm:mb-9
              sm:text-lg
              md:mb-12
              md:text-2xl
              md:tracking-[0.35em]
            "
          >
            NEW ARRIVALS
          </h2>


          <div
            className="
              grid
              w-full
              grid-cols-2
              gap-x-3
              gap-y-9
              sm:gap-4
              md:gap-6
              lg:grid-cols-4
            "
          >

            {[
              {
                name: "AVA DRESS",
                price: "$57.03",
                image: "/image/image_2.png",
              },
              {
                name: "LUNA DRESS",
                price: "$68.51",
                image: "/image/image_3.png",
              },
              {
                name: "ELLE DRESS",
                price: "$80.00",
                image: "/image/image_4.png",
              },
              {
                name: "MIA DRESS",
                price: "$91.48",
                image: "/image/image_5.png",
              },
            ].map((dress) => (

              <div
                key={dress.name}
                className="
                  group
                  min-w-0
                  cursor-pointer
                "
              >

                <div
                  className="
                    relative
                    aspect-[3/4]
                    w-full
                    overflow-hidden
                    bg-[#eee9e3]
                  "
                >

                  <Image
                    src={dress.image}
                    alt={dress.name}
                    fill
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 1024px) 50vw,
                      25vw
                    "
                    className="
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-[1.03]
                    "
                  />


                  <button
                    type="button"
                    aria-label={`Add ${dress.name} to wishlist`}
                    className="
                      absolute
                      right-2
                      top-2
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-white/85
                      text-sm
                      backdrop-blur-sm
                      transition
                      hover:bg-white
                      sm:right-3
                      sm:top-3
                      sm:h-8
                      sm:w-8
                      sm:text-base
                      md:right-4
                      md:top-4
                      md:h-9
                      md:w-9
                      md:text-lg
                    "
                  >
                    ♡
                  </button>

                </div>


                <div
                  className="
                    min-w-0
                    pt-3
                    text-center
                    sm:pt-3
                    md:pt-5
                  "
                >

                  <h3
                    className="
                      truncate
                      text-[8px]
                      font-medium
                      tracking-[0.07em]
                      sm:text-[10px]
                      sm:tracking-[0.08em]
                      md:text-sm
                      md:tracking-[0.12em]
                    "
                  >
                    {dress.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-gray-600
                      sm:mt-1.5
                      sm:text-[10px]
                      md:mt-2
                      md:text-sm
                    "
                  >
                    {dress.price}
                  </p>

                </div>

              </div>

            ))}

          </div>


          {/* VIEW ALL */}

          <div
            className="
              mt-9
              flex
              justify-center
              sm:mt-10
              md:mt-14
            "
          >

            <Link
              href="/dresses"
              className="
                w-full
                max-w-xs
                border
                border-black
                px-4
                py-3.5
                text-center
                text-[8px]
                tracking-[0.12em]
                transition
                hover:bg-black
                hover:text-white
                sm:w-auto
                sm:max-w-none
                sm:px-6
                sm:py-3.5
                sm:text-[9px]
                md:px-9
                md:py-4
                md:text-xs
                md:tracking-[0.2em]
              "
            >
              VIEW ALL NEW ARRIVALS
            </Link>

          </div>

        </div>

      </section>


      {/* ==================================================
          SHOP BY CATEGORY
      ================================================== */}

      <section
        className="
          w-full
          bg-[#faf9f7]
          px-4
          py-12
          sm:px-6
          sm:py-14
          md:px-12
          md:py-20
        "
      >

        <div className="mx-auto w-full max-w-[1700px]">

          <p
            className="
              mb-2
              text-center
              text-[8px]
              tracking-[0.3em]
              text-gray-500
              sm:mb-3
              sm:text-[9px]
              md:text-xs
              md:tracking-[0.4em]
            "
          >
            EXPLORE
          </p>

          <h2
            className="
              mb-8
              text-center
              text-base
              tracking-[0.18em]
              sm:mb-9
              sm:text-lg
              md:mb-12
              md:text-2xl
              md:tracking-[0.35em]
            "
          >
            SHOP BY CATEGORY
          </h2>


          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              md:gap-5
              lg:grid-cols-4
            "
          >

            {[
              {
                title: "MINI DRESS",
                image: "/image/image_2.png",
              },
              {
                title: "MIDI DRESS",
                image: "/image/image_3.png",
              },
              {
                title: "MAXI DRESS",
                image: "/image/image_4.png",
              },
              {
                title: "EVENING DRESS",
                image: "/image/image_5.png",
              },
            ].map((category) => (

              <div
                key={category.title}
                className="
                  group
                  relative
                  aspect-[3/4]
                  min-w-0
                  cursor-pointer
                  overflow-hidden
                "
              >

                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 50vw,
                    25vw
                  "
                  className="
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/15
                    transition
                    group-hover:bg-black/25
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    flex
                    justify-center
                    px-2
                    pb-4
                    sm:pb-5
                    md:pb-8
                  "
                >

                  <h3
                    className="
                      text-center
                      text-[7px]
                      tracking-[0.12em]
                      text-white
                      sm:text-[9px]
                      sm:tracking-[0.18em]
                      md:text-sm
                      md:tracking-[0.25em]
                    "
                  >
                    {category.title}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ==================================================
          PROMO BANNER
      ================================================== */}

      <section
        className="
          w-full
          bg-white
          px-4
          py-12
          sm:px-6
          sm:py-14
          md:px-12
          md:py-20
        "
      >

        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1700px]
            grid-cols-1
            overflow-hidden
            bg-[#eee8df]
            lg:grid-cols-2
          "
        >

          {/* IMAGE */}

          <div
            className="
              relative
              aspect-[4/5]
              w-full
              sm:min-h-[520px]
              sm:aspect-auto
            "
          >

            <Image
              src="/image/image_2.png"
              alt="Luxury fashion campaign"
              fill
              sizes="
                (max-width: 1024px) 100vw,
                50vw
              "
              className="object-cover"
            />

          </div>


          {/* CONTENT */}

          <div
            className="
              flex
              min-h-[360px]
              items-center
              px-6
              py-12
              sm:min-h-[420px]
              sm:px-8
              sm:py-12
              md:min-h-[520px]
              md:px-12
              md:py-16
              lg:px-20
            "
          >

            <div className="min-w-0">

              <p
                className="
                  mb-3
                  text-[8px]
                  tracking-[0.3em]
                  text-gray-500
                  sm:mb-4
                  sm:text-[9px]
                  md:mb-5
                  md:text-xs
                  md:tracking-[0.4em]
                "
              >
                LUMÉRA EDIT
              </p>

              <h2
                className="
                  font-serif
                  text-3xl
                  leading-[1.05]
                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                "
              >
                Made for Moments
                <br />
                That Last Forever
              </h2>

              <p
                className="
                  mt-4
                  max-w-md
                  text-[10px]
                  leading-5
                  text-gray-600
                  sm:mt-5
                  sm:text-xs
                  sm:leading-6
                  md:mt-7
                  md:text-sm
                  md:leading-7
                "
              >
                Refined silhouettes designed for quiet confidence,
                timeless elegance and unforgettable moments.
              </p>

              <button
                type="button"
                className="
                  mt-6
                  w-full
                  bg-black
                  px-5
                  py-3.5
                  text-[8px]
                  tracking-[0.16em]
                  text-white
                  transition
                  hover:bg-neutral-800
                  sm:mt-6
                  sm:w-auto
                  sm:px-7
                  sm:py-4
                  sm:text-[9px]
                  md:mt-8
                  md:px-8
                  md:text-xs
                  md:tracking-[0.2em]
                "
              >
                DISCOVER MORE
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        className="
          w-full
          border-t
          border-black/10
          bg-[#faf9f7]
          px-4
          py-12
          sm:px-6
          sm:py-14
          md:px-12
          md:py-16
        "
      >

        <div className="mx-auto w-full max-w-[1700px]">

          <div
            className="
              grid
              grid-cols-2
              gap-x-6
              gap-y-10
              sm:gap-x-8
              sm:gap-y-12
              md:grid-cols-2
              lg:grid-cols-5
            "
          >

            {/* BRAND */}

            <div
              className="
                col-span-2
                lg:col-span-2
              "
            >

              <h2
                className="
                  font-serif
                  text-xl
                  tracking-[0.18em]
                  sm:text-2xl
                  md:text-3xl
                  md:tracking-[0.2em]
                "
              >
                LUMÉRA
              </h2>

              <p
                className="
                  mt-3
                  max-w-sm
                  text-[10px]
                  leading-5
                  text-gray-600
                  sm:mt-4
                  sm:text-xs
                  sm:leading-6
                  md:mt-5
                  md:text-sm
                "
              >
                Timeless silhouettes designed for modern femininity.
                Made for women, made to last.
              </p>

            </div>


            {/* SHOP */}

            <div>

              <h3
                className="
                  mb-3
                  text-[8px]
                  font-medium
                  tracking-[0.18em]
                  sm:mb-4
                  sm:text-[9px]
                  md:mb-5
                  md:text-xs
                "
              >
                SHOP
              </h3>

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  text-[9px]
                  text-gray-600
                  sm:gap-2.5
                  sm:text-[10px]
                  md:gap-3
                  md:text-sm
                "
              >

                <Link
                  href="/"
                  className="transition hover:text-black"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/dresses"
                  className="transition hover:text-black"
                >
                  Dresses
                </Link>

                <Link
                  href="/collections"
                  className="transition hover:text-black"
                >
                  Collections
                </Link>

                <Link
                  href="/sale"
                  className="transition hover:text-black"
                >
                  Sale
                </Link>

              </div>

            </div>


            {/* CUSTOMER CARE */}

            <div>

              <h3
                className="
                  mb-3
                  text-[8px]
                  font-medium
                  tracking-[0.18em]
                  sm:mb-4
                  sm:text-[9px]
                  md:mb-5
                  md:text-xs
                "
              >
                CUSTOMER CARE
              </h3>

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  text-[9px]
                  text-gray-600
                  sm:gap-2.5
                  sm:text-[10px]
                  md:gap-3
                  md:text-sm
                "
              >

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  Shipping & Returns
                </a>

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  Size Guide
                </a>

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  FAQs
                </a>

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  Contact
                </a>

              </div>

            </div>


            {/* FOLLOW */}

            <div
              className="
                col-span-2
                md:col-span-1
              "
            >

              <h3
                className="
                  mb-3
                  text-[8px]
                  font-medium
                  tracking-[0.18em]
                  sm:mb-4
                  sm:text-[9px]
                  md:mb-5
                  md:text-xs
                "
              >
                FOLLOW US
              </h3>

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  text-[9px]
                  text-gray-600
                  sm:gap-2.5
                  sm:text-[10px]
                  md:gap-3
                  md:text-sm
                "
              >

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  Instagram
                </a>

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  Facebook
                </a>

                <a
                  href="#"
                  className="transition hover:text-black"
                >
                  TikTok
                </a>

              </div>

            </div>

          </div>


          {/* BOTTOM */}

          <div
            className="
              mt-10
              flex
              flex-col
              gap-3
              border-t
              border-black/10
              pt-5
              text-[8px]
              text-gray-500
              sm:mt-12
              sm:gap-4
              sm:pt-6
              sm:text-[9px]
              md:mt-16
              md:flex-row
              md:items-center
              md:justify-between
              md:text-xs
            "
          >

            <p>
              © 2026 LUMÉRA. All rights reserved.
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-3
                sm:gap-5
                md:gap-6
              "
            >

              <a
                href="#"
                className="hover:text-black"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="hover:text-black"
              >
                Terms & Conditions
              </a>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}