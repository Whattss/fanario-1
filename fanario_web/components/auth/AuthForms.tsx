"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";

// Traducciones de errores de Firebase
function traducirError(code: string): string {
  const errores: Record<string, string> = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/operation-not-allowed": "Operación no permitida. Contacta al administrador.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Credenciales inválidas. Revisa correo y contraseña.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
  };
  return errores[code] || "Error desconocido. Inténtalo de nuevo.";
}

export default function AuthForms() {
  const [mode, setMode] = useState<"registrar" | "entrar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMensaje(null);
    setMensajeExito(false);
    
    try {
      if (mode === "entrar") {
        await signInWithEmailAndPassword(auth, email, password);
        setMensaje("¡Sesión iniciada correctamente!");
        setMensajeExito(true);
      } else {
        // Validar nombre de usuario
        const cleanUsername = username.trim().toLowerCase();
        if (!cleanUsername || cleanUsername.length < 3) {
          throw new Error("El nombre de usuario debe tener al menos 3 caracteres.");
        }
        if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
          throw new Error("Solo letras minúsculas, números y guion bajo (3-20 caracteres).");
        }

        // Primero crear la cuenta en Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Intentar guardar en Firestore (si falla, la cuenta ya está creada)
        try {
          // Verificar si el nombre de usuario ya existe
          const usernameRef = doc(db, "usernames", cleanUsername);
          const usernameSnap = await getDoc(usernameRef);
          
          if (usernameSnap.exists()) {
            // El nombre ya existe pero la cuenta se creó, avisar al usuario
            setMensaje("Cuenta creada, pero el nombre de usuario ya existe. Ve a tu perfil para cambiarlo.");
            setMensajeExito(true);
          } else {
            // Guardar usuario y reservar nombre
            await setDoc(doc(db, "users", cred.user.uid), {
              email,
              username: cleanUsername,
              createdAt: serverTimestamp(),
            });
            
            await setDoc(doc(db, "usernames", cleanUsername), {
              uid: cred.user.uid
            });
          }
        } catch (firestoreError) {
          console.warn("Error guardando en Firestore (la cuenta se creó):", firestoreError);
        }

        try {
          await sendEmailVerification(cred.user);
        } catch (e) {
          console.warn("No se pudo enviar verificación:", e);
        }
        
        setMensaje("¡Cuenta creada! Ya puedes usar la plataforma.");
        setMensajeExito(true);
      }
    } catch (error: any) {
      console.error("Error en autenticación:", error);
      const errorCode = error?.code || "";
      const mensaje = errorCode ? traducirError(errorCode) : (error?.message || "No se pudo completar la acción.");
      setMensaje(mensaje);
      setMensajeExito(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setMensaje("Escribe tu correo para enviar el enlace de recuperacion.");
      return;
    }
    setResetLoading(true);
    setMensaje(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("Hemos enviado un enlace para restablecer tu contraseña.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudo enviar el correo de recuperacion.";
      setMensaje(message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("entrar")}
          style={{ 
            backgroundColor: mode === "entrar" ? "#111827" : "#f3f4f6",
            color: mode === "entrar" ? "#ffffff" : "#111827"
          }}
          className="rounded-full px-4 py-2 font-medium transition"
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setMode("registrar")}
          style={{ 
            backgroundColor: mode === "registrar" ? "#111827" : "#f3f4f6",
            color: mode === "registrar" ? "#ffffff" : "#111827"
          }}
          className="rounded-full px-4 py-2 font-medium transition"
        >
          Crear cuenta
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "registrar" && (
          <div>
            <label className="block text-sm font-medium" style={{ color: "#374151" }}>
              Nombre de usuario
            </label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="usuario_unico"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              style={{ color: "#111827", backgroundColor: "#ffffff" }}
            />
            <span className="text-xs" style={{ color: "#6b7280" }}>Solo letras minúsculas, números y guion bajo.</span>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Correo
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ color: "#111827", backgroundColor: "#ffffff" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" style={{ color: "#374151" }}>
            Contraseña
          </label>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ color: "#111827", backgroundColor: "#ffffff" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ 
            backgroundColor: "#111827", 
            color: "#ffffff",
            opacity: loading ? 0.6 : 1 
          }}
          className="w-full rounded-xl px-4 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : mode === "entrar" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>
      <div className="flex items-center justify-between text-sm" style={{ color: "#374151" }}>
        <button
          type="button"
          onClick={handleReset}
          className="underline hover:opacity-70"
          disabled={resetLoading}
        >
          {resetLoading ? "Enviando..." : "Olvidé mi contraseña"}
        </button>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="underline hover:opacity-70"
        >
          Cerrar sesión
        </button>
      </div>
      {mensaje && (
        <p 
          className="text-sm font-medium"
          style={{ color: mensajeExito ? "#059669" : "#dc2626" }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
