import { NextResponse } from "next/server";

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en .env.local");
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("PayPal auth error:", data);
    throw new Error(data.error_description || "Error de autenticación PayPal");
  }
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const value = Number(amount);
    if (!value || value <= 0) {
      return NextResponse.json({ error: "Monto invalido" }, { status: 400 });
    }
    const accessToken = await getAccessToken();
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: `${value.toFixed(2)}`,
            },
          },
        ],
      }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("PayPal create order error:", orderData);
      return NextResponse.json({ error: orderData.message || "Error al crear orden" }, { status: 400 });
    }
    return NextResponse.json({ orderId: orderData.id });
  } catch (error: unknown) {
    console.error("PayPal error:", error);
    const message = error instanceof Error ? error.message : "No se pudo crear la orden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
