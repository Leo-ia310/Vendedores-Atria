# Despliegue y conexión con Apps Script

## Parte A — Backend (Google Apps Script)

1. **Crea una Hoja de Cálculo de Google** nueva (será tu base de datos).
2. Menú **Extensiones → Apps Script**. Borra el código por defecto.
3. Abre [`script.txt`](../script.txt), copia **todo** su contenido y pégalo en el editor. Guarda.
4. Vuelve a la hoja y **recárgala**: aparecerá el menú **ARCA**.
5. **ARCA → 1. Inicializar / reparar hojas.** Crea las 26 hojas con encabezados y los valores de configuración por defecto.
6. **ARCA → 2. Configurar secretos y admin.** Genera el `PEPPER` (hash de contraseñas) y crea el usuario administrador (te pedirá correo y contraseña).
7. *(Opcional)* **ARCA → 3. Cargar datos de prueba.** Carga módulos y preguntas base para probar exámenes de inmediato.
8. **Publicar la Web App:**
   - **Implementar → Nueva implementación → Tipo: Aplicación web.**
   - **Ejecutar como:** *Yo (tu cuenta)*.
   - **Quién tiene acceso:** *Cualquier usuario*.
   - Implementar y **autorizar** los permisos.
   - Copia la **URL** que termina en `/exec`.

> Cada vez que edites `script.txt`, crea una **nueva versión** de la implementación (Implementar → Gestionar implementaciones → editar → Nueva versión) para que los cambios tengan efecto.

### Propiedades del script (secretos)
Se guardan en **Configuración del proyecto → Propiedades del script** (el menú las crea/gestiona por ti):
- `SPREADSHEET_ID` — se fija automáticamente al inicializar.
- `PEPPER` — pimienta global del hash (se genera automáticamente).
- `API_SHARED_TOKEN` — opcional, para integraciones administrativas.

## Parte B — Frontend (Next.js)

1. `npm install`
2. `cp .env.example .env.local`
3. Edita `.env.local` y pega la URL del paso A.8:
   ```
   NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   NEXT_PUBLIC_WHATSAPP_SOPORTE=50500000000
   ```
4. `npm run dev` y abre http://localhost:3000

### Verificar la conexión
Con el backend publicado, el registro, login y demás acciones deben responder. Si ves el error *“Backend no configurado”*, falta `NEXT_PUBLIC_APPS_SCRIPT_URL`. Si ves *“No se pudo conectar”*, revisa que la Web App esté publicada como *Cualquier usuario* y que la URL termine en `/exec`.

## Despliegue en producción (Vercel)

1. Sube el repo a GitHub e impórtalo en Vercel.
2. Define las variables `NEXT_PUBLIC_*` en Vercel (Project → Settings → Environment Variables).
3. Deploy. El frontend es estático/SSR; el backend sigue en Apps Script.

## Notas de CORS
El cliente (`lib/api.ts`) envía los POST como `text/plain` para evitar el *preflight* CORS que Apps Script no maneja bien. No cambies esto sin probar.
