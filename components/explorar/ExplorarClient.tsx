"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CreatorCard from "@/components/cards/CreatorCard";

type Creator = {
  id: string;
  ownerId: string;
  name: string;
  bio: string;
  category: string;
  price: number;
  avatar?: string;
  cover?: string;
};

export default function ExplorarClient() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function loadCreators() {
      try {
        const q = query(
          collection(db, "creators"),
          orderBy("updatedAt", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Creator[];
        setCreators(data);
      } catch (error) {
        console.error("Error cargando creadores:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCreators();
  }, []);

  const categories = Array.from(new Set(creators.map((c) => c.category))).filter(Boolean);

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || creator.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 rounded bg-gray-200"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Explora Creadores</h1>
        <p className="text-gray-600">Descubre y apoya a tu creador favorito</p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredCreators.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="text-xl font-semibold text-gray-900">No se encontraron creadores</p>
          <p className="mt-2 text-gray-500">
            {searchTerm || selectedCategory !== "all"
              ? "Intenta con otra búsqueda o categoría"
              : "Sé el primero en crear un perfil de creador"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </main>
  );
}
