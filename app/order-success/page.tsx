import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* BRAND */}
      <header className="flex h-24 items-center justify-center border-b border-black/10 bg-[#f8f6f2]">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.28em]"
        >
          LUMÉRA
        </Link>
      </header>

      {/* CONTENT */}
      <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-20">

        <div className="w-full max-w-[720px] text-center">

          {/* CHECK */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-black/70 text-xl">
            ✓
          </div>

          <p className="mt-9 text-[11px] tracking-[0.4em] text-gray-400">
            ORDER CONFIRMED
          </p>

          <h1 className="mt-5 font-serif text-6xl leading-none md:text-7xl">
            Thank You
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-gray-600">
            Your payment has been completed successfully.
            Your order is now being prepared with care before
            beginning its journey to you.
          </p>

          {/* PAYMENT STATUS */}
          <div className="mx-auto mt-12 max-w-xl border-y border-black/10 py-8">

            <div className="flex items-center justify-between">

              <div className="text-left">
                <p className="text-[10px] tracking-[0.25em] text-gray-400">
                  PAYMENT STATUS
                </p>

                <p className="mt-2 text-sm">
                  PayPal
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] text-white">
                  ✓
                </span>

                <span>
                  Paid
                </span>
              </div>

            </div>

          </div>

          {/* NEXT */}
          <div className="mt-10">

            <p className="text-[10px] tracking-[0.3em] text-gray-400">
              WHAT HAPPENS NEXT
            </p>

            {/* TIMELINE */}
            <div className="mx-auto mt-8 grid max-w-xl grid-cols-3">

              {/* PAYMENT */}
              <div className="relative flex flex-col items-center">

                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] text-white">
                  ✓
                </div>

                <p className="mt-4 text-[10px] tracking-[0.15em]">
                  PAYMENT
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Confirmed
                </p>

              </div>

              {/* PREPARATION */}
              <div className="relative flex flex-col items-center">

                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#f8f6f2] text-[10px]">
                  02
                </div>

                <p className="mt-4 text-[10px] tracking-[0.15em]">
                  PREPARATION
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Up next
                </p>

              </div>

              {/* SHIPPING */}
              <div className="relative flex flex-col items-center">

                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-[#f8f6f2] text-[10px] text-gray-400">
                  03
                </div>

                <p className="mt-4 text-[10px] tracking-[0.15em]">
                  SHIPPING
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Final step
                </p>

              </div>

            </div>

            <p className="mx-auto mt-9 max-w-lg text-xs leading-6 text-gray-500">
              We will send you an update once your order
              has been dispatched for international delivery.
            </p>

          </div>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/dresses"
              className="bg-black px-10 py-4 text-[10px] tracking-[0.25em] text-white transition hover:bg-neutral-800"
            >
              CONTINUE SHOPPING
            </Link>

            <Link
              href="/"
              className="border border-black px-10 py-4 text-[10px] tracking-[0.25em] transition hover:bg-black hover:text-white"
            >
              RETURN HOME
            </Link>

          </div>

          {/* SUPPORT */}
          <p className="mt-12 text-[10px] leading-5 text-gray-400">
            Need help with your order?
            <br />
            Our client care team will be happy to assist you.
          </p>

        </div>

      </section>

    </main>
  );
}