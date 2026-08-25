import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] text-black">

      <header className="border-b border-black/10">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:min-h-24 sm:px-8 md:px-10">

          <Link
            href="/account"
            className="font-serif text-2xl tracking-[0.2em] sm:text-3xl"
          >
            LUMÉRA
          </Link>

          <Link
            href="/account"
            className="text-[9px] tracking-[0.25em] text-black/50"
          >
            BACK TO ACCOUNT
          </Link>

        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">

        <p className="text-[9px] tracking-[0.4em] text-black/40">
          CUSTOMER CARE
        </p>

        <h1 className="mt-5 font-serif text-4xl sm:text-5xl">
          How can we help?
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-black/50">
          Our customer care team is here to assist
          with orders, delivery, returns and your
          LUMÉRA experience.
        </p>

        <div className="mt-12 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">

          <div className="bg-white p-7 sm:p-10">

            <p className="text-[9px] tracking-[0.3em] text-black/40">
              ORDERS
            </p>

            <h2 className="mt-6 font-serif text-2xl">
              Order Assistance
            </h2>

            <p className="mt-4 text-sm leading-6 text-black/50">
              Need help with an order, payment or
              delivery status?
            </p>

            <Link
              href="/account/orders"
              className="mt-8 inline-block border-b border-black pb-1 text-[9px] tracking-[0.25em]"
            >
              VIEW MY ORDERS
            </Link>

          </div>

          <div className="bg-white p-7 sm:p-10">

            <p className="text-[9px] tracking-[0.3em] text-black/40">
              CONTACT
            </p>

            <h2 className="mt-6 font-serif text-2xl">
              Contact LUMÉRA
            </h2>

            <p className="mt-4 text-sm leading-6 text-black/50">
              For personal assistance, please contact
              our customer care team.
            </p>

            <a
              href="mailto:support@lumera.com"
              className="mt-8 inline-block border-b border-black pb-1 text-[9px] tracking-[0.25em]"
            >
              EMAIL CUSTOMER CARE
            </a>

          </div>

        </div>

        <div className="mt-12 border-t border-black/10 pt-10">

          <p className="text-[9px] tracking-[0.3em] text-black/40">
            FREQUENTLY ASKED QUESTIONS
          </p>

          <div className="mt-6 divide-y divide-black/10 border-y border-black/10">

            {[
              "How can I track my order?",
              "How long does delivery take?",
              "Can I change or cancel my order?",
              "What is the return policy?",
              "How do I update my account information?",
            ].map((question) => (
              <details
                key={question}
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm">
                  <span>{question}</span>

                  <span className="text-lg transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="pb-5 pr-8 text-sm leading-6 text-black/50">
                  Please contact LUMÉRA customer care
                  for assistance with this request.
                </p>
              </details>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}