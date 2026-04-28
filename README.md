# 🏗️ RIPCONCIV — Sistema de Almuerzos v3

---

## PASO 1 — SQL en Supabase (ejecutar UNA sola vez)

```sql
-- Eliminar tabla anterior si existe
DROP TABLE IF EXISTS almuerzos;

-- Crear tabla completa v3
CREATE TABLE almuerzos (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empleado         text NOT NULL,
  email            text,
  tipo_user        text NOT NULL DEFAULT 'ms' CHECK (tipo_user IN ('ms','guest')),

  -- Registro
  fecha            date NOT NULL,
  hora             timestamptz NOT NULL DEFAULT now(),
  modalidad        text NOT NULL CHECK (modalidad IN ('ahi','llevar')),
  tipo             text CHECK (tipo IN ('completo','segundo','llevar')),

  -- Para llevar
  llevar_sopa      boolean,
  llevar_plato     text,
  llevar_postre    boolean,
  llevar_bebida    text,
  recogedor        text,

  -- Asistencia (check cocina)
  asistio          boolean NOT NULL DEFAULT false,
  asistio_marcado  timestamptz,
  asistio_flag     boolean NOT NULL DEFAULT false,

  created_at       timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_alm_fecha     ON almuerzos (fecha);
CREATE INDEX idx_alm_empleado  ON almuerzos (empleado);
CREATE INDEX idx_alm_modalidad ON almuerzos (modalidad);
CREATE INDEX idx_alm_asistio   ON almuerzos (asistio);

-- Seguridad
ALTER TABLE almuerzos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_open"  ON almuerzos FOR INSERT WITH CHECK (true);
CREATE POLICY "select_open"  ON almuerzos FOR SELECT USING (true);
CREATE POLICY "update_open"  ON almuerzos FOR UPDATE USING (true);
```

---

## PASO 2 — Cambiar contraseñas

Abre `js/config.js` y cambia:
```js
usuarios: {
  admin:  { password: 'TuPasswordAdmin!',  rol: 'admin'  },
  cocina: { password: 'TuPasswordCocina!', rol: 'cocina' }
}
```

---

## PASO 3 — Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Ripconciv Almuerzos v3"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ripconciv-almuerzos.git
git push -u origin main
```

GitHub → Settings → Pages → Branch: main / (root) → Save

Tu URL: `https://TU_USUARIO.github.io/ripconciv-almuerzos/`

---

## PASO 4 — En Azure AD, agregar la URL de GitHub Pages

Portal Azure → App registrations → Ripconciv Almuerzos → Authentication → Redirect URIs → Agregar:
```
https://TU_USUARIO.github.io/ripconciv-almuerzos/
```

---

## Flujos de acceso

| Quién         | URL                        | Seguridad               |
|---------------|----------------------------|-------------------------|
| Empleado (QR) | `/index.html`              | Login Microsoft 365     |
| Invitado      | `/index.html?inv=...&f=...`| Token válido solo 1 día |
| Admin         | `/admin.html`              | Usuario + contraseña    |
| Cocina        | `/cocina.html`             | Usuario + contraseña    |

---

## Lógica del check de asistencia

| Acción cocina       | `asistio` | `asistio_flag` | Visible en admin         |
|---------------------|-----------|----------------|--------------------------|
| Marcar ✅           | true      | false          | ✅ Confirmado             |
| Desmarcar (error?)  | false     | **true**       | ⚠️ Revisión pendiente     |
| Admin limpia marca  | false     | false          | ○ No confirmado (limpio) |
| Re-marcar           | true      | false          | ✅ Confirmado             |
