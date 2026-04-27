# 🏗️ Ripconciv — Sistema de Almuerzos

Plataforma web para registro y control de almuerzos empresariales.

---

## 📁 Estructura de archivos

```
ripconciv/
├── index.html      ← Registro de empleados (URL del QR)
├── login.html      ← Login para Admin y Cocina
├── admin.html      ← Panel administrativo completo
├── cocina.html     ← Vista de la señora de almuerzos (tiempo real)
├── js/
│   └── config.js   ← Configuración, credenciales, lista de empleados
└── README.md
```

---

## 🗄️ PASO 1 — Crear tabla en Supabase

Ve a tu proyecto Supabase → **SQL Editor** → ejecuta:

```sql
CREATE TABLE IF NOT EXISTS almuerzos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empleado    text NOT NULL,
  tipo        text NOT NULL CHECK (tipo IN ('completo','segundo')),
  fecha       date NOT NULL,
  hora        timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_almuerzos_fecha     ON almuerzos (fecha);
CREATE INDEX IF NOT EXISTS idx_almuerzos_empleado  ON almuerzos (empleado);

ALTER TABLE almuerzos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON almuerzos FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_select" ON almuerzos FOR SELECT USING (true);
```

---

## 🚀 PASO 2 — Publicar en GitHub Pages

### 2a. Crear repositorio
1. Ve a https://github.com/new
2. Nombre: `ripconciv-almuerzos` (o el que prefieras)
3. Visibilidad: **Private** (recomendado)
4. Clic en **Create repository**

### 2b. Subir archivos
En tu computadora, abre una terminal en la carpeta `ripconciv/` y ejecuta:

```bash
git init
git add .
git commit -m "Plataforma almuerzos Ripconciv"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ripconciv-almuerzos.git
git push -u origin main
```

### 2c. Activar GitHub Pages
1. En tu repositorio → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Clic en **Save**
5. En 1-2 minutos tu URL será:
   ```
   https://TU_USUARIO.github.io/ripconciv-almuerzos/
   ```

---

## 📷 PASO 3 — Generar e imprimir el QR

1. Ve a cualquier generador de QR gratuito (ej: https://qr-code-generator.com)
2. Pega la URL: `https://TU_USUARIO.github.io/ripconciv-almuerzos/`
3. Imprime y pega en el comedor

---

## 🔐 PASO 4 — Cambiar contraseñas

Abre `js/config.js` y cambia las contraseñas por defecto:

```js
usuarios: {
  admin:  { password: 'TuContraseñaSegura!', rol: 'admin' },
  cocina: { password: 'OtraContraseña!',     rol: 'cocina' }
}
```

Luego vuelve a hacer commit y push.

---

## 📱 URLs de acceso

| Vista | URL | Para quién |
|---|---|---|
| Registro | `https://TU_USUARIO.github.io/ripconciv-almuerzos/` | Empleados (vía QR) |
| Login | `https://TU_USUARIO.github.io/ripconciv-almuerzos/login.html` | Admin y Cocina |
| Admin | `https://TU_USUARIO.github.io/ripconciv-almuerzos/admin.html` | Tú / empresa |
| Cocina | `https://TU_USUARIO.github.io/ripconciv-almuerzos/cocina.html` | Señora almuerzos |

---

## ✅ Funcionalidades incluidas

- ✅ Registro de empleados (lista desplegable, sin escribir)
- ✅ Anti-duplicado: no permite registrarse dos veces el mismo día
- ✅ Fecha automática en zona horaria Ecuador (America/Guayaquil)
- ✅ Login separado para Admin y Cocina (usuario + contraseña)
- ✅ Panel Admin: estadísticas del día, historial por mes, ranking por empleado
- ✅ Exportar a CSV (día o mes completo)
- ✅ Vista Cocina: totales grandes, listas por tipo, actualización automática cada 30s
- ✅ Botón WhatsApp en cocina: genera resumen listo para enviar
- ✅ Base de datos Supabase con historial permanente
