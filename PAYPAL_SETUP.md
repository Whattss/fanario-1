# 🔧 Configuración de PayPal

## ⚠️ Error Actual: Cuenta Restringida

Si ves el error **"PAYEE_ACCOUNT_RESTRICTED"**, significa que tu cuenta de PayPal Business está restringida.

## 🛠️ Soluciones

### Opción 1: Usar Sandbox (Recomendado para Desarrollo)

1. Ve a https://developer.paypal.com/dashboard/applications/sandbox
2. Crea una aplicación (o usa la existente)
3. Copia las credenciales **Sandbox**:
   - Client ID
   - Secret
4. Actualiza tu `.env`:
   ```env
   PAYPAL_CLIENT_ID=tu_sandbox_client_id
   PAYPAL_CLIENT_SECRET=tu_sandbox_secret
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_sandbox_client_id
   ```
5. Usa cuentas de prueba de PayPal Sandbox para hacer pagos de prueba

### Opción 2: Verificar Cuenta de Producción

Para usar credenciales LIVE (producción):

1. Ve a https://paypal.com
2. Completa la verificación de cuenta Business:
   - ✅ Verifica tu identidad (DNI/Pasaporte)
   - ✅ Vincula una cuenta bancaria
   - ✅ Completa la información fiscal
3. Espera aprobación de PayPal (puede tardar 1-3 días)
4. Una vez verificada, las credenciales LIVE funcionarán

## 🔄 Cambiar entre Sandbox y Live

La API detecta automáticamente basándose en tus credenciales:
- **Sandbox**: usa `https://api-m.sandbox.paypal.com`
- **Live**: usa `https://api-m.paypal.com`

## 📝 Notas

- ⚠️ **NO** uses credenciales LIVE sin tener la cuenta verificada
- 💡 Sandbox es perfecto para desarrollo y pruebas
- 🔒 Nunca compartas tus credenciales secretas

## 🆘 Más Ayuda

- Documentación: https://developer.paypal.com/docs/
- Soporte: https://www.paypal.com/businesshelp/
