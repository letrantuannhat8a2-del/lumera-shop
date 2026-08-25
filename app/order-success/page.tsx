import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      {/* HEADER */}
      <header className="flex h-20 items-center justify-center border-b border-black/10 bg-[#f8f6f2] sm:h-24">
        <Link
          href="/"
          className="
            font-serif
            text-2xl
            tracking-[0.28em]
            sm:text-3xl
          "
        >
          LUMÉRA
        </Link>
      </header>

      {/* CONTENT */}
      <section
        className="
          flex
          min-h-[calc(100vh-80px)]
          items-center
          justify-center
          px-5
          py-14
          sm:min-h-[calc(100vh-96px)]
          sm:px-6
          sm:py-20
        "
      >
        <div className="w-full max-w-[720px] text-center">

          {/* CHECK */}
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-black/70
              text-lg
              sm:h-14
              sm:w-14
              sm:text-xl
            "
          >
            ✓
          </div>

          <p
            className="
              mt-7
              text-[9px]
              tracking-[0.35em]
              text-gray-400
              sm:mt-9
              sm:text-[11px]
              sm:tracking-[0.4em]
            "
          >
            ORDER CONFIRMED
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-5xl
              leading-none
              sm:mt-5
              sm:text-6xl
              md:text-7xl
            "
          >
            Thank You
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              text-xs
              leading-6
              text-gray-600
              sm:mt-7
              sm:text-sm
              sm:leading-7
            "
          >
            Your payment has been completed successfully.
            Your order is now being prepared with care before
            beginning its journey to you.
          </p>

          {/* PAYMENT STATUS */}
          <div
            className="
              mx-auto
              mt-9
              max-w-xl
              border-y
              border-black/10
              py-6
              sm:mt-12
              sm:py-8
            "
          >
            <div className="flex items-center justify-between gap-4">

              <div className="text-left">
                <p
                  className="
                    text-[9px]
                    tracking-[0.22em]
                    text-gray-400
                    sm:text-[10px]
                    sm:tracking-[0.25em]
                  "
                >
                  PAYMENT STATUS
                </p>

                <p className="mt-2 text-xs sm:text-sm">
                  PayPal
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-[9px]
                    text-white
                  "
                >
                  ✓
                </span>

                <span>Paid</span>
              </div>

            </div>
          </div>

          {/* NEXT */}
          <div className="mt-9 sm:mt-10">

            <p
              className="
                text-[9px]
                tracking-[0.28em]
                text-gray-400
                sm:text-[10px]
                sm:tracking-[0.3em]
              "
            >
              WHAT HAPPENS NEXT
            </p>

            {/* TIMELINE */}
            <div
              className="
                mx-auto
                mt-7
                grid
                max-w-xl
                grid-cols-3
                sm:mt-8
              "
            >

              {/* PAYMENT */}
              <div className="relative flex flex-col items-center">

                <div
                  className="
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-[10px]
                    text-white
                  "
                >
                  ✓
                </div>

                <p
                  className="
                    mt-3
                    text-[8px]
                    tracking-[0.12em]
                    sm:mt-4
                    sm:text-[10px]
                    sm:tracking-[0.15em]
                  "
                >
                  PAYMENT
                </p>

                <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">
                  Confirmed
                </p>

              </div>

              {/* PREPARATION */}
              <div className="relative flex flex-col items-center">

                <div
                  className="
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black
                    bg-[#f8f6f2]
                    text-[10px]
                  "
                >
                  02
                </div>

                <p
                  className="
                    mt-3
                    text-[8px]
                    tracking-[0.12em]
                    sm:mt-4
                    sm:text-[10px]
                    sm:tracking-[0.15em]
                  "
                >
                  PREPARATION
                </p>

                <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">
                  Up next
                </p>

              </div>

              {/* SHIPPING */}
              <div className="relative flex flex-col items-center">

                <div
                  className="
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-300
                    bg-[#f8f6f2]
                    text-[10px]
                    text-gray-400
                  "
                >
                  03
                </div>

                <p
                  className="
                    mt-3
                    text-[8px]
                    tracking-[0.12em]
                    sm:mt-4
                    sm:text-[10px]
                    sm:tracking-[0.15em]
                  "
                >
                  SHIPPING
                </p>

                <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">
                  Final step
                </p>

              </div>

            </div>

            <p
              className="
                mx-auto
                mt-8
                max-w-lg
                text-[11px]
                leading-5
                text-gray-500
                sm:mt-9
                sm:text-xs
                sm:leading-6
              "
            >
              We will send you an update once your order
              has been dispatched for international delivery.
            </p>

          </div>

          {/* ACTIONS */}
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-3
              sm:mt-12
              sm:grid-cols-3
            "
          >

            {/* CONTINUE SHOPPING */}
            <Link
              href="/dresses"
              className="
                flex
                min-h-12
                items-center
                justify-center
                bg-black
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                text-white
                transition
                hover:bg-neutral-800
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              CONTINUE SHOPPING
            </Link>

            {/* VIEW ORDERS */}
            <Link
              href="/account/orders"
              className="
                flex
                min-h-12
                items-center
                justify-center
                border
                border-black
                bg-transparent
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                transition
                hover:bg-black
                hover:text-white
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              VIEW MY ORDERS
            </Link>

            {/* RETURN HOME */}
            <Link
              href="/"
              className="
                flex
                min-h-12
                items-center
                justify-center
                border
                border-black
                bg-transparent
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                transition
                hover:bg-black
                hover:text-white
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              RETURN HOME
            </Link>

          </div>

          {/* SUPPORT */}
          <p
            className="
              mt-10
              text-[9px]
              leading-5
              text-gray-400
              sm:mt-12
              sm:text-[10px]
            "
          >
            Need help with your order?
            <br />
            Our client care team will be happy to assist you.
          </p>

        </div>
      </section>

    </main>
  );
}