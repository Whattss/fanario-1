"use client";

import AuthForms from "@/components/auth/AuthForms";
import { useAuthUser } from "@/hooks/useAuthUser";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import Link from "next/link";

export default function CuentaPage() {
  const { user, loading } = useAuthUser();
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!user) return;
    setSending(true);
    setNotice(null);
    try {
      await sendEmailVerification(user);
      setNotice("Correo de verificación enviado. Revisa tu bandeja de entrada.");
    } catch {
      setNotice("No se pudo enviar la verificación. Inténtalo más tarde.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 pb-24 sm:px-8 sm:pb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded" style={{ backgroundColor: "#e5e7eb" }}></div>
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "#e5e7eb" }}></div>
          <div className="h-64 rounded-2xl" style={{ backgroundColor: "#e5e7eb" }}></div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-6 pb-24 sm:px-8 sm:pb-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Mi Cuenta</h1>
        <p style={{ color: "#4b5563" }}>
          {user ? "Gestiona tu cuenta y suscripciones" : "Inicia sesión o crea tu cuenta"}
        </p>
      </header>

      {user ? (
        <div className="space-y-4">
          {/* Card de Usuario */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold" style={{ backgroundColor: "#f3f4f6", color: "#4b5563" }}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#111827" }}>Sesión activa</p>
                  <p className="text-sm" style={{ color: "#4b5563" }}>{user.email}</p>
                </div>
              </div>
              <button 
                onClick={() => signOut(auth)} 
                className="rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:opacity-80"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cerrar sesión
              </button>
            </div>
            
            <div className="mt-4 border-t pt-4" style={{ borderColor: "#f3f4f6" }}>
              {user.emailVerified ? (
                <div className="flex items-center gap-2 text-sm" style={{ color: "#047857" }}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Correo verificado</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#b45309" }}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-medium">Correo sin verificar</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={sending}
                    className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#d97706", color: "#ffffff" }}
                  >
                    {sending ? "Enviando..." : "Reenviar verificación"}
                  </button>
                  {notice && <p className="text-sm" style={{ color: "#4b5563" }}>{notice}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link 
              href="/panel"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 transition-colors hover:opacity-90"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#fef3c7" }}>
                <svg className="h-5 w-5" style={{ color: "#b45309" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#111827" }}>Crear contenido</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>Ir al panel</p>
              </div>
            </Link>
            <Link 
              href="/explorar"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 transition-colors hover:opacity-90"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#dbeafe" }}>
                <svg className="h-5 w-5" style={{ color: "#1d4ed8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#111827" }}>Explorar</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>Descubre creadores</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <AuthForms />
      )}
    </main>
  );
}
