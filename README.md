# Frontend - Sistema de Asistencias | Club de Remo

Frontend estático para el sistema de asistencias. Este frontend se conecta al backend API (Flask) que corre en la Acer.

## 📁 Estructura

```
frontend/
├── index.html        # Dashboard principal
├── members.html      # Gestión de miembros (CREAR MANUALMENTE)
├── settings.html     # Configuración del dispositivo (CREAR MANUALMENTE)
├── css/
│   └── style.css     # Estilos (ya copiado)
└── js/
    ├── config.js     # Configuración del API ⚠️ IMPORTANTE
    ├── app.js        # Funciones comunes
    └── dashboard.js  # Lógica del dashboard
```

## ⚙️ Configuración

### 1. Configurar URL del API

Edita `js/config.js` y cambia `BASE_URL`:

**Para desarrollo local:**
```javascript
BASE_URL: 'http://localhost:5000',
```

**Para acceso remoto (ngrok):**
```javascript
BASE_URL: 'https://your-ngrok-url.ngrok.io',
```

> ⚠️ **IMPORTANTE**: Cada vez que reinicies ngrok, debes actualizar esta URL.

### 2. Archivos Faltantes

Los archivos `members.html` y `settings.html` deben crearse manualmente copiando la estructura de `index.html` y adaptando el contenido HTML de los templates originales en la carpeta `templates/`.

## 🚀 Deploy en GitHub Pages

### Paso 1: Crear Repositorio

1. Ve a GitHub y crea un nuevo repositorio: `pdrs-frontend`
2. Clona el repositorio en tu computadora:
```bash
git clone https://github.com/TU-USUARIO/pdrs-frontend.git
```

### Paso 2: Copiar Archivos

Copia todos los archivos de la carpeta `frontend/` al repositorio clonado.

### Paso 3: Subir a GitHub

```bash
cd pdrs-frontend
git add .
git commit -m "Initial frontend commit"
git push origin main
```

### Paso 4: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona **main branch**
4. Click **Save**
5. Espera unos minutos y accede a: `https://TU-USUARIO.github.io/pdrs-frontend`

## 🔧 Uso

### Desarrollo Local

1. Abre `index.html` directamente en tu navegador
2. Asegúrate de que el backend esté corriendo (`start_localhost.bat`)
3. Verifica que `config.js` apunte a `http://localhost:5000`

### Producción (GitHub Pages + ngrok)

1. **En la Acer**:
   ```cmd
   start_server_online.bat
   ```
   
2. **Copia la URL de ngrok** (ejemplo: `https://1234-abcd.ngrok.io`)

3. **Actualiza el frontend**:
   - Edita `js/config.js` con la nueva URL de ngrok
   - Sube los cambios a GitHub:
   ```bash
   git add js/config.js
   git commit -m "Update API URL"
   git push
   ```

4. **Accede desde cualquier dispositivo**:
   - `https://TU-USUARIO.github.io/pdrs-frontend`

## 🌐 Arquitectura

```
┌─────────────────────┐
│  Usuario Remoto     │
│  (Cualquier lugar)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ GitHub Pages        │
│ Frontend Estático   │
│ (HTML/CSS/JS)       │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐
│  Internet │ ngrok   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Acer (Red Local)    │
│ Flask API:5000      │
│ event_listener.py   │
│ SQLite Database     │
└──────────┬──────────┘
           │ LAN
           ▼
┌─────────────────────┐
│ Lector Hikvision    │
│ 192.168.100.162     │
└─────────────────────┘
```

## 🔐 Consideraciones de Seguridad

- ⚠️ La URL de GitHub Pages es pública
- 🔒 ngrok proporciona HTTPS automático
- 🔑 Considera agregar autenticación en el futuro

## 💡 Ventajas de esta Arquitectura

✅ **Frontend siempre disponible** (24/7)
✅ **URL fija del frontend** (no cambia)
✅ **Actualiz aciones independientes**
✅ **Menor carga en la Acer**
✅ **Escalable** (fácil migrar backend después)

## 🐛 Troubleshooting

### "Cannot read properties of undefined"
- Verifica que `config.js` esté cargado antes de `app.js` y `dashboard.js`

### "Failed to fetch"
- Verifica que el backend esté corriendo
- Verifica la URL en `config.js`
- Verifica que ngrok esté activo

### "CORS error"
- El backend ya tiene CORS habilitado
- Si persiste, verifica que `flask-cors` esté instalado

### "Page not updating in real-time"
- Verifica la conexión SSE (EventSource)
- Abre Developer Tools → Network → Busca `/api/attendance/live`

## 📞 Soporte

Para actualizar la URL de ngrok rápidamente:

1. Obtén nueva URL de ngrok
2. Actualiza `js/config.js`
3. Commit y push a GitHub
4. Espera ~1 min para que GitHub Pages actualice

---

**Próximos pasos**: Crea `members.html` y `settings.html` basándote en los templates originales.
