import { notFound } from "next/navigation";

import Header from "../../components/Header";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import ProductDetails from "../ProductDetails";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
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
  } = await supabaseAdmin
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
  // GET STOCK BY SIZE
  // ========================================

  const {
    data: variants,
    error: variantError,
  } = await supabaseAdmin
    .from("product_variants")
    .select("size, stock")
    .eq("product_id", product.id);

  if (variantError) {
    console.error(
      "Unable to load variants:",
      variantError
    );
  }

  // ========================================
  // SAFE VARIANTS
  // ========================================

  const safeVariants =
    variants?.map((variant) => ({
      size: variant.size,
      stock: Number(variant.stock),
    })) ?? [];

  // ========================================
  // TOTAL STOCK
  // ========================================

  const totalStock =
    safeVariants.reduce(
      (total, variant) =>
        total + variant.stock,
      0
    );

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-[#faf9f7] text-black">

      <Header active="dresses" />

      <ProductDetails
        product={{
          ...product,

          price: Number(
            product.price
          ),

          stock: totalStock,

          sizes: Array.isArray(
            product.sizes
          )
            ? product.sizes
            : [],
        }}

        variants={safeVariants}
      />

    </main>
  );
}