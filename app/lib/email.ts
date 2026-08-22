import "server-only";

import { Resend } from "resend";

const resendApiKey =
  process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error(
    "Missing RESEND_API_KEY"
  );
}

const resend =
  new Resend(resendApiKey);

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export type OrderEmailData = {
  order_number: string;

  first_name: string;
  last_name: string;
  email: string;

  address_line1: string;
  address_line2: string | null;

  city: string;
  state_region: string | null;
  postal_code: string;
  country: string;

  items: OrderItem[];

  shipping_method: string;

  subtotal: number;
  shipping_fee: number;
  total: number;

  currency: string;
};


// =============================
// ESCAPE HTML
// =============================

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =============================
// FORMAT USD
// =============================

function formatUSD(value: number) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(Number(value));
}


// =====================================================
// 1. ORDER CONFIRMATION EMAIL
// =====================================================

export async function sendOrderConfirmationEmail(
  order: OrderEmailData
) {
  const testEmail =
    process.env.RESEND_TEST_EMAIL;

  if (!testEmail) {
    throw new Error(
      "Missing RESEND_TEST_EMAIL"
    );
  }

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding: 18px 0;
              border-bottom: 1px solid #e8e4de;
            "
          >
            <div
              style="
                font-family: Georgia, serif;
                font-size: 18px;
                color: #111111;
                margin-bottom: 8px;
              "
            >
              ${escapeHtml(item.name)}
            </div>

            <div
              style="
                font-size: 13px;
                color: #777777;
                line-height: 1.8;
              "
            >
              Size: ${escapeHtml(item.size)}
              <br />
              Quantity: ${Number(item.quantity)}
            </div>
          </td>

          <td
            align="right"
            style="
              padding: 18px 0;
              border-bottom: 1px solid #e8e4de;
              font-size: 14px;
              color: #111111;
              vertical-align: top;
            "
          >
            ${formatUSD(
              Number(item.price) *
                Number(item.quantity)
            )}
          </td>
        </tr>
      `
    )
    .join("");

  const shipping =
    Number(order.shipping_fee) === 0
      ? "FREE"
      : formatUSD(
          Number(order.shipping_fee)
        );

  const addressLine2 =
    order.address_line2
      ? `
          <br />
          ${escapeHtml(
            order.address_line2
          )}
        `
      : "";

  const stateRegion =
    order.state_region
      ? `, ${escapeHtml(
          order.state_region
        )}`
      : "";

  const { data, error } =
    await resend.emails.send(
      {
        from:
          "LUMÉRA <onboarding@resend.dev>",

        // TEST MODE
        to: [testEmail],

        subject:
          `Order ${order.order_number} confirmed — LUMÉRA`,

        html: `
          <!DOCTYPE html>

          <html>
            <body
              style="
                margin: 0;
                padding: 0;
                background: #f8f6f2;
                color: #111111;
                font-family: Arial, Helvetica, sans-serif;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background: #f8f6f2;
                  padding: 50px 20px;
                "
              >
                <tr>
                  <td align="center">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        max-width: 620px;
                        background: #ffffff;
                      "
                    >

                      <!-- BRAND -->
                      <tr>
                        <td
                          align="center"
                          style="
                            padding: 42px 30px;
                            border-bottom: 1px solid #eeeae4;
                          "
                        >
                          <div
                            style="
                              font-family: Georgia, serif;
                              font-size: 28px;
                              letter-spacing: 8px;
                            "
                          >
                            LUMÉRA
                          </div>
                        </td>
                      </tr>


                      <!-- THANK YOU -->
                      <tr>
                        <td
                          align="center"
                          style="
                            padding: 50px 40px 35px;
                          "
                        >

                          <div
                            style="
                              font-size: 10px;
                              letter-spacing: 4px;
                              color: #999999;
                              margin-bottom: 18px;
                            "
                          >
                            ORDER CONFIRMED
                          </div>

                          <div
                            style="
                              font-family: Georgia, serif;
                              font-size: 38px;
                              line-height: 1.2;
                            "
                          >
                            Thank You
                          </div>

                          <p
                            style="
                              max-width: 430px;
                              margin: 20px auto 0;
                              color: #666666;
                              font-size: 14px;
                              line-height: 1.8;
                            "
                          >
                            Dear
                            ${escapeHtml(
                              order.first_name
                            )},
                            your order has been received
                            and your payment was
                            successfully confirmed.
                          </p>

                        </td>
                      </tr>


                      <!-- ORDER NUMBER -->
                      <tr>
                        <td
                          style="
                            padding: 0 40px 35px;
                          "
                        >
                          <div
                            style="
                              background: #f8f6f2;
                              padding: 22px;
                              text-align: center;
                            "
                          >

                            <div
                              style="
                                font-size: 9px;
                                color: #999999;
                                letter-spacing: 3px;
                              "
                            >
                              ORDER NUMBER
                            </div>

                            <div
                              style="
                                margin-top: 9px;
                                font-family: Georgia, serif;
                                font-size: 20px;
                              "
                            >
                              ${escapeHtml(
                                order.order_number
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>


                      <!-- ITEMS -->
                      <tr>
                        <td
                          style="
                            padding: 0 40px 35px;
                          "
                        >

                          <div
                            style="
                              font-size: 10px;
                              letter-spacing: 3px;
                              margin-bottom: 12px;
                            "
                          >
                            YOUR ORDER
                          </div>

                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            ${itemsHtml}
                          </table>

                        </td>
                      </tr>


                      <!-- TOTAL -->
                      <tr>
                        <td
                          style="
                            padding: 0 40px 40px;
                          "
                        >

                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              font-size: 13px;
                              line-height: 2.2;
                            "
                          >

                            <tr>
                              <td
                                style="
                                  color: #777777;
                                "
                              >
                                Subtotal
                              </td>

                              <td align="right">
                                ${formatUSD(
                                  Number(
                                    order.subtotal
                                  )
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="
                                  color: #777777;
                                "
                              >
                                Shipping
                              </td>

                              <td align="right">
                                ${shipping}
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="
                                  padding-top: 15px;
                                  border-top: 1px solid #ddd8d1;
                                  font-weight: bold;
                                "
                              >
                                TOTAL
                              </td>

                              <td
                                align="right"
                                style="
                                  padding-top: 15px;
                                  border-top: 1px solid #ddd8d1;
                                  font-family: Georgia, serif;
                                  font-size: 21px;
                                "
                              >
                                ${formatUSD(
                                  Number(
                                    order.total
                                  )
                                )}
                              </td>
                            </tr>

                          </table>

                        </td>
                      </tr>


                      <!-- ADDRESS -->
                      <tr>
                        <td
                          style="
                            padding: 35px 40px;
                            background: #f3f0eb;
                          "
                        >

                          <div
                            style="
                              font-size: 10px;
                              letter-spacing: 3px;
                              margin-bottom: 18px;
                            "
                          >
                            SHIPPING ADDRESS
                          </div>

                          <div
                            style="
                              font-size: 13px;
                              line-height: 1.8;
                              color: #555555;
                            "
                          >

                            ${escapeHtml(
                              order.first_name
                            )}
                            ${escapeHtml(
                              order.last_name
                            )}

                            <br />

                            ${escapeHtml(
                              order.address_line1
                            )}

                            ${addressLine2}

                            <br />

                            ${escapeHtml(
                              order.city
                            )}
                            ${stateRegion}

                            <br />

                            ${escapeHtml(
                              order.postal_code
                            )}

                            <br />

                            ${escapeHtml(
                              order.country
                            )}

                          </div>

                        </td>
                      </tr>


                      <!-- PAYMENT -->
                      <tr>
                        <td
                          align="center"
                          style="
                            padding: 36px 40px;
                          "
                        >

                          <div
                            style="
                              font-size: 10px;
                              letter-spacing: 3px;
                              color: #999999;
                            "
                          >
                            PAYMENT
                          </div>

                          <div
                            style="
                              margin-top: 10px;
                              font-size: 13px;
                            "
                          >
                            PayPal · Paid
                          </div>

                        </td>
                      </tr>


                      <!-- FOOTER -->
                      <tr>
                        <td
                          align="center"
                          style="
                            padding: 32px;
                            border-top: 1px solid #eeeae4;
                            font-size: 11px;
                            line-height: 1.8;
                            color: #999999;
                          "
                        >

                          We will notify you again
                          when your order has been shipped.

                          <br /><br />

                          © LUMÉRA

                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
          </html>
        `,
      },
      {
        idempotencyKey:
          `order-confirmation/${order.order_number}`,
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


// =====================================================
// 2. ORDER STATUS EMAIL
// =====================================================

export async function sendOrderStatusEmail(
  order: {
    order_number: string;
    first_name: string;
    email: string;
    order_status: string;
  }
) {
  const testEmail =
    process.env.RESEND_TEST_EMAIL;

  if (!testEmail) {
    throw new Error(
      "Missing RESEND_TEST_EMAIL"
    );
  }

  let subject = "";
  let label = "";
  let title = "";
  let message = "";


  // SHIPPED
  if (
    order.order_status === "shipped"
  ) {
    subject =
      `Your order ${order.order_number} has shipped — LUMÉRA`;

    label =
      "ORDER SHIPPED";

    title =
      "Your Order Is On Its Way";

    message =
      "Your order has been dispatched and is now on its way to you.";
  }


  // DELIVERED
  else if (
    order.order_status === "delivered"
  ) {
    subject =
      `Your order ${order.order_number} has been delivered — LUMÉRA`;

    label =
      "ORDER DELIVERED";

    title =
      "Your Order Has Arrived";

    message =
      "Your order has been marked as delivered. We hope you love your LUMÉRA piece.";
  }


  // CANCELLED
  else if (
    order.order_status === "cancelled"
  ) {
    subject =
      `Order ${order.order_number} cancelled — LUMÉRA`;

    label =
      "ORDER CANCELLED";

    title =
      "Your Order Has Been Cancelled";

    message =
      "Your order has been cancelled. Please contact us if you need any assistance.";
  }


  // PROCESSING
  else {
    return;
  }


  const { data, error } =
    await resend.emails.send({
      from:
        "LUMÉRA <onboarding@resend.dev>",

      // TEST MODE
      // Sau này đổi thành:
      // to: [order.email]
      to: [testEmail],

      subject,

      html: `
        <!DOCTYPE html>

        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f8f6f2;
              color: #111111;
              font-family: Arial, Helvetica, sans-serif;
            "
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                background: #f8f6f2;
                padding: 50px 20px;
              "
            >

              <tr>
                <td align="center">

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      max-width: 620px;
                      background: #ffffff;
                    "
                  >


                    <!-- BRAND -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 42px 30px;
                          border-bottom: 1px solid #eeeae4;
                        "
                      >

                        <div
                          style="
                            font-family: Georgia, serif;
                            font-size: 28px;
                            letter-spacing: 8px;
                          "
                        >
                          LUMÉRA
                        </div>

                      </td>
                    </tr>


                    <!-- STATUS -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 55px 40px;
                        "
                      >

                        <div
                          style="
                            font-size: 10px;
                            letter-spacing: 4px;
                            color: #999999;
                          "
                        >
                          ${label}
                        </div>

                        <div
                          style="
                            margin-top: 20px;
                            font-family: Georgia, serif;
                            font-size: 38px;
                            line-height: 1.2;
                          "
                        >
                          ${title}
                        </div>

                        <p
                          style="
                            margin: 24px auto 0;
                            max-width: 430px;
                            font-size: 14px;
                            line-height: 1.8;
                            color: #666666;
                          "
                        >
                          Dear
                          ${escapeHtml(
                            order.first_name
                          )},
                          ${message}
                        </p>

                      </td>
                    </tr>


                    <!-- ORDER INFO -->
                    <tr>
                      <td
                        style="
                          padding: 0 40px 45px;
                        "
                      >

                        <div
                          style="
                            background: #f8f6f2;
                            padding: 25px;
                            text-align: center;
                          "
                        >

                          <div
                            style="
                              font-size: 9px;
                              letter-spacing: 3px;
                              color: #999999;
                            "
                          >
                            ORDER NUMBER
                          </div>

                          <div
                            style="
                              margin-top: 10px;
                              font-family: Georgia, serif;
                              font-size: 20px;
                            "
                          >
                            ${escapeHtml(
                              order.order_number
                            )}
                          </div>


                          <div
                            style="
                              margin-top: 22px;
                              font-size: 9px;
                              letter-spacing: 3px;
                              color: #999999;
                            "
                          >
                            CURRENT STATUS
                          </div>

                          <div
                            style="
                              margin-top: 10px;
                              font-size: 13px;
                              text-transform: uppercase;
                              letter-spacing: 2px;
                            "
                          >
                            ${escapeHtml(
                              order.order_status
                            )}
                          </div>

                        </div>

                      </td>
                    </tr>


                    <!-- FOOTER -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 32px;
                          border-top: 1px solid #eeeae4;
                          color: #999999;
                          font-size: 11px;
                          line-height: 1.8;
                        "
                      >

                        Thank you for choosing LUMÉRA.

                        <br /><br />

                        © LUMÉRA

                      </td>
                    </tr>

                  </table>

                </td>
              </tr>

            </table>

          </body>
        </html>
      `,
    });

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}