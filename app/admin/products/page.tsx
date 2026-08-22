import Link from "next/link";
import { redirect } from "next/navigation";

import DeleteButton from "./DeleteButton";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";


type Variant = {
  product_id: string;
  size: string;
  stock: number;
};



export default async function AdminProductsPage() {


  // =========================
  // CHECK ADMIN LOGIN
  // =========================


  const supabase =
    await createClient();


  const {
    data:{
      user
    }

  } = await supabase.auth.getUser();



  const adminEmail =
    process.env.ADMIN_EMAIL;



  if(
    !user ||
    !adminEmail ||
    user.email !== adminEmail
  ){

    redirect(
      "/admin/login"
    );

  }





  // =========================
  // GET PRODUCTS
  // =========================


  const {
    data:products,
    error:productError

  } = await supabaseAdmin

    .from("products")

    .select("*")

    .order(
      "created_at",
      {
        ascending:false
      }
    );



  if(productError){

    console.error(
      "Unable to load products:",
      productError
    );

  }





  // =========================
  // GET SIZE STOCK
  // =========================


  const {
    data:variants,
    error:variantError

  } = await supabaseAdmin

    .from("product_variants")

    .select(
      "product_id,size,stock"
    );



  if(variantError){

    console.error(
      "Unable to load variants:",
      variantError
    );

  }




  const formatUSD = (
    value:number
  ) =>

    new Intl.NumberFormat(
      "en-US",
      {
        style:"currency",
        currency:"USD"
      }

    ).format(value);





  return (

    <main className="
      min-h-screen
      bg-[#f8f6f2]
      text-black
    ">



      {/* HEADER */}

      <header className="
        border-b
        border-black/10
        bg-white
        px-10
        py-7
      ">


        <div className="
          flex
          items-center
          justify-between
        ">


          <div>

            <h1 className="
              font-serif
              text-2xl
              tracking-[0.25em]
            ">
              LUMÉRA
            </h1>


            <p className="
              mt-2
              text-[9px]
              tracking-[0.3em]
              text-gray-400
            ">
              ADMINISTRATION
            </p>


          </div>




          <nav className="
            flex
            items-center
            gap-8
            text-[10px]
            tracking-[0.18em]
          ">


            <Link
              href="/admin/orders"
              className="
                text-gray-400
                hover:text-black
              "
            >
              ORDERS
            </Link>



            <Link
              href="/admin/products"
              className="
                border-b
                border-black
                pb-1
              "
            >
              PRODUCTS
            </Link>


          </nav>


        </div>


      </header>





      {/* CONTENT */}


      <section className="
        px-10
        py-12
      ">


        <div className="
          flex
          items-end
          justify-between
        ">


          <div>


            <p className="
              text-[10px]
              tracking-[0.3em]
              text-gray-400
            ">
              LUMÉRA MANAGEMENT
            </p>


            <h2 className="
              mt-3
              font-serif
              text-5xl
            ">
              Products
            </h2>


          </div>




          <div className="
            flex
            items-center
            gap-6
          ">


            <p className="
              text-sm
              text-gray-500
            ">
              {products?.length ?? 0} products
            </p>



            <Link
              href="/admin/products/new"
              className="
                bg-black
                px-6
                py-4
                text-[10px]
                tracking-[0.2em]
                text-white
              "
            >
              ADD PRODUCT
            </Link>



          </div>



        </div>
                {/* PRODUCTS */}

        <div className="
          mt-12
        ">


          {
            !products ||
            products.length === 0 ? (

              <div className="
                border
                border-black/10
                bg-white
                px-8
                py-20
                text-center
              ">

                <p className="
                  font-serif
                  text-2xl
                ">
                  No products yet
                </p>

              </div>


            ) : (


              <div className="
                space-y-5
              ">


                {
                  products.map(
                    (product)=>{


                      const productVariants =
                        (
                          variants as Variant[] | null
                        )
                        ?.filter(
                          (variant)=>
                            variant.product_id ===
                            product.id
                        )
                        ?? [];



                      const totalStock =
                        productVariants.reduce(
                          (
                            total,
                            variant
                          )=>

                            total +
                            Number(
                              variant.stock
                            ),

                          0

                        );




                      return (

                        <div

                          key={
                            product.id
                          }

                          className="
                            border
                            border-black/10
                            bg-white
                            p-7
                          "

                        >



                          <div className="
                            grid
                            grid-cols-1
                            gap-8
                            lg:grid-cols-[1.2fr_0.8fr_1.5fr_0.7fr]
                            lg:items-center
                          ">



                            {/* PRODUCT */}

                            <div>


                              <p className="
                                text-[9px]
                                tracking-[0.25em]
                                text-gray-400
                              ">
                                PRODUCT
                              </p>



                              <h3 className="
                                mt-3
                                font-serif
                                text-2xl
                              ">
                                {
                                  product.name
                                }
                              </h3>



                              <p className="
                                mt-2
                                text-xs
                                text-gray-400
                              ">
                                {
                                  product.id
                                }
                              </p>



                            </div>





                            {/* PRICE */}

                            <div>


                              <p className="
                                text-[9px]
                                tracking-[0.25em]
                                text-gray-400
                              ">
                                PRICE
                              </p>



                              <p className="
                                mt-3
                                text-sm
                              ">
                                {
                                  formatUSD(
                                    Number(
                                      product.price
                                    )
                                  )
                                }
                              </p>


                            </div>






                            {/* INVENTORY */}

                            <div>


                              <div className="
                                flex
                                items-center
                                justify-between
                              ">


                                <p className="
                                  text-[9px]
                                  tracking-[0.25em]
                                  text-gray-400
                                ">
                                  INVENTORY
                                </p>



                                <p className="
                                  text-[10px]
                                  text-gray-400
                                ">
                                  {
                                    totalStock
                                  }
                                  {" "}
                                  total
                                </p>


                              </div>





                              <div className="
                                mt-4
                                grid
                                grid-cols-5
                                gap-2
                              ">


                                {
                                  productVariants.map(
                                    (
                                      variant
                                    )=>(


                                      <div

                                        key={
                                          variant.size
                                        }

                                        className={`
                                          border
                                          px-3
                                          py-3
                                          text-center
                                          ${
                                            Number(
                                              variant.stock
                                            ) === 0
                                            ?
                                            "border-red-100 bg-red-50"
                                            :
                                            "border-black/10 bg-[#faf9f7]"
                                          }
                                        `}

                                      >


                                        <p className="
                                          text-[10px]
                                          tracking-[0.12em]
                                        ">
                                          {
                                            variant.size
                                          }
                                        </p>



                                        <p className={`
                                          mt-2
                                          text-sm
                                          ${
                                            Number(
                                              variant.stock
                                            ) === 0
                                            ?
                                            "text-red-600"
                                            :
                                            ""
                                          }
                                        `}>

                                          {
                                            variant.stock
                                          }

                                        </p>


                                      </div>


                                    )
                                  )
                                }


                              </div>


                            </div>
<Link
 href="/admin/chat"
 className="text-gray-400 hover:text-black"
>
 CHAT
</Link>





                            {/* STATUS + ACTION */}

                            <div className="
                              lg:text-right
                            ">



                              <p className="
                                text-[9px]
                                tracking-[0.25em]
                                text-gray-400
                              ">
                                STATUS
                              </p>




                              <div className="
                                mt-3
                              ">


                                <span

                                  className={`

                                    inline-block

                                    rounded-full

                                    px-4

                                    py-2

                                    text-[9px]

                                    tracking-[0.15em]

                                    ${
                                      product.is_active

                                      ?

                                      "bg-green-50 text-green-700"

                                      :

                                      "bg-gray-100 text-gray-500"

                                    }

                                  `}

                                >

                                  {
                                    product.is_active
                                    ?
                                    "ACTIVE"
                                    :
                                    "HIDDEN"
                                  }


                                </span>


                              </div>





                              <div className="
                                mt-5
                                flex
                                justify-end
                                gap-5
                                text-[10px]
                                tracking-[0.15em]
                              ">


                                <Link

                                  href={`/admin/products/${product.id}`}

                                  className="
                                    underline
                                  "

                                >

                                  EDIT PRODUCT

                                </Link>

<DeleteButton
  id={product.id}
/>



                                <DeleteButton

                                  id={
                                    product.id
                                  }

                                />


                              </div>



                            </div>




                          </div>



                        </div>


                      );

                    }

                  )
                }


              </div>


            )

          }


        </div>



      </section>


    </main>

  );


}