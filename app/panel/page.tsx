"use client";

import { useState } from "react";
import AuthGate from "@/components/auth/AuthGate";
import PostForm from "@/components/panel/PostForm";
import CreatorProfileForm from "@/components/panel/CreatorProfileForm";

export default function PanelPage() {
  const [tab, setTab] = useState<"posts" | "profile">("posts");

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:px-8 space-y-6">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-amber-700">Panel</p>
        <h1 className="text-2xl font-bold text-gray-900">Gestiona tu contenido</h1>
      </header>

      <AuthGate>
        <div className="flex gap-4 border-b border-gray-200 pb-1">
          <button
            onClick={() => setTab("posts")}
            className={`pb-2 text-sm font-medium transition ${
              tab === "posts"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Publicaciones
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`pb-2 text-sm font-medium transition ${
              tab === "profile"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Perfil de Creador
          </button>
        </div>

        {tab === "posts" ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Crea publicaciones con limite de 5MB por archivo.
            </p>
            <PostForm />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Configura cómo te ven tus suscriptores. Necesitas completar esto para aparecer en Explorar.
            </p>
            <CreatorProfileForm />
          </div>
        )}
      </AuthGate>
    </main>
  );
}
