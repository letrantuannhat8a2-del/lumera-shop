import { NextResponse } from "next/server";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { paypalRequest } from "../../lib/paypal";

import {
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from "../../lib/email";

type CartItemInput = {
  id: string;
  color: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    // =====================================================
    // 1. GET LOGGED-IN SUPABASE USER
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

    if (
      !user?.id ||
      !user.email
    ) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to place an order.",
        },
        {
          status: 401,
        }
      );
    }

    const accountEmail =
      user.email
        .trim()
        .toLowerCase();

    // =====================================================
    // 2. READ REQUEST BODY
    // =====================================================

    const body =
      await request.json();

    const paypalOrderId =
      typeof body.paypalOrderId ===
      "string"
        ? body.paypalOrderId.trim()
        : "";

    const firstName =
      typeof body.firstName ===
      "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName ===
      "string"
        ? body.lastName.trim()
        : "";

    const checkoutEmail =
      typeof body.email ===
      "string"
        ? body.email.trim()
        : "";

    const phone =
      typeof body.phone ===
      "string"
        ? body.phone.trim()
        : "";

    const country =
      typeof body.country ===
      "string"
        ? body.country.trim()
        : "";

    const addressLine1 =
      typeof body.addressLine1 ===
      "string"
        ? body.addressLine1.trim()
        : "";

    const addressLine2 =
      typeof body.addressLine2 ===
      "string"
        ? body.addressLine2.trim()
        : "";

    const city =
      typeof body.city ===
      "string"
        ? body.city.trim()
        : "";

    const stateRegion =
      typeof body.stateRegion ===
      "string"
        ? body.stateRegion.trim()
        : "";

    const postalCode =
      typeof body.postalCode ===
      "string"
        ? body.postalCode.trim()
        : "";

    const shippingMethod =
      body.shippingMethod;

    const items =
      body.items;

    // =====================================================
    // 3. BASIC VALIDATION
    // =====================================================

    if (!paypalOrderId) {
      return NextResponse.json(
        {
          error:
            "Missing PayPal order ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!firstName) {
      return NextResponse.json(
        {
          error:
            "First name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!lastName) {
      return NextResponse.json(
        {
          error:
            "Last name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!country) {
      return NextResponse.json(
        {
          error:
            "Country is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!addressLine1) {
      return NextResponse.json(
        {
          error:
            "Address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!city) {
      return NextResponse.json(
        {
          error:
            "City is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!postalCode) {
      return NextResponse.json(
        {
          error:
            "Postal code is required.",
        },
        {
          status: 400,
        }
      );
    }

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

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Your shopping bag is empty.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 4. NORMALIZE CART ITEMS
    //
    // IMPORTANT:
    //
    // Product with colors:
    //   Red + S
    //
    // Product without colors:
    //   Ivory + S
    //
    // =====================================================

    const cartItems:
      CartItemInput[] = [];

    for (
      const item of items
    ) {
      if (
        !item ||
        typeof item.id !==
          "string" ||
        typeof item.size !==
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
        item.id.trim();

      const color =
        typeof item.color ===
        "string"
          ? item.color.trim()
          : "Ivory";

      const size =
        item.size.trim();

      const quantity =
        Number(
          item.quantity
        );

      if (
        !id ||
        !size
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
        color:
          color || "Ivory",
        size,
        quantity,
      });
    }

    // =====================================================
    // 5. CHECK FOR EXISTING ORDER
    //
    // Prevent duplicate order creation.
    // =====================================================

    const {
      data: existingOrder,
      error:
        existingOrderError,
    } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq(
          "paypal_order_id",
          paypalOrderId
        )
        .maybeSingle();

    if (
      existingOrderError
    ) {
      console.error(
        "Existing order lookup error:",
        existingOrderError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify existing order.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingOrder) {
      return NextResponse.json(
        {
          success: true,
          order:
            existingOrder,
        },
        {
          status: 200,
        }
      );
    }

    // =====================================================
    // 6. GET REAL PRODUCT DATA
    // =====================================================

    const productIds = [
      ...new Set(
        cartItems.map(
          (item) =>
            item.id
        )
      ),
    ];

    const {
      data: products,
      error:
        productError,
    } =
      await supabaseAdmin
        .from("products")
        .select(
          `
          id,
          name,
          price,
          image_1,
          sizes,
          is_active
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
    // 7. GET REAL VARIANT DATA
    //
    // IMPORTANT:
    // color is now included.
    // =====================================================

    const {
      data: variants,
      error:
        variantError,
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
            "Unable to verify product sizes and colors.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // 8. SERVER CALCULATES PRICE + VALIDATES VARIANTS
    // =====================================================

    let subtotal = 0;

    const safeItems: {
      id: string;
      name: string;
      price: number;
      image: string;
      color: string;
      size: string;
      quantity: number;
    }[] = [];

    for (
      const cartItem of cartItems
    ) {
      const product =
        products.find(
          (item) =>
            item.id ===
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

      if (
        !product.is_active
      ) {
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
      // CHECK SIZE
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
              `Size ${cartItem.size} is not available for ${product.name}.`,
          },
          {
            status: 400
          }
        );
      }

      // ===================================================
      // FIND EXACT VARIANT
      //
      // product_id
      // + color
      // + size
      //
      // THIS IS THE IMPORTANT PART.
      // ===================================================

      const variant =
        variants.find(
          (item) =>
            item.product_id ===
              cartItem.id &&
            item.size ===
              cartItem.size &&
            (
              item.color ??
              "Ivory"
            ) ===
              cartItem.color
        );

      if (!variant) {
        return NextResponse.json(
          {
            error:
              `Color ${cartItem.color}, size ${cartItem.size} is not available for ${product.name}.`,
          },
          {
            status: 400
          }
        );
      }

      // ===================================================
      // CHECK EXACT VARIANT STOCK
      // ===================================================

      const variantStock =
        Number(
          variant.stock
        );

      if (
        !Number.isInteger(
          variantStock
        ) ||
        variantStock <
          cartItem.quantity
      ) {
        return NextResponse.json(
          {
            error:
              `Not enough stock for ${product.name} — ${cartItem.color}, size ${cartItem.size}. Only ${Math.max(
                0,
                variantStock
              )} left.`,
          },
          {
            status: 400
          }
        );
      }

      // ===================================================
      // SERVER PRICE
      // ===================================================

      const realPrice =
        Number(
          product.price
        );

      if (
        !Number.isFinite(
          realPrice
        ) ||
        realPrice < 0
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
            status: 500
          }
        );
      }

      // ===================================================
      // SUBTOTAL
      // ===================================================

      subtotal +=
        realPrice *
        cartItem.quantity;

      // ===================================================
      // SAVE VERIFIED ITEM
      //
      // IMPORTANT:
      // color is now stored in order.items.
      // ===================================================

      safeItems.push({
        id:
          product.id,

        name:
          product.name,

        price:
          realPrice,

        image:
          product.image_1 ||
          "/image/image_1.png",

        color:
          cartItem.color,

        size:
          cartItem.size,

        quantity:
          cartItem.quantity,
      });
    }

    // =====================================================
    // 9. CALCULATE SHIPPING
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

    if (
      !Number.isFinite(
        safeTotal
      ) ||
      safeTotal <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid order total.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 10. VERIFY PAYPAL ORDER
    // =====================================================

    const paypalResponse =
      await paypalRequest(
        `/v2/checkout/orders/${encodeURIComponent(
          paypalOrderId
        )}`,
        {
          method: "GET",
        }
      );

    const paypalData =
      await paypalResponse.json();

    if (
      !paypalResponse.ok
    ) {
      console.error(
        "PayPal verification error:",
        paypalData
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify PayPal payment.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 11. VERIFY PAYPAL ORDER ID
    // =====================================================

    if (
      paypalData.id &&
      paypalData.id !==
        paypalOrderId
    ) {
      console.error(
        "PayPal order ID mismatch:",
        {
          requested:
            paypalOrderId,

          returned:
            paypalData.id,
        }
      );

      return NextResponse.json(
        {
          error:
            "PayPal order verification failed.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 12. VERIFY PAYPAL STATUS
    // =====================================================

    if (
      paypalData.status !==
      "COMPLETED"
    ) {
      return NextResponse.json(
        {
          error:
            "PayPal payment has not been completed.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 13. GET PAYPAL CAPTURE
    // =====================================================

    const purchaseUnit =
      Array.isArray(
        paypalData.purchase_units
      )
        ? paypalData
            .purchase_units[0]
        : null;

    const capture =
      purchaseUnit
        ?.payments
        ?.captures?.[0];

    if (!capture) {
      console.error(
        "No PayPal capture found:",
        paypalData
      );

      return NextResponse.json(
        {
          error:
            "PayPal payment capture could not be verified.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 14. VERIFY CAPTURE STATUS
    // =====================================================

    if (
      capture.status !==
      "COMPLETED"
    ) {
      return NextResponse.json(
        {
          error:
            "PayPal payment capture has not been completed.",
        },
        {
          status: 400
        }
      );
    }

    const captureId =
      typeof capture.id ===
      "string"
        ? capture.id.trim()
        : "";

    if (!captureId) {
      return NextResponse.json(
        {
          error:
            "PayPal capture ID is missing.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 15. VERIFY PAYPAL AMOUNT
    // =====================================================

    const paypalAmount =
      Number(
        capture.amount?.value
      );

    const paypalCurrency =
      typeof capture.amount
        ?.currency_code ===
      "string"
        ? capture.amount
            .currency_code
            .toUpperCase()
        : "";

    if (
      paypalCurrency !==
        "USD" ||
      !Number.isFinite(
        paypalAmount
      )
    ) {
      console.error(
        "Invalid PayPal payment:",
        {
          paypalAmount,
          paypalCurrency,
        }
      );

      return NextResponse.json(
        {
          error:
            "Invalid PayPal payment information.",
        },
        {
          status: 400
        }
      );
    }

    if (
      Math.abs(
        paypalAmount -
          safeTotal
      ) > 0.009
    ) {
      console.error(
        "Payment amount mismatch:",
        {
          expected:
            safeTotal,

          paypal:
            paypalAmount,

          currency:
            paypalCurrency,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment amount does not match the order total.",
        },
        {
          status: 400
        }
      );
    }

    // =====================================================
    // 16. CREATE UNIQUE ORDER NUMBER
    // =====================================================

    const orderNumber =
      "LMR-" +
      Date.now()
        .toString()
        .slice(-8);

    // =====================================================
    // 17. FINALIZE ORDER
    //
    // SQL function now receives:
    //
    // id
    // name
    // price
    // image
    // color
    // size
    // quantity
    //
    // finalize_order then locks:
    //
    // product_id + color + size
    // =====================================================

    const {
      data: order,
      error:
        orderError,
    } =
      await supabaseAdmin.rpc(
        "finalize_order",
        {
          p_order_number:
            orderNumber,

          p_paypal_order_id:
            paypalOrderId,

          p_paypal_capture_id:
            captureId,

          p_user_id:
            user.id,

          p_first_name:
            firstName,

          p_last_name:
            lastName,

          p_email:
            accountEmail,

          p_phone:
            phone,

          p_country:
            country,

          p_address_line1:
            addressLine1,

          p_address_line2:
            addressLine2,

          p_city:
            city,

          p_state_region:
            stateRegion,

          p_postal_code:
            postalCode,

          p_items:
            safeItems,

          p_shipping_method:
            shippingMethod,

          p_subtotal:
            safeSubtotal,

          p_shipping_fee:
            safeShippingFee,

          p_total:
            safeTotal,
        }
      );

    // =====================================================
    // 18. RPC ERROR
    // =====================================================

    if (orderError) {
      console.error(
        "Finalize order error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            orderError.message ||
            "Payment succeeded, but the order could not be saved.",
        },
        {
          status: 500
        }
      );
    }

    if (!order) {
      console.error(
        "Finalize order returned no order."
      );

      return NextResponse.json(
        {
          error:
            "Payment succeeded, but no order was returned.",
        },
        {
          status: 500
        }
      );
    }

    // =====================================================
    // 19. SEND CONFIRMATION EMAIL
    //
    // Email failure does NOT invalidate the order.
    // =====================================================

    try {
      await sendOrderConfirmationEmail(
        order as OrderEmailData
      );

      console.log(
        "Order confirmation email sent."
      );
    } catch (
      emailError
    ) {
      console.error(
        "Order confirmation email error:",
        emailError
      );
    }

    // =====================================================
    // 20. RETURN ORDER
    // =====================================================

    console.log(
      "ORDER CREATED:",
      {
        orderNumber:
          order.order_number,

        userId:
          user.id,

        accountEmail,

        checkoutEmail:
          checkoutEmail ||
          null,

        paypalOrderId,

        paypalCaptureId:
          captureId,

        total:
          safeTotal,
      }
    );

    return NextResponse.json(
      {
        success: true,
        order,
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
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while saving the order.",
      },
      {
        status: 500
      }
    );
  }
}