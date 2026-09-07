import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase/sever";
import { paypalRequest } from "../../../lib/paypal";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type CartItemInput = {
  id: string;
  color: string;
  size: string;
  quantity: number;
};

export async function POST(
  request: Request
) {
  try {
    // =====================================================
    // 1. VERIFY LOGGED-IN USER
    // =====================================================

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError) {
      console.error(
        "Get current user error:",
        userError
      );
    }

    if (!user?.email) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to checkout.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // 2. READ REQUEST BODY
    // =====================================================

    const body =
      await request.json();

    const {
      items,
      shippingMethod,
    } = body;

    // =====================================================
    // 3. CHECK CART
    // =====================================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Shopping bag is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        {
          error:
            "Too many items in shopping bag.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 4. CHECK SHIPPING METHOD
    // =====================================================

    if (
      shippingMethod !==
        "standard" &&
      shippingMethod !==
        "express"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid shipping method.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 5. NORMALIZE CART ITEMS
    // =====================================================

    const cartItems: CartItemInput[] =
      [];

    for (
      const rawItem of items
    ) {
      if (
        !rawItem ||
        typeof rawItem.id !==
          "string" ||
        typeof rawItem.size !==
          "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid cart item.",
          },
          {
            status: 400,
          }
        );
      }

      const id =
        rawItem.id.trim();

      const size =
        rawItem.size.trim();

      // ---------------------------------------------------
      // Products without color use Ivory.
      //
      // Products with color will send their actual color.
      // ---------------------------------------------------

      const color =
        typeof rawItem.color ===
        "string"
          ? rawItem.color.trim()
          : "Ivory";

      const quantity =
        Number(
          rawItem.quantity
        );

      if (!id || !size) {
        return NextResponse.json(
          {
            error:
              "Invalid cart item.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid item quantity.",
          },
          {
            status: 400,
          }
        );
      }

      cartItems.push({
        id,
        color,
        size,
        quantity,
      });
    }

    // =====================================================
    // 6. MERGE DUPLICATE CART LINES
    //
    // IMPORTANT:
    //
    // Product + Color + Size
    //
    // Red / S
    // Black / S
    //
    // remain TWO separate lines.
    // =====================================================

    const mergedItems =
      new Map<
        string,
        CartItemInput
      >();

    for (
      const item of cartItems
    ) {
      const key =
        `${item.id}::${item.color}::${item.size}`;

      const existing =
        mergedItems.get(key);

      if (existing) {
        const newQuantity =
          existing.quantity +
          item.quantity;

        if (
          newQuantity > 100
        ) {
          return NextResponse.json(
            {
              error:
                "Maximum quantity exceeded for an item.",
            },
            {
              status: 400,
            }
          );
        }

        existing.quantity =
          newQuantity;
      } else {
        mergedItems.set(
          key,
          {
            ...item,
          }
        );
      }
    }

    const normalizedItems =
      Array.from(
        mergedItems.values()
      );

    // =====================================================
    // 7. GET PRODUCTS FROM DATABASE
    // =====================================================

    const productIds = [
      ...new Set(
        normalizedItems.map(
          (item) => item.id
        )
      ),
    ];

    const {
      data: products,
      error: productError,
    } =
      await supabaseAdmin
        .from("products")
        .select(
          `
          id,
          name,
          price,
          is_active,
          image_1,
          sizes
          `
        )
        .in(
          "id",
          productIds
        );

    if (
      productError ||
      !products
    ) {
      console.error(
        "Product lookup error:",
        productError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify products.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      products.length !==
      productIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more products are unavailable.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 8. GET PRODUCT VARIANTS
    //
    // IMPORTANT:
    // We now retrieve color too.
    // =====================================================

    const {
      data: variants,
      error: variantError,
    } =
      await supabaseAdmin
        .from("product_variants")
        .select(
          `
          product_id,
          color,
          size,
          stock
          `
        )
        .in(
          "product_id",
          productIds
        );

    if (
      variantError ||
      !variants
    ) {
      console.error(
        "Variant lookup error:",
        variantError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify product availability.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 9. CALCULATE SERVER-SIDE TOTAL
    // =====================================================

    let subtotal = 0;

    const paypalItems: {
      name: string;
      quantity: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
    }[] = [];

    for (
      const cartItem of normalizedItems
    ) {
      const product =
        products.find(
          (product) =>
            product.id ===
            cartItem.id
        );

      if (!product) {
        return NextResponse.json(
          {
            error:
              "Product not found.",
          },
          {
            status: 400,
          }
        );
      }

      // ===================================================
      // PRODUCT ACTIVE
      // ===================================================

      if (!product.is_active) {
        return NextResponse.json(
          {
            error:
              `${product.name} is currently unavailable.`,
          },
          {
            status: 400,
          }
        );
      }

      // ===================================================
      // VALIDATE SIZE
      // ===================================================

      const allowedSizes =
        Array.isArray(
          product.sizes
        )
          ? product.sizes
          : [];

      if (
        !allowedSizes.includes(
          cartItem.size
        )
      ) {
        return NextResponse.json(
          {
            error:
              `Size ${cartItem.size} is unavailable for ${product.name}.`,
          },
          {
            status: 400,
          }
        );
      }

      // ===================================================
      // FIND EXACT VARIANT
      //
      // IMPORTANT:
      //
      // product_id
      // + color
      // + size
      // ===================================================

      const variant =
        variants.find(
          (variant) =>
            variant.product_id ===
              cartItem.id &&
            variant.size ===
              cartItem.size &&
            (
              variant.color ??
              "Ivory"
            ) ===
              cartItem.color
        );

      if (!variant) {
        return NextResponse.json(
          {
            error:
              `Color ${cartItem.color}, size ${cartItem.size} is unavailable for ${product.name}.`,
          },
          {
            status: 400,
          }
        );
      }

      // ===================================================
      // CHECK EXACT VARIANT STOCK
      // ===================================================

      const stock =
        Number(
          variant.stock
        );

      if (
        !Number.isInteger(
          stock
        ) ||
        stock <
          cartItem.quantity
      ) {
        return NextResponse.json(
          {
            error:
              `Only ${Math.max(
                0,
                stock
              )} item(s) left for ${product.name} in ${cartItem.color}, size ${cartItem.size}.`,
          },
          {
            status: 400,
          }
        );
      }

      // ===================================================
      // SERVER PRICE
      // ===================================================

      const price =
        Number(
          product.price
        );

      if (
        !Number.isFinite(
          price
        ) ||
        price < 0
      ) {
        console.error(
          "Invalid product price:",
          {
            productId:
              product.id,
            price:
              product.price,
          }
        );

        return NextResponse.json(
          {
            error:
              `Invalid price for ${product.name}.`,
          },
          {
            status: 500,
          }
        );
      }

      // ===================================================
      // SUBTOTAL
      // ===================================================

      subtotal +=
        price *
        cartItem.quantity;

      // ===================================================
      // PAYPAL ITEM
      // ===================================================

      paypalItems.push({
        name:
          `${product.name} - ${cartItem.color} - Size ${cartItem.size}`,

        quantity:
          String(
            cartItem.quantity
          ),

        unit_amount: {
          currency_code:
            "USD",

          value:
            price.toFixed(2),
        },
      });
    }

    // =====================================================
    // 10. SHIPPING
    // =====================================================

    const shippingFee =
      shippingMethod ===
      "express"
        ? 57.42
        : 0;

    const safeSubtotal =
      Number(
        subtotal.toFixed(2)
      );

    const safeShippingFee =
      Number(
        shippingFee.toFixed(2)
      );

    const safeTotal =
      Number(
        (
          safeSubtotal +
          safeShippingFee
        ).toFixed(2)
      );

    // =====================================================
    // 11. FINAL TOTAL VALIDATION
    // =====================================================

    if (
      !Number.isFinite(
        safeSubtotal
      ) ||
      !Number.isFinite(
        safeShippingFee
      ) ||
      !Number.isFinite(
        safeTotal
      ) ||
      safeTotal <= 0
    ) {
      console.error(
        "Invalid calculated total:",
        {
          safeSubtotal,
          safeShippingFee,
          safeTotal,
        }
      );

      return NextResponse.json(
        {
          error:
            "Unable to calculate order total.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 12. CREATE PAYPAL ORDER
    // =====================================================

    const paypalResponse =
      await paypalRequest(
        "/v2/checkout/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            intent:
              "CAPTURE",

            purchase_units: [
              {
                amount: {
                  currency_code:
                    "USD",

                  value:
                    safeTotal.toFixed(
                      2
                    ),

                  breakdown: {
                    item_total: {
                      currency_code:
                        "USD",

                      value:
                        safeSubtotal.toFixed(
                          2
                        ),
                    },

                    shipping: {
                      currency_code:
                        "USD",

                      value:
                        safeShippingFee.toFixed(
                          2
                        ),
                    },
                  },
                },

                items:
                  paypalItems,
              },
            ],
          }),
        }
      );

    const paypalData =
      await paypalResponse.json();

    // =====================================================
    // 13. PAYPAL ERROR
    // =====================================================

    if (
      !paypalResponse.ok
    ) {
      console.error(
        "PayPal create order error:",
        paypalData
      );

      return NextResponse.json(
        {
          error:
            "Unable to create PayPal order.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 14. VERIFY PAYPAL RESPONSE
    // =====================================================

    if (
      !paypalData.id ||
      typeof paypalData.id !==
        "string"
    ) {
      console.error(
        "PayPal did not return an order ID:",
        paypalData
      );

      return NextResponse.json(
        {
          error:
            "PayPal order could not be created.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 15. RETURN DATA
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        orderId:
          paypalData.id,

        subtotal:
          safeSubtotal,

        shippingFee:
          safeShippingFee,

        total:
          safeTotal,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {

    console.error(
      "Create PayPal order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the PayPal order.",
      },
      {
        status: 500,
      }
    );
  }
}