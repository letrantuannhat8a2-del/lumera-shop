import { NextResponse } from "next/server";
import { paypalRequest } from "@/app/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Missing PayPal order ID.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await paypalRequest(
      `/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "PayPal capture error:",
        data
      );

      return NextResponse.json(
        {
          error: "Unable to capture PayPal payment.",
          details: data,
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

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