import Link from "next/link";

import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#201b1b]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-black/10 bg-[#fcfaf7]">

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

          {/* HOME */}

          <Link
            href="/"
            className="text-[8px] tracking-[0.2em] transition hover:text-[#b47d7f]"
          >
            HOME
          </Link>

        </div>

      </header>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="px-6 pb-16 pt-20 sm:px-10 sm:pt-24">

        <div className="mx-auto max-w-[1000px]">

          {/* TITLE */}

          <div className="text-center">

            <p className="text-[8px] tracking-[0.4em] text-[#a77d7f]">
              VIREL
            </p>

            <h1 className="mt-5 font-serif text-5xl sm:text-6xl">
              Search
            </h1>

          </div>


          {/* LIVE SEARCH */}

          <div className="mt-12">

            <SearchResults />

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