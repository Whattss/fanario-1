import Link from "next/link";
import CreatorCard from "@/components/cards/CreatorCard";
import HomeFeed from "@/components/home/HomeFeed";
import { creators } from "@/lib/sampleData";

export default function Home() {
  const featuredCreators = creators.slice(0, 2);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 pb-24 sm:px-8 sm:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16" style={{ background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)" }}>
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#fcd34d" }}>
            Comunidad de Creadores
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "#ffffff" }}>
            Conecta con quien te inspira
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "#d1d5db" }}>
            Accede a contenido exclusivo, apoya el talento local y forma parte de una comunidad creativa.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/explorar"
              className="inline-block rounded-full px-8 py-3 text-center font-bold transition hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: "#111827" }}
            >
              Explorar creadores
            </Link>
            <Link
              href="/cuenta"
              className="inline-block rounded-full px-8 py-3 text-center font-bold transition hover:opacity-80"
              style={{ backgroundColor: "transparent", color: "#ffffff", border: "2px solid rgba(255,255,255,0.3)" }}
            >
              Crear mi cuenta
            </Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}></div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "rgba(244, 63, 94, 0.2)" }}></div>
      </section>

      {/* Featured Creators */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>Creadores destacados</h2>
            <p style={{ color: "#6b7280" }}>Talento que merece la pena descubrir</p>
          </div>
          <Link href="/explorar" className="text-sm font-semibold hover:underline" style={{ color: "#b45309" }}>
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center" style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "#fef3c7" }}>
              <svg className="h-6 w-6" style={{ color: "#d97706" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="mb-1 font-semibold" style={{ color: "#111827" }}>¿Eres creador?</p>
            <p className="mb-4 text-sm" style={{ color: "#6b7280" }}>Empieza a monetizar tu contenido hoy mismo.</p>
            <Link 
              href="/panel" 
              className="rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#111827", color: "#ffffff" }}
            >
              Crear perfil
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>Novedades</h2>
        </div>
        <HomeFeed />
      </section>
    </main>
  );
}
