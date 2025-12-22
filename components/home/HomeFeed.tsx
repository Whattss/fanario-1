"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/cards/PostCard";
import { getPublicPosts, getCreators } from "@/lib/db";
import type { Publication, Creator } from "@/lib/sampleData";

export default function HomeFeed() {
  const [posts, setPosts] = useState<Publication[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedPosts, fetchedCreators] = await Promise.all([
          getPublicPosts(),
          getCreators()
        ]);
        setPosts(fetchedPosts);
        setCreators(fetchedCreators);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
        <p className="mt-2 text-gray-500">Cargando novedades...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
        <p className="text-gray-500">Aún no hay publicaciones. ¡Sé el primero en crear contenido!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((pub) => {
        const creator = creators.find((c) => c.id === pub.creatorId);
        return (
          <PostCard
            key={pub.id}
            publication={pub}
            creatorName={creator?.name || "Creador"}
            locked={!pub.isPublic}
          />
        );
      })}
    </div>
  );
}
