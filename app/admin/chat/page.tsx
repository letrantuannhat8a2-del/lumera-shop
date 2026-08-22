import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "../../lib/supabase/sever";


export default async function AdminChatPage() {

  const supabase = await createClient();


  const {
    data: {
      user
    },
  } = await supabase.auth.getUser();


  if(!user){
    redirect("/admin/login");
  }


  const adminEmail =
    process.env.ADMIN_EMAIL;


  if(
    !adminEmail ||
    user.email !== adminEmail
  ){
    redirect("/admin/login");
  }



  return (

    <main className="min-h-screen bg-[#f8f6f2] text-black">


      {/* HEADER */}

      <header className="border-b border-black/10 bg-white px-10 py-7">

        <div className="flex items-center justify-between">


          <div>

            <h1 className="font-serif text-2xl tracking-[0.25em]">
              LUMÉRA
            </h1>


            <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
              ADMINISTRATION
            </p>

          </div>



          <nav className="flex gap-8 text-[10px] tracking-[0.18em]">


            <Link
              href="/admin/products"
              className="text-gray-400 hover:text-black"
            >
              PRODUCTS
            </Link>


            <Link
              href="/admin/orders"
              className="text-gray-400 hover:text-black"
            >
              ORDERS
            </Link>


            <Link
              href="/admin/chat"
              className="border-b border-black pb-1"
            >
              CHAT
            </Link>


          </nav>


        </div>


      </header>




      {/* CONTENT */}


      <section className="px-10 py-12">


        <p className="text-[10px] tracking-[0.3em] text-gray-400">
          CUSTOMER SERVICE
        </p>


        <h2 className="mt-3 font-serif text-5xl">
          Customer Chat
        </h2>



        <div className="mt-12 border border-black/10 bg-white p-10">


          <h3 className="font-serif text-2xl">
            Manage conversations
          </h3>



          <p className="mt-4 max-w-xl text-sm text-gray-500">

            Customer messages are handled through
            LUMÉRA Support. Open the live chat dashboard
            to reply to customers in real time.

          </p>




          <a
            href="https://dashboard.tawk.to/#/chat"
            target="_blank"
            className="mt-8 inline-block bg-black px-8 py-4 text-[10px] tracking-[0.2em] text-white"
          >

            OPEN CHAT DASHBOARD

          </a>



        </div>


      </section>



    </main>

  );

}