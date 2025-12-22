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
    const { orderId, creatorId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
    }
    const accessToken = await getAccessToken();
    const captureRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const captureData = await captureRes.json();
    if (!captureRes.ok) {
      console.error("PayPal capture error:", captureData);
      return NextResponse.json({ error: captureData.message || "Error al capturar" }, { status: 400 });
    }
    return NextResponse.json({ status: "ok", creatorId, captureData });
  } catch (error: unknown) {
    console.error("PayPal error:", error);
    const message = error instanceof Error ? error.message : "No se pudo capturar la orden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
