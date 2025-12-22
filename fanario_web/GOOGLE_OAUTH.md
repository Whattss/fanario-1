# 🔐 Configuración Google OAuth

## ✅ Ya implementado en el código

- ✅ Botón "Continuar con Google"
- ✅ Guardado automático de usuarios en Firestore
- ✅ Manejo de errores traducidos al español

## 🚀 Activar Google OAuth (5 minutos)

### Paso 1: Ir a Firebase Console
1. Abre https://console.firebase.google.com
2. Selecciona tu proyecto: **fanario-es**
3. En el menú lateral, click en **Authentication** (icono de escudo 🛡️)
4. Click en la pestaña **Sign-in method**

### Paso 2: Habilitar Google
1. En la lista de proveedores, busca **Google**
2. Click en **Google**
3. Activa el toggle **Enable** (lo pones en ON)
4. Selecciona un **Support email** (usa tu email)
5. Click en **Save**

**🎉 ¡YA ESTÁ!** Google OAuth funcionando.

---

## ✅ Verificar que funciona

### Probar en local:
1. Asegúrate de que el servidor corre:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:3000/cuenta

3. Verás el botón **"Continuar con Google"**

4. Click → Se abre popup de Google → Elige tu cuenta → ¡Listo!

---

## 🆘 Errores comunes

### ❌ "unauthorized-domain"
**Solución:**
1. Firebase Console → **Authentication** → **Settings**
2. Scroll hasta **Authorized domains**
3. Agrega: `localhost` (si no está)

### ❌ "popup-closed-by-user"
- El usuario cerró la ventana antes de completar
- Es normal, no es un error real

### ❌ No aparece el botón
- Verifica que el servidor esté corriendo
- Abre la consola del navegador (F12) para ver errores

---

## 📱 Producción

Cuando despliegues a producción (Firebase Hosting, Vercel, etc.):

1. **No necesitas cambiar nada** ✅
2. Firebase automáticamente agrega tu dominio a los autorizados
3. El botón de Google funcionará igual

---

## 📝 ¿Qué datos se guardan?

Cuando un usuario inicia sesión con Google, se guarda en Firestore:

```
/users/{uid}
  - email: string
  - username: string (generado automáticamente)
  - displayName: string
  - photoURL: string (foto de perfil de Google)
  - provider: "google"
  - createdAt: timestamp
```

---

## 🎯 CHECKLIST

- [ ] Google habilitado en Firebase Console
- [ ] Email de soporte seleccionado
- [ ] Probado en http://localhost:3000/cuenta
- [ ] Usuario se crea correctamente en Firestore

---

**¡Listo! Tus usuarios ahora pueden iniciar sesión con un solo click! 🚀**
