"use client";

import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthUser();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="rounded-2xl border border-cream/60 bg-white p-4 text-center text-sm text-night/70">
        Cargando sesion...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Necesitas iniciar sesion para ver esta seccion. Ve a <Link href="/cuenta" className="underline">Cuenta</Link>.
      </div>
    );
  }

  const handleSendVerification = async () => {
    if (!user) return;
    setSending(true);
    setSent(null);
    try {
      await sendEmailVerification(user);
      setSent("Hemos enviado un correo de verificacion.");
    } catch {
      setSent("No se pudo enviar el correo de verificacion.");
    } finally {
      setSending(false);
    }
  };

  if (!user.emailVerified) {
    return (
      <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>Verifica tu correo para continuar. Esto protege tus pagos y tus publicaciones.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSendVerification}
            disabled={sending}
            className="rounded-full bg-night px-4 py-2 text-white"
          >
            {sending ? "Enviando..." : "Reenviar verificacion"}
          </button>
          <Link href="/cuenta" className="rounded-full border border-night/20 px-4 py-2 text-night">
            Volver a cuenta
          </Link>
        </div>
        {sent && <p className="text-xs">{sent}</p>}
      </div>
    );
  }

  return <>{children}</>;
}
