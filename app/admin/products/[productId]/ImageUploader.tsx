"use client";

import { useState } from "react";

type Props = {
  productId: string;
  slug: string;
  images: (string | null)[];
};


export default function ImageUploader({
  productId,
  slug,
  images,
}: Props) {

  const [loading,setLoading] =
    useState(false);


  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>,
    index:number
  ){

    const file =
      e.target.files?.[0];


    if(!file) return;


    const formData =
      new FormData();


    formData.append(
      "image",
      file
    );


    formData.append(
      "productId",
      productId
    );


    formData.append(
      "slug",
      slug
    );


    formData.append(
      "index",
      String(index)
    );


    setLoading(true);


    const response =
      await fetch(
        "/admin/products/image",
        {
          method:"POST",
          body:formData
        }
      );


    setLoading(false);


    if(!response.ok){

      const error =
        await response.json();

      alert(
        error.message ||
        "Upload failed"
      );

      return;
    }


    window.location.reload();

  }

async function removeImage(index:number){

  const confirmDelete =
    confirm("Remove this image?");

  if(!confirmDelete) return;


  const response =
    await fetch(
      "/api/admin/products/image",
      {
        method:"DELETE",

        headers:{
          "Content-Type":
            "application/json",
        },

        body:JSON.stringify({

          productId,

          slug,

          index

        })

      }
    );


  const data =
    await response.json();


  if(!response.ok){

    alert(
      data.message ||
      "Delete failed"
    );

    return;

  }


  window.location.reload();

}

  return (

    <div className="bg-white p-8">


      <h3 className="text-[11px] tracking-[0.25em]">
        PRODUCT IMAGES
      </h3>


      <div className="mt-7 space-y-6">


        {
          images.map(
            (image,index)=>(

            <div
              key={index}
              className="border border-black/10 p-4"
            >


              {
                image &&

                <img
                  src={image}
                  alt=""
                  className="
                  h-48
                  w-full
                  object-cover
                  "
                />

              }


              <label
                className="
                mt-4
                block
                text-[10px]
                tracking-[0.18em]
                text-gray-400
                "
              >

                IMAGE {index+1}


                <input
                  type="file"
                  accept="image/*"
                  onChange={(e)=>
                    uploadImage(
                      e,
                      index+1
                    )
                  }
                  className="
                  mt-3
                  block
                  text-xs
                  "
                />
              {
 image &&

 <button

 onClick={()=>
   removeImage(index+1)
 }

 className="
 mt-4
 text-xs
 tracking-widest
 text-red-500
 "

 >

 REMOVE IMAGE

 </button>

}

              </label>


            </div>

            )
          )
        }


      </div>


      {
        loading &&

        <p className="mt-5 text-xs text-gray-400">
          Uploading...
        </p>

      }


    </div>

  );
}