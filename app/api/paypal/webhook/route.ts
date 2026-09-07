import { NextResponse } from "next/server";

import { paypalRequest } from "@/app/lib/paypal";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const WEBHOOK_ID =
  process.env.PAYPAL_WEBHOOK_ID;

// =====================================================
// PAYPAL WEBHOOK
//
// This endpoint:
// 1. Receives webhook from PayPal
// 2. Verifies the webhook with PayPal
// 3. Updates the corresponding order
//
// IMPORTANT:
// It does NOT create a second order.
// /api/orders remains responsible for creating orders.
// =====================================================

export async function POST(
  request: Request
) {
  try {
    // ===================================================
    // 1. CHECK WEBHOOK ID
    // ===================================================

    if (!WEBHOOK_ID) {
      console.error(
        "PAYPAL_WEBHOOK_ID is missing."
      );

      return NextResponse.json(
        {
          error:
            "Webhook is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // ===================================================
    // 2. READ RAW BODY
    //
    // IMPORTANT:
    // Do not use request.json() before verification.
    // PayPal verification requires the original
    // webhook payload.
    // ===================================================

    const rawBody =
      await request.text();

    if (!rawBody) {
      return NextResponse.json(
        {
          error:
            "Empty webhook body.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // 3. READ PAYPAL HEADERS
    // ===================================================

    const transmissionId =
      request.headers.get(
        "paypal-transmission-id"
      );

    const transmissionTime =
      request.headers.get(
        "paypal-transmission-time"
      );

    const certUrl =
      request.headers.get(
        "paypal-cert-url"
      );

    const authAlgo =
      request.headers.get(
        "paypal-auth-algo"
      );

    const transmissionSig =
      request.headers.get(
        "paypal-transmission-sig"
      );

    // ===================================================
    // 4. VALIDATE REQUIRED HEADERS
    // ===================================================

    if (
      !transmissionId ||
      !transmissionTime ||
      !certUrl ||
      !authAlgo ||
      !transmissionSig
    ) {
      console.error(
        "Missing PayPal webhook headers."
      );

      return NextResponse.json(
        {
          error:
            "Invalid PayPal webhook.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // 5. PARSE EVENT
    // ===================================================

    let event: any;

    try {
      event =
        JSON.parse(
          rawBody
        );
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid webhook JSON.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // 6. VERIFY WEBHOOK WITH PAYPAL
    //
    // We use PayPal's official verification endpoint.
    //
    // This prevents somebody from manually POSTing
    // fake payment events to this URL.
    // ===================================================

    const verificationResponse =
      await paypalRequest(
        "/v1/notifications/verify-webhook-signature",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transmission_id:
              transmissionId,

            transmission_time:
              transmissionTime,

            cert_url:
              certUrl,

            auth_algo:
              authAlgo,

            transmission_sig:
              transmissionSig,

            webhook_id:
              WEBHOOK_ID,

            webhook_event:
              event,
          }),
        }
      );

    const verificationData =
      await verificationResponse.json();

    // ===================================================
    // 7. REJECT INVALID SIGNATURE
    // ===================================================

    if (
      !verificationResponse.ok
    ) {
      console.error(
        "PayPal webhook verification request failed:",
        verificationData
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify PayPal webhook.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      verificationData.verification_status !==
      "SUCCESS"
    ) {
      console.error(
        "Invalid PayPal webhook signature:",
        {
          eventId:
            event?.id,
          verificationStatus:
            verificationData.verification_status,
        }
      );

      return NextResponse.json(
        {
          error:
            "Invalid PayPal webhook signature.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // 8. BASIC EVENT INFORMATION
    // ===================================================

    const eventId =
      typeof event?.id === "string"
        ? event.id.trim()
        : "";

    const eventType =
      typeof event?.event_type ===
      "string"
        ? event.event_type.trim()
        : "";

    if (!eventId || !eventType) {
      console.error(
        "Invalid PayPal webhook event:",
        event
      );

      return NextResponse.json(
        {
          error:
            "Invalid webhook event.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "PAYPAL WEBHOOK:",
      {
        eventId,
        eventType,
      }
    );

    // ===================================================
    // 9. GET PAYPAL ORDER ID
    //
    // For PAYMENT.CAPTURE.* events:
    //
    // resource.supplementary_data.related_ids.order_id
    //
    // For CHECKOUT.ORDER.* events:
    //
    // resource.id
    // ===================================================

    let paypalOrderId = "";

    if (
      typeof event?.resource
        ?.supplementary_data
        ?.related_ids
        ?.order_id ===
      "string"
    ) {
      paypalOrderId =
        event.resource
          .supplementary_data
          .related_ids.order_id.trim();
    }

    if (
      !paypalOrderId &&
      typeof event?.resource?.id ===
        "string" &&
      eventType.startsWith(
        "CHECKOUT.ORDER."
      )
    ) {
      paypalOrderId =
        event.resource.id.trim();
    }

    // ===================================================
    // 10. EVENTS WE CARE ABOUT
    // ===================================================

    const supportedEvents = [
      "CHECKOUT.ORDER.APPROVED",
      "CHECKOUT.PAYMENT-APPROVAL.REVERSED",

      "PAYMENT.CAPTURE.PENDING",
      "PAYMENT.CAPTURE.COMPLETED",
      "PAYMENT.CAPTURE.DENIED",
      "PAYMENT.CAPTURE.REFUNDED",
    ];

    if (
      !supportedEvents.includes(
        eventType
      )
    ) {
      console.log(
        "PayPal webhook ignored:",
        eventType
      );

      return NextResponse.json({
        success: true,
        received: true,
        ignored: true,
      });
    }

    // ===================================================
    // 11. ORDER ID REQUIRED
    // ===================================================

    if (!paypalOrderId) {
      console.error(
        "Unable to determine PayPal order ID:",
        {
          eventId,
          eventType,
        }
      );

      // Event itself is valid.
      // Return 200 so PayPal does not endlessly retry
      // an event that our current order model cannot map.
      return NextResponse.json({
        success: true,
        received: true,
        mapped: false,
      });
    }

    // ===================================================
    // 12. FIND OUR ORDER
    // ===================================================

    const {
      data: order,
      error: orderLookupError,
    } =
      await supabaseAdmin
        .from("orders")
        .select(
          `
          id,
          order_number,
          paypal_order_id,
          paypal_capture_id,
          payment_status,
          order_status
          `
        )
        .eq(
          "paypal_order_id",
          paypalOrderId
        )
        .maybeSingle();

    if (orderLookupError) {
      console.error(
        "PayPal webhook order lookup error:",
        orderLookupError
      );

      return NextResponse.json(
        {
          error:
            "Unable to process webhook.",
        },
        {
          status: 500,
        }
      );
    }

    // ===================================================
    // 13. ORDER DOES NOT EXIST YET
    //
    // This can happen if PayPal sends the webhook before
    // the browser finishes /api/orders.
    //
    // We DO NOT create a new order here because the
    // current webhook payload does not contain the full
    // customer + shipping + cart snapshot required by
    // finalize_order().
    // ===================================================

    if (!order) {
      console.warn(
        "PayPal webhook received before local order exists:",
        {
          paypalOrderId,
          eventId,
          eventType,
        }
      );

      return NextResponse.json({
        success: true,
        received: true,
        mapped: false,
      });
    }

    // ===================================================
    // 14. CAPTURE DATA
    // ===================================================

    const resource =
      event?.resource;

    const captureId =
      typeof resource?.id ===
      "string"
        ? resource.id.trim()
        : "";

    const captureStatus =
      typeof resource?.status ===
      "string"
        ? resource.status.trim()
        : "";

    // ===================================================
    // 15. UPDATE PAYMENT STATUS
    // =====================================================

    let paymentStatus:
      | string
      | null = null;

    let orderStatus:
      | string
      | null = null;

    switch (eventType) {
      // -----------------------------------------------
      // CAPTURE COMPLETED
      // -----------------------------------------------

      case "PAYMENT.CAPTURE.COMPLETED":
        paymentStatus =
          "paid";

        orderStatus =
          "processing";

        break;

      // -----------------------------------------------
      // CAPTURE PENDING
      // -----------------------------------------------

      case "PAYMENT.CAPTURE.PENDING":
        paymentStatus =
          "pending";

        orderStatus =
          "pending";

        break;

      // -----------------------------------------------
      // CAPTURE DENIED
      // -----------------------------------------------

      case "PAYMENT.CAPTURE.DENIED":
        paymentStatus =
          "denied";

        orderStatus =
          "cancelled";

        break;

      // -----------------------------------------------
      // PAYMENT APPROVAL REVERSED
      // -----------------------------------------------

      case "CHECKOUT.PAYMENT-APPROVAL.REVERSED":
        paymentStatus =
          "reversed";

        orderStatus =
          "cancelled";

        break;

      // -----------------------------------------------
      // REFUND
      // -----------------------------------------------

      case "PAYMENT.CAPTURE.REFUNDED":
        paymentStatus =
          "refunded";

        orderStatus =
          "refunded";

        break;

      // -----------------------------------------------
      // ORDER APPROVED
      //
      // Approval is NOT payment completion.
      // Do not mark it paid.
      // -----------------------------------------------

      case "CHECKOUT.ORDER.APPROVED":
        console.log(
          "PayPal order approved:",
          {
            orderId:
              paypalOrderId,
            orderNumber:
              order.order_number,
          }
        );

        return NextResponse.json({
          success: true,
          received: true,
          processed: true,
        });

      default:
        return NextResponse.json({
          success: true,
          received: true,
          ignored: true,
        });
    }

    // ===================================================
    // 16. BUILD DATABASE UPDATE
    // ===================================================

    const updateData: Record<
      string,
      string
    > = {
      payment_status:
        paymentStatus,

      updated_at:
        new Date().toISOString(),
    };

    if (orderStatus) {
      updateData.order_status =
        orderStatus;
    }

    // Save capture ID if PayPal supplied one
    // and we don't already have it.
    if (
      captureId &&
      !order.paypal_capture_id
    ) {
      updateData.paypal_capture_id =
        captureId;
    }

    // ===================================================
    // 17. UPDATE ORDER
    // ===================================================

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("orders")
        .update(
          updateData
        )
        .eq(
          "id",
          order.id
        );

    if (updateError) {
      console.error(
        "PayPal webhook order update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update order.",
        },
        {
          status: 500,
        }
      );
    }

    // ===================================================
    // 18. SUCCESS
    // =====================================================

    console.log(
      "PayPal webhook processed:",
      {
        eventId,
        eventType,
        paypalOrderId,
        orderNumber:
          order.order_number,
        paymentStatus,
        orderStatus,
        captureId,
        captureStatus,
      }
    );

    return NextResponse.json({
      success: true,
      received: true,
      processed: true,
      eventId,
      eventType,
      paypalOrderId,
    });
  } catch (error) {
    console.error(
      "PayPal webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while processing the PayPal webhook.",
      },
      {
        status: 500,
      }
    );
  }
}