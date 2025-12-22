import Image from "next/image";
import Link from "next/link";
import type { Creator } from "@/lib/sampleData";

type Props = {
  creator: Creator;
};

export default function CreatorCard({ creator }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: "#e5e7eb" }}>
      <div className="relative h-32 w-full" style={{ backgroundColor: "#f3f4f6" }}>
        <Image
          src={creator.cover}
          alt={`Portada de ${creator.name}`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute -bottom-8 left-4 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
          <Image
            src={creator.avatar}
            alt={`Avatar de ${creator.name}`}
            fill
            sizes="64px"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>
      <div className="p-4 pt-10 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold" style={{ color: "#111827" }}>{creator.name}</h3>
          <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
            {creator.category}
          </span>
        </div>
        <p className="line-clamp-2 text-sm" style={{ color: "#4b5563" }}>{creator.bio}</p>
        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#f3f4f6" }}>
          <span className="text-lg font-bold" style={{ color: "#111827" }}>
            €{creator.price.toFixed(2)}
            <span className="text-sm font-normal" style={{ color: "#6b7280" }}>/mes</span>
          </span>
          <Link
            href={`/creador/${creator.id}`}
            className="rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#111827", color: "#ffffff" }}
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
