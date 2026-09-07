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

  color: string;
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
  district: string;
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

  const { clearCart } =
    useCart();

  const clientId =
    process.env
      .NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // =====================================================
  // PAYPAL CLIENT ID CHECK
  // =====================================================

  if (!clientId) {
    return (
      <p className="text-sm text-red-600">
        PayPal Client ID is missing.
      </p>
    );
  }

  // =====================================================
  // CREATE PAYPAL ORDER
  // =====================================================

  const createOrder = async () => {
    if (!items.length) {
      throw new Error(
        "Your shopping bag is empty."
      );
    }

    const response =
      await fetch(
        "/api/paypal/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            // =================================================
            // IMPORTANT
            //
            // Browser sends:
            // ID + COLOR + SIZE + QUANTITY
            //
            // Server calculates:
            // PRICE + STOCK + SUBTOTAL + SHIPPING + TOTAL
            // =================================================

            items: items.map(
              (item) => ({
                id:
                  item.id,

                color:
                  item.color ||
                  "Ivory",

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

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Create PayPal order error:",
        data
      );

      throw new Error(
        data.error ||
          "Unable to create PayPal order."
      );
    }

    if (!data.orderId) {
      console.error(
        "PayPal order ID missing:",
        data
      );

      throw new Error(
        "PayPal order could not be created."
      );
    }

    return {
      orderId:
        data.orderId,
    };
  };

  // =====================================================
  // CUSTOMER APPROVES PAYPAL PAYMENT
  // =====================================================

  const handleApprove =
    async (
      data: OnApproveDataOneTimePayments
    ) => {
      try {
        // ===================================================
        // 1. VALIDATE PAYPAL ORDER ID
        // ===================================================

        if (!data.orderId) {
          console.error(
            "PayPal order ID is missing."
          );

          alert(
            "Payment could not be completed."
          );

          return;
        }

        // ===================================================
        // 2. CAPTURE PAYPAL PAYMENT
        // ===================================================

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

        if (
          !captureResponse.ok
        ) {
          console.error(
            "PayPal capture error:",
            captureResult
          );

          alert(
            captureResult.error ||
              "Payment could not be completed."
          );

          return;
        }

        // ===================================================
        // 2A. GET PAYPAL CAPTURE ID
        // ===================================================

        const paypalCaptureId =
          captureResult
            ?.purchase_units?.[0]
            ?.payments
            ?.captures?.[0]
            ?.id;

        if (!paypalCaptureId) {
          console.error(
            "PayPal capture ID missing:",
            captureResult
          );

          alert(
            "Payment was completed, but the payment reference could not be verified. Please contact support."
          );

          return;
        }

        // ===================================================
        // 2B. VERIFY CAPTURE STATUS
        // ===================================================

        const captureStatus =
          captureResult
            ?.purchase_units?.[0]
            ?.payments
            ?.captures?.[0]
            ?.status;

        if (
          captureStatus &&
          captureStatus !==
            "COMPLETED"
        ) {
          console.error(
            "Unexpected PayPal capture status:",
            captureStatus,
            captureResult
          );

          alert(
            "Payment could not be confirmed."
          );

          return;
        }

        // ===================================================
        // 3. SAVE VERIFIED ORDER
        // ===================================================

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
                // =============================================
                // PAYPAL
                // =============================================

                paypalOrderId:
                  data.orderId,

                paypalCaptureId:
                  paypalCaptureId,

                // =============================================
                // CUSTOMER
                //
                // user_id is NOT sent by browser.
                // Server gets authenticated user.
                // =============================================

                firstName:
                  formData.firstName.trim(),

                lastName:
                  formData.lastName.trim(),

                email:
                  formData.email
                    .trim()
                    .toLowerCase(),

                phone:
                  formData.phone.trim(),

                // =============================================
                // SHIPPING ADDRESS
                // =============================================

                country:
                  formData.country.trim(),

                addressLine1:
                  formData.addressLine1.trim(),

                addressLine2:
                  formData.addressLine2.trim(),

                city:
                  formData.city.trim(),

                stateRegion:
                  formData.stateRegion.trim(),

                district:
                  formData.district.trim(),

                postalCode:
                  formData.postalCode.trim(),

                // =============================================
                // IMPORTANT
                //
                // ID + COLOR + SIZE + QUANTITY
                //
                // Server re-checks everything.
                // =============================================

                items: items.map(
                  (item) => ({
                    id:
                      item.id,

                    color:
                      item.color ||
                      "Ivory",

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

        // ===================================================
        // 4. ORDER SAVE FAILED
        // ===================================================

        if (
          !orderResponse.ok
        ) {
          console.error(
            "Order save error:",
            orderResult
          );

          /*
           * Payment đã capture nhưng
           * order chưa lưu được.
           *
           * KHÔNG clear cart.
           * KHÔNG redirect.
           */

          alert(
            orderResult.error ||
              "Payment succeeded, but the order could not be saved. Please contact support."
          );

          return;
        }

        // ===================================================
        // 5. VERIFY ORDER RESPONSE
        // ===================================================

        if (
          !orderResult.success ||
          !orderResult.order
        ) {
          console.error(
            "Invalid order response:",
            orderResult
          );

          alert(
            "Payment succeeded, but the order could not be confirmed. Please contact support."
          );

          return;
        }

        console.log(
          "Order saved successfully:",
          orderResult
        );

        // ===================================================
        // 6. CLEAR SHOPPING BAG
        // ===================================================

        clearCart();

        // ===================================================
        // 7. REDIRECT TO ORDER SUCCESS
        // ===================================================

        const orderNumber =
          orderResult.order
            ?.order_number;

        if (orderNumber) {
          router.push(
            `/order-success?order=${encodeURIComponent(
              orderNumber
            )}`
          );

          return;
        }

        router.push(
          "/order-success"
        );

      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Something went wrong after payment."
        );
      }
    };

  // =====================================================
  // PAYPAL BUTTON
  // =====================================================

  return (
    <PayPalProvider
      clientId={clientId}
      environment="production"
      components={[
        "paypal-payments",
      ]}
      pageType="checkout"
    >
      <PayPalOneTimePaymentButton
        createOrder={
          createOrder
        }
        onApprove={
          handleApprove
        }
        presentationMode="auto"
      />
    </PayPalProvider>
  );
}