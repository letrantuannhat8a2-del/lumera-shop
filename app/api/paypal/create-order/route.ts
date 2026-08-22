import { NextResponse } from "next/server";

import { paypalRequest } from "../../../lib/paypal";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type CartItemInput = {
  id: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      items,
      shippingMethod,
    } = body;

    // =========================
    // CHECK CART
    // =========================

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

    // =========================
    // CHECK SHIPPING
    // =========================

    if (
      shippingMethod !== "standard" &&
      shippingMethod !== "express"
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

    const cartItems =
      items as CartItemInput[];

    // =========================
    // VALIDATE CART ITEMS
    // =========================

    for (const item of cartItems) {
      if (
        !item.id ||
        !item.size ||
        !Number.isInteger(
          Number(item.quantity)
        ) ||
        Number(item.quantity) < 1
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
    }

    // =========================
    // GET PRODUCTS
    // =========================

    const productIds = [
      ...new Set(
        cartItems.map(
          (item) => item.id
        )
      ),
    ];

    const {
      data: products,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, price, is_active"
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

    // =========================
    // GET SIZE STOCK
    // =========================

    const {
      data: variants,
      error: variantError,
    } = await supabaseAdmin
      .from("product_variants")
      .select(
        "product_id, size, stock"
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

    let subtotal = 0;

    // =========================
    // CHECK PRODUCT + SIZE STOCK
    // =========================

    for (const cartItem of cartItems) {
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

      if (!product.is_active) {
        return NextResponse.json(
          {
            error:
              `${product.name} is unavailable.`,
          },
          {
            status: 400,
          }
        );
      }

      const variant =
        variants.find(
          (variant) =>
            variant.product_id ===
              cartItem.id &&
            variant.size ===
              cartItem.size
        );

      if (!variant) {
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

      const quantity =
        Number(
          cartItem.quantity
        );

      if (
        Number(variant.stock) <
        quantity
      ) {
        return NextResponse.json(
          {
            error:
              `Only ${variant.stock} item(s) left for ${product.name} in size ${cartItem.size}.`,
          },
          {
            status: 400,
          }
        );
      }

      subtotal +=
        Number(product.price) *
        quantity;
    }

    // =========================
    // SHIPPING
    // =========================

    const shippingFee =
      shippingMethod === "express"
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

    // =========================
    // CREATE PAYPAL ORDER
    // =========================

    const paypalResponse =
      await paypalRequest(
        "/v2/checkout/orders",
        {
          method: "POST",

          body: JSON.stringify({
            intent: "CAPTURE",

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
                  cartItems.map(
                    (cartItem) => {
                      const product =
                        products.find(
                          (product) =>
                            product.id ===
                            cartItem.id
                        )!;

                      return {
                        name:
                          `${product.name} - Size ${cartItem.size}`,

                        quantity:
                          String(
                            cartItem.quantity
                          ),

                        unit_amount: {
                          currency_code:
                            "USD",

                          value:
                            Number(
                              product.price
                            ).toFixed(
                              2
                            ),
                        },
                      };
                    }
                  ),
              },
            ],
          }),
        }
      );

    const paypalData =
      await paypalResponse.json();

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

    return NextResponse.json({
      orderId:
        paypalData.id,

      subtotal:
        safeSubtotal,

      shippingFee:
        safeShippingFee,

      total:
        safeTotal,
    });

  } catch (error) {
    console.error(
      "Create PayPal order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}