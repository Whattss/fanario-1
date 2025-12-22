"use client";

import { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function PostForm() {
  const { user } = useAuthUser();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: "error", text: "Inicia sesión para publicar." });
      return;
    }

    if (title.length < 3) {
      setMessage({ type: "error", text: "El título debe tener al menos 3 caracteres." });
      return;
    }

    if (excerpt.length < 10) {
      setMessage({ type: "error", text: "El resumen debe tener al menos 10 caracteres." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      let mediaUrl: string | undefined;
      const file = fileInputRef.current?.files?.[0];
      
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setMessage({ type: "error", text: "Archivo demasiado grande (máx 5MB)" });
          setIsSubmitting(false);
          return;
        }
        
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `posts/${user.uid}/${fileName}`);
        await uploadBytes(storageRef, file, { contentType: file.type });
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "posts"), {
        ownerId: user.uid,
        creatorId: user.uid,
        title,
        excerpt,
        mediaUrl: mediaUrl || null,
        isPublic,
        createdAt: serverTimestamp(),
      });

      setMessage({ type: "success", text: "¡Publicación creada con éxito!" });
      setTitle("");
      setExcerpt("");
      setIsPublic(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Error al publicar:", error);
      const errorMsg = error instanceof Error ? error.message : "Error desconocido";
      setMessage({ type: "error", text: `Error: ${errorMsg}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold" style={{ color: "#111827" }}>Nueva publicación</h3>
      
      <div>
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Boceto del cartel"
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          style={{ color: "#111827", backgroundColor: "#ffffff" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          Resumen
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Comparte en pocas líneas"
          rows={3}
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          style={{ color: "#111827", backgroundColor: "#ffffff" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          Imagen o video (opcional, máx 5MB)
        </label>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          className="mt-1 w-full text-sm"
          style={{ color: "#374151" }}
        />
      </div>

      <label className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
        <input 
          type="checkbox" 
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded border-gray-300" 
        />
        Hacer visible para todos
      </label>

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
        {isSubmitting ? "Guardando..." : "Publicar"}
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
