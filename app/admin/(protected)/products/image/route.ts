import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";


// ==========================
// DELETE IMAGE
// ==========================

export async function DELETE(
  request: Request
) {

  try {

    const {
      productId,
      index

    } = await request.json();



    const column =
      `image_${index}`;



    // lấy URL ảnh cũ

    const {
      data: product,
      error: fetchError

    } = await supabaseAdmin

      .from("products")

      .select(column)

      .eq(
        "id",
        productId
      )

      .single();



    if(fetchError){

      throw fetchError;

    }



    const oldUrl =
        (product as any)?.[column];



    // xóa file trong storage

    if(oldUrl){

      const filePath =
        oldUrl.split(
          "/product-image/"
        )[1];


      if(filePath){

        await supabaseAdmin

          .storage

          .from("product-image")

          .remove([
            filePath
          ]);

      }

    }



    // xóa link trong database

    const {
      error:updateError

    } = await supabaseAdmin

      .from("products")

      .update({

        [column]: null

      })

      .eq(
        "id",
        productId
      );



    if(updateError){

      throw updateError;

    }



    return NextResponse.json({

      success:true

    });



  }

  catch(error){

    console.log(error);


    return NextResponse.json(

      {
        message:
          "Delete image failed"
      },

      {
        status:500
      }

    );

  }

}




// ==========================
// UPLOAD IMAGE
// ==========================


export async function POST(
  request: Request
) {


  try {


    const formData =
      await request.formData();



    const file =
      formData.get("image") as File;



    const productId =
      String(
        formData.get("productId")
      );



    const slug =
      String(
        formData.get("slug")
      );



    const index =
      Number(
        formData.get("index")
      );



    if(!file){

      return NextResponse.json(

        {
          message:
            "No image uploaded"
        },

        {
          status:400
        }

      );

    }




    // đổi tên file cho an toàn

    const safeName =

      file.name

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
      );



    const filePath =

      `${slug}/${Date.now()}-${safeName}`;





    const buffer =

      Buffer.from(

        await file.arrayBuffer()

      );





    // upload storage

    const {
      error:uploadError

    } = await supabaseAdmin

      .storage

      .from("product-image")

      .upload(

        filePath,

        buffer,

        {

          contentType:
            file.type

        }

      );





    if(uploadError){

      throw uploadError;

    }






    // lấy public URL

    const {
      data:urlData

    } = supabaseAdmin

      .storage

      .from("product-image")

      .getPublicUrl(

        filePath

      );





    const column =

      `image_${index}`;






    // update database


    const {
      error:updateError

    } = await supabaseAdmin

      .from("products")

      .update({

        [column]:
          urlData.publicUrl

      })

      .eq(

        "id",

        productId

      );





    if(updateError){

      throw updateError;

    }





    return NextResponse.json({

      success:true,

      url:
        urlData.publicUrl

    });




  }


  catch(error){


    console.log(error);



    return NextResponse.json(

      {

        message:
          "Upload image failed"

      },

      {

        status:500

      }

    );


  }

}