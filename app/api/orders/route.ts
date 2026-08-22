import { NextResponse } from "next/server";

import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { paypalRequest } from "../../lib/paypal";

import {
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from "../../lib/email";

type CartItemInput = {
  id: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      paypalOrderId,

      firstName,
      lastName,
      email,
      phone,

      country,
      addressLine1,
      addressLine2,
      city,
      stateRegion,
      postalCode,

      items,
      shippingMethod,
    } = body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (
      !paypalOrderId ||
      !firstName ||
      !lastName ||
      !email ||
      !country ||
      !addressLine1 ||
      !city ||
      !postalCode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required order information.",
        },
        {
          status: 400,
        }
      );
    }

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
    // CHECK DUPLICATE ORDER
    // =========================

    const {
      data: existingOrder,
    } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq(
        "paypal_order_id",
        paypalOrderId
      )
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        order: existingOrder,
      });
    }

    // =========================
    // VALIDATE CART
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

    const productIds = [
      ...new Set(
        cartItems.map(
          (item) => item.id
        )
      ),
    ];

    // =========================
    // GET REAL PRODUCT DATA
    // =========================

    const {
      data: products,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        name,
        price,
        image_1,
        sizes,
        stock,
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

    let subtotal = 0;

    const safeItems = [];

    // =========================
    // SERVER CALCULATES PRICE
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

      const quantity =
        Number(
          cartItem.quantity
        );

      if (
        Number(product.stock) <
        quantity
      ) {
        return NextResponse.json(
          {
            error:
              `Not enough stock for ${product.name}.`,
          },
          {
            status: 400,
          }
        );
      }

      const allowedSizes =
        Array.isArray(product.sizes)
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
              `Invalid size for ${product.name}.`,
          },
          {
            status: 400,
          }
        );
      }

      const realPrice =
        Number(product.price);

      subtotal +=
        realPrice *
        quantity;

      // IMPORTANT:
      // lưu dữ liệu lấy từ database,
      // không lấy name/price/image từ browser
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

        size:
          cartItem.size,

        quantity,
      });
    }

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
    // VERIFY PAYPAL PAYMENT
    // =========================

    const paypalResponse =
      await paypalRequest(
        `/v2/checkout/orders/${paypalOrderId}`,
        {
          method: "GET",
        }
      );

    const paypalData =
      await paypalResponse.json();

    if (!paypalResponse.ok) {
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
          status: 400,
        }
      );
    }

    const capture =
      paypalData
        ?.purchase_units?.[0]
        ?.payments?.captures?.[0];

    if (
      paypalData.status !==
        "COMPLETED" ||
      !capture ||
      capture.status !==
        "COMPLETED"
    ) {
      return NextResponse.json(
        {
          error:
            "PayPal payment has not been completed.",
        },
        {
          status: 400,
        }
      );
    }

    const paypalAmount =
      Number(
        capture.amount?.value
      );

    const paypalCurrency =
      capture.amount
        ?.currency_code;

    if (
      paypalCurrency !== "USD" ||
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
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment amount does not match the order total.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // SAVE VERIFIED ORDER
    // =========================

   const orderNumber =
  "LMR-" +
  Date.now()
    .toString()
    .slice(-8);

const {
  data: order,
  error: orderError,
} = await supabaseAdmin.rpc(
  "finalize_order",
  {
    p_order_number:
      orderNumber,

    p_paypal_order_id:
      paypalOrderId,

    p_paypal_capture_id:
      capture.id,

    p_first_name:
      firstName,

    p_last_name:
      lastName,

    p_email:
      email,

    p_phone:
      phone || "",

    p_country:
      country,

    p_address_line1:
      addressLine1,

    p_address_line2:
      addressLine2 || "",

    p_city:
      city,

    p_state_region:
      stateRegion || "",

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

    // =========================
    // SEND CONFIRMATION EMAIL
    // =========================

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

    return NextResponse.json({
      success: true,
      order,
    });

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
        status: 500,
      }
    );
  }
}