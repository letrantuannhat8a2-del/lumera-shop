import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const orderNumber =
    params.order?.trim() || "";

  return (
    <main className="min-h-screen bg-[#fcf8f6] text-[#211d1d]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="flex h-20 items-center justify-center border-b border-[#211d1d]/10 bg-[#fcf8f6] sm:h-24">

        <Link
          href="/"
          className="
            font-serif
            text-2xl
            tracking-[0.32em]
            sm:text-3xl
          "
        >
          VIREL
        </Link>

      </header>


      {/* ========================================
          CONTENT
      ======================================== */}

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

        <div className="w-full max-w-[760px] text-center">


          {/* ====================================
              SUCCESS ICON
          ==================================== */}

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-[#211d1d]/70
              bg-white
              text-lg
              sm:h-16
              sm:w-16
              sm:text-xl
            "
          >
            ✓
          </div>


          {/* ====================================
              LABEL
          ==================================== */}

          <p
            className="
              mt-7
              text-[9px]
              tracking-[0.38em]
              text-[#a88989]
              sm:mt-9
              sm:text-[10px]
              sm:tracking-[0.45em]
            "
          >
            ORDER CONFIRMED
          </p>


          {/* ====================================
              TITLE
          ==================================== */}

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


          {/* ====================================
              MESSAGE
          ==================================== */}

          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              text-xs
              leading-6
              text-[#756b6b]
              sm:mt-7
              sm:text-sm
              sm:leading-7
            "
          >
            Your payment has been completed successfully.
            Your VIREL order is now being prepared with care
            before beginning its journey to you.
          </p>


          {/* ====================================
              ORDER NUMBER
          ==================================== */}

          {orderNumber && (
            <div
              className="
                mx-auto
                mt-8
                max-w-xl
                border
                border-[#211d1d]/10
                bg-white
                px-6
                py-6
                sm:mt-10
                sm:px-8
                sm:py-7
              "
            >

              <p
                className="
                  text-[9px]
                  tracking-[0.3em]
                  text-[#a88989]
                  sm:text-[10px]
                  sm:tracking-[0.35em]
                "
              >
                ORDER NUMBER
              </p>

              <p
                className="
                  mt-3
                  font-serif
                  text-2xl
                  tracking-[0.08em]
                  sm:text-3xl
                "
              >
                {orderNumber}
              </p>

              <p className="mt-3 text-[10px] text-[#9b8d8d] sm:text-xs">
                Please keep this number for your records.
              </p>

            </div>
          )}


          {/* ====================================
              PAYMENT STATUS
          ==================================== */}

          <div
            className="
              mx-auto
              mt-9
              max-w-xl
              border-y
              border-[#211d1d]/10
              bg-white/50
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
                    text-[#a88989]
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
                    bg-[#211d1d]
                    text-[9px]
                    text-white
                  "
                >
                  ✓
                </span>

                <span>
                  Paid
                </span>

              </div>

            </div>

          </div>


          {/* ====================================
              NEXT STEPS
          ==================================== */}

          <div className="mt-9 sm:mt-10">

            <p
              className="
                text-[9px]
                tracking-[0.3em]
                text-[#a88989]
                sm:text-[10px]
                sm:tracking-[0.34em]
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
                    bg-[#211d1d]
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

                <p className="mt-1 text-[9px] text-[#a89c9c] sm:text-[10px]">
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
                    border-[#211d1d]
                    bg-[#fcf8f6]
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

                <p className="mt-1 text-[9px] text-[#a89c8c] sm:text-[10px]">
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
                    border-[#d5ccca]
                    bg-[#fcf8f6]
                    text-[10px]
                    text-[#aaa0a0]
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

                <p className="mt-1 text-[9px] text-[#a89c8c] sm:text-[10px]">
                  Final step
                </p>

              </div>

            </div>


            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-8
                max-w-lg
                text-[11px]
                leading-5
                text-[#756b6b]
                sm:mt-9
                sm:text-xs
                sm:leading-6
              "
            >
              We will send you an update once your order
              has been dispatched for international delivery.
            </p>

          </div>


          {/* ====================================
              ACTIONS
          ==================================== */}

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

            <Link
              href="/shop"
              className="
                flex
                min-h-12
                items-center
                justify-center
                bg-[#211d1d]
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                text-white
                transition
                hover:bg-[#a88989]
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              CONTINUE SHOPPING
            </Link>


            <Link
              href="/account/orders"
              className="
                flex
                min-h-12
                items-center
                justify-center
                border
                border-[#211d1d]
                bg-transparent
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                transition
                hover:bg-[#211d1d]
                hover:text-white
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              VIEW MY ORDERS
            </Link>


            <Link
              href="/"
              className="
                flex
                min-h-12
                items-center
                justify-center
                border
                border-[#211d1d]
                bg-transparent
                px-6
                py-4
                text-[9px]
                tracking-[0.22em]
                transition
                hover:bg-[#211d1d]
                hover:text-white
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              RETURN HOME
            </Link>

          </div>


          {/* ====================================
              SUPPORT
          ==================================== */}

          <div className="mt-10 sm:mt-12">

            <p
              className="
                text-[9px]
                leading-5
                text-[#a89c9c]
                sm:text-[10px]
              "
            >
              Need help with your order?
              <br />
              Our client care team will be happy to assist you.
            </p>

            <p className="mt-5 text-[8px] tracking-[0.3em] text-[#b39797]">
              VIREL · BRIDAL SHOES
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}