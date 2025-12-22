"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode, useMemo } from "react";

type Props = {
  children: ReactNode;
  paypalClientId?: string;
};

export default function AppProviders({ children, paypalClientId }: Props) {
  const options = useMemo(
    () => ({
      clientId: paypalClientId || "test",
      currency: "EUR",
      intent: "capture",
      "data-sdk-integration-source": "integrationbuilder_sc",
      "disable-funding": "credit,card",
      vault: false,
    }),
    [paypalClientId]
  );

  return (
    <PayPalScriptProvider options={options}>
      {children}
    </PayPalScriptProvider>
  );
}
