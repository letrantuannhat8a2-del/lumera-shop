import { NextResponse } from "next/server";
import { paypalRequest } from "@/app/lib/paypal";

export async function POST(
  request: Request
) {
  try {
    // =====================================================
    // 1. READ REQUEST
    // =====================================================

    const body = await request.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    if (!orderId) {
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

    // =====================================================
    // 2. CAPTURE PAYPAL ORDER
    // =====================================================

    const response =
      await paypalRequest(
        `/v2/checkout/orders/${encodeURIComponent(
          orderId
        )}/capture`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({}),
        }
      );

    const data =
      await response.json();

    // =====================================================
    // 3. PAYPAL API ERROR
    // =====================================================

    if (!response.ok) {
      console.error(
        "PayPal capture error:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Unable to capture PayPal payment.",
        },
        {
          status: response.status,
        }
      );
    }

    // =====================================================
    // 4. VERIFY PAYPAL ORDER ID
    // =====================================================

    if (
      data.id &&
      data.id !== orderId
    ) {
      console.error(
        "PayPal order ID mismatch:",
        {
          requestedOrderId:
            orderId,
          returnedOrderId:
            data.id,
        }
      );

      return NextResponse.json(
        {
          error:
            "PayPal order verification failed.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 5. VERIFY ORDER STATUS
    // =====================================================

    if (
      data.status !==
      "COMPLETED"
    ) {
      console.error(
        "PayPal order was not completed:",
        {
          orderId,
          status: data.status,
        }
      );

      return NextResponse.json(
        {
          error:
            "PayPal payment was not completed.",
          status:
            data.status || null,
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 6. EXTRACT CAPTURE
    // =====================================================

    const purchaseUnit =
      Array.isArray(
        data.purchase_units
      )
        ? data.purchase_units[0]
        : null;

    const payments =
      purchaseUnit?.payments;

    const captures =
      Array.isArray(
        payments?.captures
      )
        ? payments.captures
        : [];

    const capture =
      captures[0] ?? null;

    if (!capture) {
      console.error(
        "No PayPal capture found:",
        data
      );

      return NextResponse.json(
        {
          error:
            "PayPal capture could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 7. VERIFY CAPTURE STATUS
    // =====================================================

    if (
      capture.status !==
      "COMPLETED"
    ) {
      console.error(
        "PayPal capture is not completed:",
        {
          orderId,
          captureId:
            capture.id,
          status:
            capture.status,
        }
      );

      return NextResponse.json(
        {
          error:
            "PayPal payment capture was not completed.",
          status:
            capture.status || null,
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 8. EXTRACT VERIFIED PAYMENT DATA
    // =====================================================

    const amount =
      capture.amount?.value ??
      null;

    const currency =
      capture.amount?.currency_code ??
      null;

    const captureId =
      capture.id ??
      null;

    if (
      !amount ||
      !currency ||
      !captureId
    ) {
      console.error(
        "Incomplete PayPal capture data:",
        {
          orderId,
          captureId,
          amount,
          currency,
        }
      );

      return NextResponse.json(
        {
          error:
            "PayPal payment information is incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 9. ONLY USD IS ACCEPTED
    // =====================================================

    if (
      currency.toUpperCase() !==
      "USD"
    ) {
      console.error(
        "Unsupported PayPal currency:",
        {
          orderId,
          currency,
        }
      );

      return NextResponse.json(
        {
          error:
            "Unsupported payment currency.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 10. RETURN VERIFIED PAYMENT
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        verified: true,

        paypalOrderId:
          orderId,

        paypalCaptureId:
          captureId,

        amount,

        currency:
          currency.toUpperCase(),

        status:
          capture.status,
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
      "PayPal capture route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while capturing the payment.",
      },
      {
        status: 500,
      }
    );
  }
}