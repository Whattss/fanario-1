"use client";

import { useState } from "react";
import CreatorCard from "@/components/cards/CreatorCard";
import type { Creator } from "@/lib/sampleData";

export default function ExplorarClient({ initialCreators }: { initialCreators: Creator[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = ["Todos", ...new Set(initialCreators.map((c) => c.category))];

  const filtered = initialCreators.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.bio.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || c.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar creadores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 pl-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ color: "#111827" }}
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: "#9ca3af" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                backgroundColor: category === cat ? "#111827" : "#ffffff",
                color: category === cat ? "#ffffff" : "#374151",
                border: category === cat ? "none" : "1px solid #e5e7eb"
              }}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg font-medium" style={{ color: "#111827" }}>No se encontraron creadores</p>
          <p style={{ color: "#6b7280" }}>Prueba con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
