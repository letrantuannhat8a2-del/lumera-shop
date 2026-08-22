import Image from "next/image";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-black">
    <Header />

      {/* HERO */}
      <section className="flex min-h-[650px] items-center bg-[#eee5da] px-24">
        <div className="w-1/2">
          <p className="mb-5 text-sm tracking-[0.4em]">
            SUMMER 2026
          </p>

          <h2 className="font-serif text-7xl leading-[0.95]">
            EFFORTLESS
            <br />
            ELEGANCE
          </h2>

          <p className="mt-8 max-w-md text-gray-700">
            Timeless dresses. Modern silhouettes.
            <br />
            Made to move with you.
          </p>

          <button className="mt-8 bg-black px-8 py-4 text-sm tracking-widest text-white">
            SHOP COLLECTION
          </button>
        </div>

        <div className="relative h-[520px] w-1/2 overflow-hidden">
          <Image
            src="/image/image_1.png"
            alt="Luxury white dress"
            fill
            className="object-cover object-top"
            priority
            />
        </div>
      </section>

      {/* NEW ARRIVALS */}
<section className="bg-white px-12 py-20">
  <div className="mx-auto max-w-[1700px]">
    <p className="mb-3 text-center text-xs tracking-[0.4em] text-gray-500">
      DISCOVER
    </p>

    <h2 className="mb-12 text-center text-2xl tracking-[0.35em]">
      NEW ARRIVALS
    </h2>

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        <div key={dress.name} className="group cursor-pointer">
          
          {/* PRODUCT IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#eee9e3]">
            <Image
              src={dress.image}
              alt={dress.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />

            {/* HEART */}
            <button
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center
              rounded-full bg-white/80 text-xl backdrop-blur-sm transition
              hover:bg-white"
            >
              ♡
            </button>
          </div>

          {/* PRODUCT INFO */}
          <div className="pt-5 text-center">
            <h3 className="text-sm font-medium tracking-[0.12em]">
              {dress.name}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {dress.price}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* VIEW ALL */}
    <div className="mt-14 flex justify-center">
      <button
        className="border border-black px-9 py-4 text-xs tracking-[0.2em]
        transition hover:bg-black hover:text-white"
      >
        VIEW ALL NEW ARRIVALS
      </button>
    </div>
  </div>
</section>
{/* SHOP BY CATEGORY */}
<section className="bg-[#faf9f7] px-12 py-20">
  <div className="mx-auto max-w-[1700px]">

    <p className="mb-3 text-center text-xs tracking-[0.4em] text-gray-500">
      EXPLORE
    </p>

    <h2 className="mb-12 text-center text-2xl tracking-[0.35em]">
      SHOP BY CATEGORY
    </h2>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {/* MINI DRESS */}
      <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden">
        <Image
          src="/image/image_2.png"
          alt="Mini Dress"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />

        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h3 className="text-sm tracking-[0.25em] text-white">
            MINI DRESS
          </h3>
        </div>
      </div>

      {/* MIDI DRESS */}
      <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden">
        <Image
          src="/image/image_3.png"
          alt="Midi Dress"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />

        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h3 className="text-sm tracking-[0.25em] text-white">
            MIDI DRESS
          </h3>
        </div>
      </div>

      {/* MAXI DRESS */}
      <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden">
        <Image
          src="/image/image_4.png"
          alt="Maxi Dress"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />

        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h3 className="text-sm tracking-[0.25em] text-white">
            MAXI DRESS
          </h3>
        </div>
      </div>

      {/* EVENING DRESS */}
      <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden">
        <Image
          src="/image/image_5.png"
          alt="Evening Dress"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />

        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h3 className="text-sm tracking-[0.25em] text-white">
            EVENING DRESS
          </h3>
        </div>
      </div>

    </div>
  </div>
</section>
{/* PROMO BANNER */}
<section className="bg-white px-12 py-20">
  <div className="mx-auto grid max-w-[1700px] grid-cols-1 overflow-hidden bg-[#eee8df] lg:grid-cols-2">

    {/* IMAGE */}
    <div className="relative min-h-[520px]">
      <Image
        src="/image/image_2.png"
        alt="Luxury fashion campaign"
        fill
        className="object-cover"
      />
    </div>

    {/* CONTENT */}
    <div className="flex min-h-[520px] items-center px-12 py-16 lg:px-20">
      <div>
        <p className="mb-5 text-xs tracking-[0.4em] text-gray-500">
          LUMÉRA EDIT
        </p>

        <h2 className="font-serif text-5xl leading-[1.05] lg:text-6xl">
          Made for Moments
          <br />
          That Last Forever
        </h2>

        <p className="mt-7 max-w-md leading-7 text-gray-600">
          Refined silhouettes designed for quiet confidence,
          timeless elegance and unforgettable moments.
        </p>

        <button
          className="mt-9 bg-black px-8 py-4 text-xs tracking-[0.2em]
          text-white transition hover:bg-neutral-800"
        >
          DISCOVER MORE
        </button>
      </div>
    </div>

  </div>
</section>
{/* FOOTER */}
<footer className="border-t border-black/10 bg-[#faf9f7] px-12 py-16">
  <div className="mx-auto max-w-[1700px]">

    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">

      {/* BRAND */}
      <div className="lg:col-span-2">
        <h2 className="font-serif text-3xl tracking-[0.2em]">
          LUMÉRA
        </h2>

        <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600">
          Timeless silhouettes designed for modern femininity.
          Made for women, made to last.
        </p>
      </div>

      {/* SHOP */}
      <div>
        <h3 className="mb-5 text-xs font-medium tracking-[0.2em]">
          SHOP
        </h3>

        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <a href="#" className="transition hover:text-black">
            New Arrivals
          </a>

          <a href="#" className="transition hover:text-black">
            Dresses
          </a>

          <a href="#" className="transition hover:text-black">
            Collections
          </a>

          <a href="#" className="transition hover:text-black">
            Sale
          </a>
        </div>
      </div>

      {/* CUSTOMER CARE */}
      <div>
        <h3 className="mb-5 text-xs font-medium tracking-[0.2em]">
          CUSTOMER CARE
        </h3>

        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <a href="#" className="transition hover:text-black">
            Shipping & Returns
          </a>

          <a href="#" className="transition hover:text-black">
            Size Guide
          </a>

          <a href="#" className="transition hover:text-black">
            FAQs
          </a>

          <a href="#" className="transition hover:text-black">
            Contact
          </a>
        </div>
      </div>

      {/* FOLLOW */}
      <div>
        <h3 className="mb-5 text-xs font-medium tracking-[0.2em]">
          FOLLOW US
        </h3>

        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <a href="#" className="transition hover:text-black">
            Instagram
          </a>

          <a href="#" className="transition hover:text-black">
            Facebook
          </a>

          <a href="#" className="transition hover:text-black">
            TikTok
          </a>
        </div>
      </div>

    </div>

    {/* BOTTOM */}
    <div className="mt-16 flex flex-col gap-4 border-t border-black/10 pt-8 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

      <p>
        © 2026 LUMÉRA. All rights reserved.
      </p>

      <div className="flex gap-6">
        <a href="#" className="hover:text-black">
          Privacy Policy
        </a>

        <a href="#" className="hover:text-black">
          Terms & Conditions
        </a>
      </div>

    </div>

  </div>
</footer>
    </main>
  );
  
}