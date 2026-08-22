import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function DELETE(
  request: Request,
  { 
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } = await params;


    console.log(
      "DELETE RUN:",
      id
    );



    // lấy ảnh trước khi xóa

    const {
      data: product
    } =
      await supabaseAdmin
        .from("products")
        .select(
          `
          image_1,
          image_2,
          image_3,
          image_4,
          image_5
          `
        )
        .eq(
          "id",
         
          id
        )
        .single();



    // xóa ảnh trong storage

    if(product){


      const images = [

        product.image_1,
        product.image_2,
        product.image_3,
        product.image_4,
        product.image_5

      ].filter(Boolean);



      const files =
        images.map(
          (url:string)=>
            url.split(
              "/product-image/"
            )[1]
        )
        .filter(Boolean);



      if(files.length > 0){

        await supabaseAdmin
          .storage
          .from("product-image")
          .remove(
            files
          );

      }

    }



    // xóa variants trước

    await supabaseAdmin
      .from("product_variants")
      .delete()
      .eq(
        "product_id",
       id
      );



    // xóa product

   const { data, error } = await supabaseAdmin
  .from("products")
  .delete()
  .eq("id",id)
  .select("id");


console.log(
  "DELETE RESULT:",
  data,
  error
);


if(error){
  throw error;
}

    return NextResponse.json({

      success:true

    });



  }
  catch(error){


    console.error(
      "DELETE ERROR:",
      error
    );


    return NextResponse.json(
      {
        message:
          error instanceof Error
          ? error.message
          : "Delete failed"
      },
      {
        status:500
      }
    );


  }

}