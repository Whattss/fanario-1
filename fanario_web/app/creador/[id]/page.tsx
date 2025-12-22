import Image from "next/image";
import Link from "next/link";
import SubscribeButton from "@/components/payments/SubscribeButton";
import PostCard from "@/components/cards/PostCard";
import { creators, publications } from "@/lib/sampleData";

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = creators.find((c) => c.id === id);
  const posts = publications.filter((p) => p.creatorId === id);

  if (!creator) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Creador no encontrado</h1>
        <p className="mt-2 text-gray-500">Parece que este perfil no existe o ha sido eliminado.</p>
        <Link
          href="/explorar"
          className="mt-6 rounded-full bg-gray-900 px-6 py-2 font-semibold text-white"
        >
          Volver a explorar
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-28">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gray-100 sm:h-64 lg:h-80">
        <Image
          src={creator.cover}
          alt={`Portada de ${creator.name}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8 flex flex-col items-start sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-40 sm:w-40">
              <Image
                src={creator.avatar}
                alt={`Avatar de ${creator.name}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mb-2 hidden sm:block">
              <h1 className="text-3xl font-bold text-white drop-shadow-md">{creator.name}</h1>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                {creator.category}
              </span>
            </div>
          </div>
          
          <div className="mt-4 w-full sm:mt-0 sm:w-auto">
             {/* Mobile Name */}
            <div className="mb-4 sm:hidden">
              <h1 className="text-2xl font-bold text-gray-900">{creator.name}</h1>
              <span className="text-sm font-medium text-gray-500">{creator.category}</span>
            </div>
            
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:min-w-[280px]">
               <div className="mb-3 flex items-baseline justify-between">
                 <span className="text-sm font-medium text-gray-500">Suscripción mensual</span>
                 <span className="text-2xl font-bold text-gray-900">€{creator.price.toFixed(2)}</span>
               </div>
               <SubscribeButton creatorId={creator.id} amount={creator.price} />
            </div>
          </div>
        </div>

        {/* Bio & Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="mb-3 font-semibold text-gray-900">Sobre {creator.name}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{creator.bio}</p>
              
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>{posts.length} publicaciones</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Comunidad activa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Publicaciones recientes</h2>
              <div className="flex gap-2">
                 {/* Filter buttons could go here */}
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    publication={post}
                    creatorName={creator.name}
                    locked={!post.isPublic}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <p className="text-gray-500">Este creador aún no ha publicado nada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
