declare module "@paypal/react-paypal-js" {
  import * as React from "react";

  type PayPalButtonsComponentProps = {
    style?: Record<string, unknown>;
    createOrder?: () => Promise<string> | string;
    onApprove?: (data: { orderID: string; payerID?: string }) => void | Promise<void>;
  } & Record<string, unknown>;

  export const PayPalButtons: React.ComponentType<PayPalButtonsComponentProps>;
  export function PayPalScriptProvider(props: {
    options: Record<string, unknown>;
    children: React.ReactNode;
  }): React.ReactElement;
}

declare module "@hookform/resolvers/zod" {
  import { ZodType, ZodTypeDef } from "zod";
  import { Resolver } from "react-hook-form";

  export function zodResolver<
    TOutput = unknown,
    TDef extends ZodTypeDef = ZodTypeDef,
    TInput = TOutput,
    TContext = unknown
  >(schema: ZodType<TOutput, TDef, TInput>): Resolver<TOutput, TContext>;
}
