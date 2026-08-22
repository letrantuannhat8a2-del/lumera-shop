"use client";

import { useRouter } from "next/navigation";

import {
  PayPalProvider,
  PayPalOneTimePaymentButton,
  type OnApproveDataOneTimePayments,
} from "@paypal/react-paypal-js/sdk-v6";

import { useCart } from "../context/CartContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  postalCode: string;
};

type PayPalCheckoutProps = {
  total: number;
  subtotal: number;
  shippingFee: number;

  shippingMethod:
    | "standard"
    | "express";

  formData: CheckoutFormData;

  items: CartItem[];
};

export default function PayPalCheckout({
  shippingMethod,
  formData,
  items,
}: PayPalCheckoutProps) {
  const router = useRouter();

  const { clearCart } = useCart();

  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-sm text-red-600">
        PayPal Client ID is missing.
      </p>
    );
  }

  // =====================================
  // CREATE PAYPAL ORDER
  // =====================================

  const createOrder = async () => {
    const response = await fetch(
      "/api/paypal/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          items: items.map(
            (item) => ({
              id: item.id,
              size: item.size,
              quantity:
                item.quantity,
            })
          ),

          shippingMethod,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Create PayPal order error:",
        data
      );

      alert(
        data.error ||
          "Unable to create PayPal order."
      );

      throw new Error(
        data.error ||
          "Unable to create PayPal order."
      );
    }

    return {
      orderId: data.orderId,
    };
  };

  // =====================================
  // CUSTOMER APPROVES PAYPAL PAYMENT
  // =====================================

  const handleApprove = async (
    data: OnApproveDataOneTimePayments
  ) => {
    try {
      // =====================================
      // 1. CAPTURE PAYPAL PAYMENT
      // =====================================

      const captureResponse =
        await fetch(
          "/api/paypal/capture-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              orderId:
                data.orderId,
            }),
          }
        );

      const captureResult =
        await captureResponse.json();

      if (!captureResponse.ok) {
        console.error(
          "PayPal capture error:",
          captureResult
        );

        alert(
          "Payment could not be completed."
        );

        return;
      }

      // =====================================
      // 2. SAVE VERIFIED ORDER
      // =====================================

      const orderResponse =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paypalOrderId:
                data.orderId,

              firstName:
                formData.firstName,

              lastName:
                formData.lastName,

              email:
                formData.email,

              phone:
                formData.phone,

              country:
                formData.country,

              addressLine1:
                formData.addressLine1,

              addressLine2:
                formData.addressLine2,

              city:
                formData.city,

              stateRegion:
                formData.stateRegion,

              postalCode:
                formData.postalCode,

              // Browser chỉ gửi:
              // ID + SIZE + QUANTITY
              // Giá sẽ do server lấy từ Supabase
              items: items.map(
                (item) => ({
                  id: item.id,
                  size:
                    item.size,
                  quantity:
                    item.quantity,
                })
              ),

              shippingMethod,
            }),
          }
        );

      const orderResult =
        await orderResponse.json();

      if (!orderResponse.ok) {
        console.error(
          "Order save error:",
          orderResult
        );

        alert(
          "Payment succeeded, but the order could not be saved. Please contact support."
        );

        return;
      }

      console.log(
        "Order saved:",
        orderResult
      );

      // =====================================
      // 3. CLEAR SHOPPING BAG
      // =====================================

      clearCart();

      // =====================================
      // 4. REDIRECT TO THANK YOU PAGE
      // =====================================

      const orderNumber =
        orderResult.order
          ?.order_number;

      router.push(
        orderNumber
          ? `/order-success?order=${encodeURIComponent(
              orderNumber
            )}`
          : "/order-success"
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Something went wrong after payment."
      );
    }
  };

  // =====================================
  // PAYPAL BUTTON
  // =====================================

  return (
    <PayPalProvider
      clientId={clientId}
      environment="sandbox"
      components={[
        "paypal-payments",
      ]}
      pageType="checkout"
    >
      <PayPalOneTimePaymentButton
        createOrder={createOrder}
        onApprove={handleApprove}
        presentationMode="auto"
      />
    </PayPalProvider>
  );
}