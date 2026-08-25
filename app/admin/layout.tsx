import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-black">

      {/* ADMIN HEADER */}
      <header className="border-b border-black/10 px-10 py-7">

        <div className="flex items-center justify-between">


          {/* LOGO */}

          <div>

            <h1 className="font-serif text-2xl tracking-[0.25em]">
              LUMÉRA
            </h1>

            <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
              ADMINISTRATION
            </p>

          </div>


          {/* MENU */}

          <nav className="flex gap-10 text-[11px] tracking-[0.25em]">

            <Link
              href="/admin/orders"
              className="hover:opacity-60"
            >
              ORDERS
            </Link>


            <Link
              href="/admin/products"
              className="hover:opacity-60"
            >
              PRODUCTS
            </Link>


          </nav>


        </div>

      </header>


      {/* PAGE CONTENT */}

      {children}


    </div>
  );
}