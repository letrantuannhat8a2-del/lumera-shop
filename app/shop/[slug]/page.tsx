import { notFound } from "next/navigation";

import Header from "../../components/Header";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import ProductDetails from "../ProductDetails";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductColor = {
  name: string;
  hex: string;
};

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  // ========================================
  // GET PRODUCT
  // ========================================

  const {
    data: product,
    error: productError,
  } =
    await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

  if (productError || !product) {
    console.error(
      "Unable to load product:",
      productError
    );

    notFound();
  }

  // ========================================
  // GET STOCK BY COLOR + SIZE
  // ========================================

  const {
    data: variants,
    error: variantError,
  } =
    await supabaseAdmin
      .from("product_variants")
      .select(
        "size, stock, color"
      )
      .eq(
        "product_id",
        product.id
      );

  if (variantError) {
    console.error(
      "Unable to load variants:",
      variantError
    );
  }

  // ========================================
  // GET ALL PRODUCT IMAGES
  // ========================================

  const {
    data: productImages,
    error: productImagesError,
  } =
    await supabaseAdmin
      .from("product_images")
      .select(
        "id, image_url, sort_order"
      )
      .eq(
        "product_id",
        product.id
      )
      .order(
        "sort_order",
        {
          ascending: true,
        }
      );

  if (productImagesError) {
    console.error(
      "Unable to load product images:",
      productImagesError
    );
  }

  // ========================================
  // BUILD IMAGE LIST
  // ========================================

  const galleryImages =
    productImages
      ?.map(
        (image) =>
          image.image_url
      )
      .filter(
        (
          image
        ): image is string =>
          typeof image ===
            "string" &&
          image.trim().length > 0
      ) ?? [];

  const legacyImages = [
    product.image_1,
    product.image_2,
    product.image_3,
    product.image_4,
    product.image_5,
  ].filter(
    (
      image
    ): image is string =>
      typeof image ===
        "string" &&
      image.trim().length > 0
  );

  const finalImages =
    galleryImages.length > 0
      ? galleryImages
      : legacyImages;

  // ========================================
  // SAFE SIZES
  // ========================================

  const sizes: string[] =
    Array.isArray(
      product.sizes
    )
      ? product.sizes.map(
          (size: unknown) =>
            String(size)
        )
      : [];

  // ========================================
// SAFE COLORS
// ========================================

const colors: ProductColor[] =
  Array.isArray(product.colors)
    ? product.colors
        .map(
          (
            color: unknown
          ): ProductColor | null => {
            if (
              !color ||
              typeof color !== "object"
            ) {
              return null;
            }

            const item =
              color as {
                name?: unknown;
                hex?: unknown;
              };

            const name =
              String(
                item.name ?? ""
              ).trim();

            const hex =
              String(
                item.hex ??
                  "#F3EEE8"
              ).trim();

            if (!name) {
              return null;
            }

            return {
              name,
              hex,
            };
          }
        )
        .filter(
          (
            color: ProductColor | null
          ): color is ProductColor =>
            color !== null
        )
    : [];
  // ========================================
  // SAFE VARIANTS
  // ========================================

  const safeVariants =
    variants?.map(
      (variant) => ({
        size:
          String(
            variant.size
          ),

        stock:
          Number(
            variant.stock
          ),

        color:
          String(
            variant.color ??
              ""
          ),
      })
    ) ?? [];

  // ========================================
  // TOTAL STOCK
  // ========================================

  const totalStock =
    safeVariants.reduce(
      (
        total,
        variant
      ) =>
        total +
        Math.max(
          0,
          Number(
            variant.stock
          ) || 0
        ),
      0
    );

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-[#faf9f7] text-black">

      <Header active="shop" />

      <ProductDetails
        product={{
          ...product,

          price:
            Number(
              product.price
            ),

          currency:
            product.currency ||
            "USD",

          stock:
            totalStock,

          sizes,

          colors,

          images:
            finalImages,
        }}

        variants={
          safeVariants
        }
      />

    </main>
  );
}