"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistRemoveButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleRemove() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/wishlist",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              product_id:
                productId,
            }),
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to remove item."
        );
      }

      // Refresh server component
      router.refresh();

    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove item."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={loading}
      className="
        mt-3
        text-[8px]
        tracking-[0.18em]
        text-[#8a7979]
        underline
        underline-offset-4
        transition
        hover:text-black
        disabled:opacity-50
      "
    >
      {loading
        ? "REMOVING..."
        : "REMOVE"}
    </button>
  );
}