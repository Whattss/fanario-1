"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useState } from "react";

export default function SubscribeButton({
  creatorId,
  amount,
}: {
  creatorId: string;
  amount: number;
}) {
  const router = useRouter();
  const { user } = useAuthUser();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 text-sm text-gray-500">Pago seguro con PayPal</div>
      
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {processing && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Procesando pago...
        </div>
      )}
      
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect" }}
        disabled={processing}
        forceReRender={[amount, creatorId]}
        createOrder={async () => {
          setError(null);
          setProcessing(true);
          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount }),
            });
            const data = await res.json();
            if (!res.ok) {
              const errorMsg = data.error || "Error al crear orden";
              // Mostrar mensaje más amigable si la cuenta está restringida
              if (errorMsg.includes("verificación")) {
                throw new Error("⚠️ Cuenta PayPal no verificada. Consulta PAYPAL_SETUP.md");
              }
              throw new Error(errorMsg);
            }
            if (!data.orderId) {
              throw new Error("No se recibió ID de orden");
            }
            return data.orderId;
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            setError(msg);
            setProcessing(false);
            throw err;
          }
        }}
        onApprove={async (data) => {
          try {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID, creatorId }),
            });
            const result = await res.json();
            if (!res.ok) {
              throw new Error(result.error || "Error al capturar pago");
            }
            if (user?.uid) {
              try {
                await setDoc(
                  doc(db, "subscriptions", user.uid, "creators", creatorId),
                  {
                    status: "activa",
                    amount,
                    currency: "EUR",
                    orderId: data.orderID,
                    updatedAt: serverTimestamp(),
                  },
                  { merge: true }
                );
              } catch (fbError) {
                console.warn("No se pudo guardar la suscripcion en Firestore", fbError);
              }
            }
            setProcessing(false);
            alert("¡Suscripción completada con éxito!");
            router.refresh();
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al procesar pago";
            setError(msg);
            setProcessing(false);
          }
        }}
        onError={(err: Record<string, unknown>) => {
          console.error("PayPal error:", err);
          setError("Error en PayPal. Intenta de nuevo.");
          setProcessing(false);
        }}
        onCancel={() => {
          setError(null);
          setProcessing(false);
        }}
      />
    </div>
  );
}
