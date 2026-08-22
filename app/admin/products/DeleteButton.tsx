"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
}: {
  id: string;
}) {

  const router = useRouter();


  async function handleDelete(){

    const confirmDelete =
      confirm(
        "Delete this product?"
      );


    if(!confirmDelete)
      return;


console.log(
 "DELETE ID CLIENT:",
 id
);
    const response =
      await fetch(
        `/api/admin/products/${id}`,
        {
          method:"DELETE",
        }
      );



    const text =
  await response.text();


let result;

try {

  result = JSON.parse(text);

} catch {

  result = {
    message:text
  };

}



    if(!response.ok){

      alert(
        result.message ||
        "Delete failed"
      );

      return;

    }



    alert(
      "Product deleted"
    );


    router.refresh();


  }



  return (

    <button

      onClick={handleDelete}

      className="
        text-red-600
        underline
      "

    >

      DELETE

    </button>

  );

}