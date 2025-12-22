"use client";

import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header() {
  const { user, loading } = useAuthUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: "#e5e7eb" }}>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: "#111827" }}>
          Fanario
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 sm:flex">
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/explorar" className="transition-colors hover:opacity-70" style={{ color: "#4b5563" }}>
              Explorar
            </Link>
            <Link href="/panel" className="transition-colors hover:opacity-70" style={{ color: "#4b5563" }}>
              Panel
            </Link>
          </nav>
          
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full" style={{ backgroundColor: "#e5e7eb" }}></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/cuenta" 
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ backgroundColor: "#f3f4f6", color: "#111827" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Cuenta
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ borderColor: "#d1d5db", color: "#374151" }}
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/cuenta"
              className="rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#111827", color: "#ffffff" }}
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile - solo logo, navegación abajo */}
        <div className="sm:hidden">
          {!loading && (
            <Link 
              href="/cuenta" 
              className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: user ? "#f3f4f6" : "#111827",
                color: user ? "#111827" : "#ffffff"
              }}
            >
              {user ? "Cuenta" : "Entrar"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
