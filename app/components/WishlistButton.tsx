"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../lib/supabase/client";

type WishlistResponseItem = {
  id: string;
  product_id: string;
  created_at: string;
};

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [liked, setLiked] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // LOAD WISHLIST STATE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadWishlistState() {
      try {
        setLoading(true);

        const supabase =
          createClient();

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (cancelled) {
          return;
        }

        // ===============================================
        // NOT LOGGED IN
        // ===============================================

        if (!user) {
          setLiked(false);
          return;
        }

        // ===============================================
        // GET WISHLIST
        // ===============================================

        const response =
          await fetch(
            "/api/wishlist",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          setLiked(false);
          return;
        }

        const data =
          (await response.json()) as WishlistResponseItem[];

        if (!Array.isArray(data)) {
          setLiked(false);
          return;
        }

        const exists =
          data.some(
            (item) =>
              item.product_id ===
              productId
          );

        if (!cancelled) {
          setLiked(exists);
        }
      } catch (error) {
        console.error(
          "Unable to load wishlist state:",
          error
        );

        if (!cancelled) {
          setLiked(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWishlistState();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // =====================================================
  // HANDLE WISHLIST
  // =====================================================

  async function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const supabase =
        createClient();

      // ===============================================
      // CHECK USER
      // ===============================================

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push(
          "/account/login"
        );

        return;
      }

      // ===============================================
      // REMOVE
      // ===============================================

      if (liked) {
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

        const result =
          await response.json().catch(
            () => null
          );

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Unable to remove wishlist item."
          );
        }

        // Update UI immediately
        setLiked(false);

        return;
      }

      // ===============================================
      // ADD
      // ===============================================

      const response =
        await fetch(
          "/api/wishlist",
          {
            method: "POST",

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

      const result =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to add wishlist item."
        );
      }

      // API may return 201
      // or 200 when item already exists.
      setLiked(true);

    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update wishlist."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={
        loading || saving
      }
      aria-label={
        liked
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      aria-pressed={liked}
      className="
        absolute
        right-4
        top-4
        z-10
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white/90
        backdrop-blur-sm
        transition
        hover:scale-105
        hover:bg-white
        disabled:cursor-default
        disabled:opacity-70
      "
    >
      {saving ? (
        <span className="text-[10px]">
          …
        </span>
      ) : (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill={
            liked
              ? "currentColor"
              : "none"
          }
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
      )}
    </button>
  );
}