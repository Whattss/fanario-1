# Fanario

Plataforma en castellano para apoyar a creadores con suscripciones y contenido exclusivo. Construida con Next.js (App Router), TypeScript, Tailwind CSS, Firebase (Auth/Firestore/Storage) y PayPal Checkout.

## Requisitos previos
- Node 18+
- Cuenta de Firebase con proyecto y Firestore/Storage habilitados
- Cuenta de PayPal (sandbox) con Client ID y Client Secret

## Instalacion
```bash
npm install
```

## Variables de entorno
Copia `.env.local.example` a `.env.local` y completa con tus claves:

```bash
cp .env.local.example .env.local
```

Necesitarás:
- Credenciales de Firebase (Project Settings > General > Web App)
- Credenciales de PayPal Developer (Sandbox para pruebas)

## Firebase
1) En la consola de Firebase crea un proyecto y habilita Authentication (correo/contraseña), Firestore y Storage.
2) Descarga las credenciales web y ponlas en `.env.local`.
3) Aplica las reglas de seguridad:
	- Firestore: `firebase deploy --only firestore` usando `firestore.rules`.
	- Storage: `firebase deploy --only storage` usando `storage.rules`.

## PayPal
1) Crea credenciales sandbox en developer.paypal.com.
2) Coloca `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` en `.env.local`.
3) El cliente lee el Client ID desde `.env.local` (no se hardcodea) y los endpoints en `/api/paypal/*` manejan la creacion y captura de ordenes.

## Scripts
- `npm run dev` arranca el entorno en `http://localhost:3000`.
- `npm run build` genera la version de produccion.
- `npm run start` lanza la build.
- `npm run lint` ejecuta ESLint.

## Estructura funcional
- `/` Inicio con hero y publicaciones visibles.
- `/explorar` listado de creadores.
- `/creador/[id]` perfil, biografia y boton de suscripcion PayPal.
- `/panel` (protegido) formulario para crear publicaciones (limite 5MB, publica/solo suscriptores).
- `/cuenta` iniciar o crear cuenta con Firebase Auth.

## Consideraciones de seguridad
- Reglas en `firestore.rules` y `storage.rules` restringen escritura a usuarios autenticados y validan acceso a publicaciones solo para suscriptores o contenido publico.
- Validacion basica de formularios con Zod y react-hook-form en el panel.
- Subidas limitadas a 5MB y tipos imagen/video.

## Despliegue
1) Configura `.env.local` en el servidor (Vercel u otro). Usa `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` y las claves de Firebase.
2) Ejecuta `npm run build` para confirmar que compila.
3) Sube `firestore.rules` y `storage.rules` a Firebase antes de servir usuarios reales.

## Pendiente para produccion
- Verificacion de edad y control de contenido sensible.
- Moderacion/denuncia de publicaciones y mensajes entre usuarios.
- Facturacion recurrente y webhooks de PayPal para estados de suscripcion.
- Logs y alertas (monitoring) para errores en server actions y pagos.
- Recuperacion de cuenta y cambio de correo.
- Version accesible con validaciones WCAG y tests de contraste.
