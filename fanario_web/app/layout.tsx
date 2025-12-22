import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import MobileNav from "@/components/navigation/MobileNav";
import Header from "@/components/navigation/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const paypalClientId =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  process.env.PAYPAL_CLIENT_ID ||
  "";

export const metadata: Metadata = {
  title: "Fanario | Comunidad de creadores",
  description:
    "Plataforma en español para apoyar creadores con suscripciones y contenido premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sand text-night`}
      >
        <AppProviders paypalClientId={paypalClientId}>
          <Header />
          <div className="min-h-screen pb-16 sm:pb-0">
            {children}
          </div>
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
