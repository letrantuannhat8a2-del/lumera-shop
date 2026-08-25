"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadWishlistState() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Khách chưa đăng nhập
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

        const data = await response.json();

        const exists = data.some(
          (item: { product_id: string }) =>
            item.product_id === productId
        );

        setLiked(exists);
      } catch (error) {
        console.error(
          "Unable to load wishlist state:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadWishlistState();
  }, [productId]);

  async function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (saving) {
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Chưa đăng nhập
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
      aria-label={
        liked
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:cursor-default"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition"
      >
        <path
          d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"
        />
      </svg>
    </button>
  );
}