import Image from "next/image";
import Link from "next/link";
import type { Publication } from "@/lib/sampleData";

type Props = {
  publication: Publication;
  creatorName: string;
  locked?: boolean;
};

export default function PostCard({ publication, creatorName, locked }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: "#e5e7eb" }}>
      {publication.image ? (
        <div className="relative h-48 w-full" style={{ backgroundColor: "#f3f4f6" }}>
          <Image
            src={publication.image}
            alt={publication.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold" style={{ color: "#111827" }}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Solo suscriptores
              </span>
            </div>
          )}
        </div>
      ) : null}
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
          <span className="font-medium" style={{ color: "#374151" }}>{creatorName}</span>
          <span>•</span>
          <time dateTime={publication.date}>{new Date(publication.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</time>
          {!publication.isPublic && (
            <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
              Exclusivo
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold" style={{ color: "#111827" }}>{publication.title}</h3>
        <p className="line-clamp-2 text-sm" style={{ color: "#4b5563" }}>{publication.excerpt}</p>
        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#f3f4f6" }}>
          <Link
            href={`/creador/${publication.creatorId}`}
            className="text-sm font-medium hover:underline"
            style={{ color: "#b45309" }}
          >
            Ver creador →
          </Link>
          {locked ? (
            <Link 
              href={`/creador/${publication.creatorId}`}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#d97706", color: "#ffffff" }}
            >
              Suscribirme
            </Link>
          ) : (
            <span className="text-xs font-medium" style={{ color: "#059669" }}>✓ Disponible</span>
          )}
        </div>
      </div>
    </article>
  );
}
