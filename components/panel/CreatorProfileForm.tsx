"use client";

import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function CreatorProfileForm() {
  const { user } = useAuthUser();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoadingData(false);
        return;
      }
      try {
        const docRef = doc(db, "creators", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setCategory(data.category || "");
          setPrice(data.price?.toString() || "");
        }
      } catch (e) {
        console.error("Error cargando perfil", e);
      } finally {
        setLoadingData(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: "error", text: "Debes iniciar sesión." });
      return;
    }

    if (name.length < 3) {
      setMessage({ type: "error", text: "El nombre debe tener al menos 3 caracteres." });
      return;
    }

    if (bio.length < 10) {
      setMessage({ type: "error", text: "La biografía debe tener al menos 10 caracteres." });
      return;
    }

    if (category.length < 3) {
      setMessage({ type: "error", text: "La categoría es requerida." });
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 1) {
      setMessage({ type: "error", text: "El precio mínimo es 1€." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      let avatarUrl: string | undefined;
      let coverUrl: string | undefined;

      // Subir Avatar
      const avatarFile = avatarRef.current?.files?.[0];
      if (avatarFile) {
        const storageRef = ref(storage, `creators/${user.uid}/avatar_${Date.now()}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      // Subir Portada
      const coverFile = coverRef.current?.files?.[0];
      if (coverFile) {
        const storageRef = ref(storage, `creators/${user.uid}/cover_${Date.now()}`);
        await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(storageRef);
      }

      const updateData: Record<string, unknown> = {
        ownerId: user.uid,
        name,
        bio,
        category,
        price: priceNum,
        updatedAt: serverTimestamp(),
      };

      if (avatarUrl) updateData.avatar = avatarUrl;
      if (coverUrl) updateData.cover = coverUrl;

      await setDoc(doc(db, "creators", user.uid), updateData, { merge: true });
      
      setMessage({ type: "success", text: "¡Perfil actualizado correctamente!" });
      
      // Limpiar inputs de archivo
      if (avatarRef.current) avatarRef.current.value = "";
      if (coverRef.current) coverRef.current.value = "";
      
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      const msg = error instanceof Error ? error.message : "Error al guardar perfil.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-sm" style={{ color: "#6b7280" }}>
        Cargando perfil...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold" style={{ color: "#111827" }}>Tu Perfil de Creador</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Nombre público
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Artista Genial"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ color: "#111827", backgroundColor: "#ffffff" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Categoría
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej. Ilustración, Música..."
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ color: "#111827", backgroundColor: "#ffffff" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          Biografía
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Cuéntale a tus fans quién eres..."
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          style={{ color: "#111827", backgroundColor: "#ffffff" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          Precio mensual (€)
        </label>
        <input
          type="number"
          step="0.5"
          min="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          style={{ color: "#111827", backgroundColor: "#ffffff" }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Avatar (Imagen cuadrada)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={avatarRef}
            className="mt-1 w-full text-sm"
            style={{ color: "#374151" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Portada (Imagen panorámica)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={coverRef}
            className="mt-1 w-full text-sm"
            style={{ color: "#374151" }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{ 
          backgroundColor: "#111827", 
          color: "#ffffff",
          opacity: isSubmitting ? 0.6 : 1 
        }}
        className="w-full rounded-xl px-4 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Guardando..." : "Guardar Perfil"}
      </button>
      
      {message && (
        <p 
          className="text-sm font-medium"
          style={{ color: message.type === "success" ? "#059669" : "#dc2626" }}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
