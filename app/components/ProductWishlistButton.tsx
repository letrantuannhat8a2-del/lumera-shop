"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function ProductWishlistButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkWishlist() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLiked(false);
          setLoading(false);
          return;
        }

        const response =
          await fetch("/api/wishlist");

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const wishlist =
          await response.json();

        const exists = wishlist.some(
          (item: {
            product_id: string;
          }) =>
            item.product_id === productId
        );

        setLiked(exists);
      } catch (error) {
        console.error(
          "Wishlist check error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    checkWishlist();
  }, [productId]);

  async function handleWishlist() {
    if (saving) {
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/account/login");
      return;
    }

    try {
      setSaving(true);

      if (liked) {
        const response =
          await fetch("/api/wishlist", {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              product_id: productId,
            }),
          });

        if (!response.ok) {
          throw new Error(
            "Unable to remove wishlist item."
          );
        }

        setLiked(false);
      } else {
        const response =
          await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              product_id: productId,
            }),
          });

        if (!response.ok) {
          throw new Error(
            "Unable to add wishlist item."
          );
        }

        setLiked(true);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading || saving}
      className={`w-full border py-4 text-[10px] tracking-[0.25em] transition ${
        liked
          ? "border-black bg-black text-white"
          : "border-black/20 bg-white text-black hover:border-black"
      }`}
    >
      {loading
        ? "CHECKING WISHLIST..."
        : liked
        ? "♥ ADDED TO WISHLIST"
        : "ADD TO WISHLIST"}
    </button>
  );
}