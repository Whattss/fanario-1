# 🚀 Desplegar en Vercel

## 📝 Variables de Entorno

Vercel **NO** lee el archivo `.env` del repositorio. Tienes que configurarlas manualmente en el dashboard.

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a https://vercel.com
2. Importa tu proyecto (Whattss/fanario-1 o SaguntumEcho/fanario)
3. **ANTES de hacer deploy**, ve a **Settings** → **Environment Variables**
4. Agrega una por una:

#### Variables Públicas (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5TSfP32FyRwbZzGkNZ1p-U5IlRia5tZs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fanario-es.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fanario-es
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fanario-es.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=937595182382
NEXT_PUBLIC_FIREBASE_APP_ID=1:937595182382:web:4419513c0f3848c7f46ebf
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3C4FEVRD2Z
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://fanario-es-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AeQ3NB8b3TwUkJjYS6o59KCxT0zRVVDK0zv44o9NefU3IWeCabYOZ1JM5Ljs3Bg6YSskyrYirzVRLHZZ
```

#### Variables Privadas (servidor)
```
PAYPAL_CLIENT_ID=AeQ3NB8b3TwUkJjYS6o59KCxT0zRVVDK0zv44o9NefU3IWeCabYOZ1JM5Ljs3Bg6YSskyrYirzVRLHZZ
PAYPAL_CLIENT_SECRET=EAVmXWtn1NjVooEjIv_2xG5XBCDPo4ldDFm4NAKO4IAvFD4LwKN-J1Ay9J7AdU2fZ45uYMaU-8uBakbB
```

5. Para cada variable:
   - **Name:** (nombre de la variable)
   - **Value:** (valor)
   - **Environment:** Marca todas (Production, Preview, Development)
   - Click **Add**

6. Cuando termines, haz **Deploy** o **Redeploy**

---

### Opción 2: Desde CLI (Más rápido)

#### Paso 1: Instalar Vercel CLI
```bash
npm i -g vercel
```

#### Paso 2: Login
```bash
vercel login
```

#### Paso 3: Agregar variables
```bash
cd /home/whattss/fanario

# Variables públicas
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Pega: AIzaSyB5TSfP32FyRwbZzGkNZ1p-U5IlRia5tZs
# Selecciona: Production, Preview, Development

vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# Pega: fanario-es.firebaseapp.com
# etc...

# Repite para todas las variables
```

#### Paso 4: Deploy
```bash
vercel --prod
```

---

### Opción 3: Desde archivo (Automático) ⚡

```bash
cd /home/whattss/fanario

# Agregar todas las variables de golpe
vercel env pull .env.local
# Luego editarlo y hacer:
vercel env push .env.local production
```

---

## ⚠️ IMPORTANTE

### No subir .env a Git
Ya está en `.gitignore`, pero verifica:
```bash
git check-ignore .env  # Debería decir ".env"
```

### Variables públicas vs privadas
- `NEXT_PUBLIC_*` → Se exponen al navegador (ok para Firebase)
- Sin `NEXT_PUBLIC_` → Solo en servidor (PayPal Secret)

### Después del deploy
1. Verifica que las variables estén en Settings → Environment Variables
2. Si cambias algo, haz **Redeploy** desde el dashboard
3. Las variables se aplican en el siguiente deploy

---

## 🎯 Checklist rápido

- [ ] Proyecto importado en Vercel
- [ ] 9 variables NEXT_PUBLIC_* agregadas
- [ ] 2 variables PayPal agregadas (Client ID y Secret)
- [ ] Environments: Production, Preview, Development marcados
- [ ] Deploy realizado
- [ ] App funcionando en https://tu-proyecto.vercel.app

---

## 🆘 Si algo falla

**Error: "Missing environment variables"**
- Ve a Settings → Environment Variables
- Verifica que TODAS las variables estén
- Redeploy

**PayPal no funciona en producción:**
- Verifica que PAYPAL_CLIENT_SECRET esté configurado
- Revisa que no sea una variable pública (sin NEXT_PUBLIC_)

**Firebase no conecta:**
- Verifica que TODAS las variables NEXT_PUBLIC_FIREBASE_* estén
- Firebase Console → Authentication → Settings → Authorized domains
- Agrega tu dominio de Vercel: `tu-proyecto.vercel.app`

---

## 📱 URL de producción

Cuando despliegues, tu app estará en:
```
https://fanario-1.vercel.app
```
o el nombre que elijas.

**Recuerda:**
1. Agregar dominio a Firebase Authorized domains
2. Agregar dominio a PayPal si usas producción
3. Configurar Google OAuth con el nuevo dominio
