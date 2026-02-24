# Guía Rápida - Reorganización del Proyecto

Esta guía proporciona comandos rápidos para ejecutar el plan de reorganización.

## 📋 Documentos del Plan

- **`PLAN_REORGANIZACION.md`** - Plan completo detallado con todas las fases
- **`QUICKSTART_REORGANIZACION.md`** - Esta guía rápida (comandos esenciales)

---

## 🚀 Inicio Rápido

### 1. Crear branch de trabajo

```bash
git checkout -b refactor/project-structure
```

### 2. Backend - Renombrar archivos

```bash
cd BACK-END

# Renombrar archivos a convención consistente
node scripts/rename-backend-files.js

# Actualizar imports automáticamente
node scripts/update-imports.js

# Validar que no hay imports rotos
node scripts/validate-imports.js

# Probar que el backend sigue funcionando
npm run dev
```

### 3. Frontend - Crear cliente API

```bash
cd FRONT-END

# Crear estructura de cliente API centralizado
node scripts/create-api-client.js

# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tu configuración
# REACT_APP_API_URL=http://localhost:3002/api
```

### 4. Frontend - Migrar features (uno por uno)

```bash
cd FRONT-END

# Ver ayuda
node scripts/migrate-feature.js --help

# Ejemplo: Migrar Horas
node scripts/migrate-feature.js Horas horas

# El script crea la estructura y te da comandos para mover archivos
# Ejecuta los comandos sugeridos, luego actualiza imports

# Repetir para cada módulo:
# node scripts/migrate-feature.js Login auth
# node scripts/migrate-feature.js Empresas empresas
# node scripts/migrate-feature.js Almacen almacen
# node scripts/migrate-feature.js Gastos gastos
# node scripts/migrate-feature.js Compra compras
# node scripts/migrate-feature.js Pedido pedidos
# node scripts/migrate-feature.js Factura facturas
# node scripts/migrate-feature.js Rentabilidad rentabilidad
# node scripts/migrate-feature.js Obra obras
```

---

## 📂 Estructura Final Esperada

### Backend

```
BACK-END/
├── src/
│   ├── config/           ← Nueva
│   ├── controllers/      ← Renombrados: obra.controller.js
│   ├── services/         ← Nueva (lógica de negocio)
│   ├── models/           ← Renombrados: obra.model.js
│   ├── routes/           ← Renombrados: obra.routes.js
│   │   └── index.js      ← Nueva (centralizador)
│   ├── middlewares/
│   ├── validations/
│   ├── integrations/     ← FacturaDirecta movido aquí
│   ├── utils/            ← Nueva
│   └── app.js
├── tests/                ← Nueva
│   └── http/             ← Peticiones movidas aquí
└── scripts/              ← Scripts de migración
```

### Frontend

```
FRONT-END/
├── src/
│   ├── app/              ← Nueva
│   │   └── App.js
│   ├── components/       ← Componentes reutilizables
│   │   ├── ui/
│   │   └── layout/
│   ├── features/         ← Nueva (principal cambio)
│   │   ├── obras/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── index.js
│   │   ├── facturas/
│   │   ├── gastos/
│   │   └── ...
│   ├── services/         ← API client base
│   │   └── api/
│   │       └── client.js
│   ├── hooks/            ← Nueva (hooks globales)
│   ├── utils/            ← Nueva (utils globales)
│   ├── constants/        ← Nueva
│   │   ├── api.js
│   │   └── routes.js
│   └── styles/           ← Renombrada desde css/
└── scripts/              ← Scripts de migración
```

---

## ✅ Checklist Rápido

### Fase 1: Preparación
- [ ] Branch creada
- [ ] Scripts de migración creados
- [ ] Plan leído y entendido

### Fase 2-3: Backend
- [ ] Archivos renombrados (rename-backend-files.js)
- [ ] Imports actualizados (update-imports.js)
- [ ] Imports validados (validate-imports.js)
- [ ] Backend funcional después de cambios
- [ ] Crear `config/` y mover database.js
- [ ] Crear service layer (gradualmente)
- [ ] Mover FacturaDirecta a `integrations/`
- [ ] Mover Peticiones a `tests/http/`

### Fase 4-5: Frontend
- [ ] Cliente API creado (create-api-client.js)
- [ ] .env configurado
- [ ] auth migrado
- [ ] empresas migrado
- [ ] almacen migrado
- [ ] gastos migrado
- [ ] horas migrado
- [ ] compras migrado
- [ ] pedidos migrado
- [ ] facturas migrado
- [ ] rentabilidad migrado
- [ ] obras migrado
- [ ] App.js actualizado con nuevos imports
- [ ] Frontend funcional

### Fase 6: Limpieza
- [ ] Carpetas viejas eliminadas
- [ ] .gitignore actualizado
- [ ] .env.example creados
- [ ] Documentación actualizada
- [ ] Tests ejecutados
- [ ] Commit y merge

---

## 🛠 Scripts Disponibles

### Backend

| Script | Descripción |
|--------|-------------|
| `rename-backend-files.js` | Renombra controllers, models y routes a convención consistente |
| `update-imports.js` | Actualiza todos los imports después del renombrado |
| `validate-imports.js` | Valida que no hay imports rotos |

### Frontend

| Script | Descripción |
|--------|-------------|
| `migrate-feature.js` | Crea estructura para un feature y analiza archivos |
| `create-api-client.js` | Crea cliente API centralizado y constantes |

---

## 🔄 Orden de Migración Recomendado

### Backend (Semanas 2-3)
1. Renombrar todos los archivos de una vez
2. Crear service layer módulo por módulo (simple → complejo)
3. Mover configuración a `config/`
4. Mover integraciones a `integrations/`

### Frontend (Semanas 4-6)
**Primera ola (más simples):**
1. auth
2. empresas
3. almacen
4. gastos
5. horas

**Segunda ola (más complejos):**
6. compras
7. pedidos
8. facturas
9. rentabilidad
10. obras (el más complejo - al final)

---

## 🧪 Testing Durante Migración

### Después de cada cambio en Backend:
```bash
cd BACK-END
npm run dev
# Probar endpoints con archivos .http en tests/http/
```

### Después de cada feature migrado en Frontend:
```bash
cd FRONT-END
npm start
# Navegar a la sección migrada y probar funcionalidad
# Verificar que no hay errores en consola del navegador
```

---

## 🆘 Solución de Problemas

### "Imports rotos después de renombrar"
```bash
cd BACK-END
node scripts/update-imports.js
node scripts/validate-imports.js
```

### "Frontend no encuentra módulo"
- Verifica que el barrel export (`index.js`) está creado en el feature
- Verifica la ruta del import en App.js
- Reinicia el servidor de desarrollo (`npm start`)

### "Backend no arranca"
- Verifica que database.js tiene la configuración correcta
- Verifica que todos los imports en app.js están actualizados
- Revisa errores específicos en la consola

---

## 💡 Mejores Prácticas

1. **Commits frecuentes**: Haz commit después de cada módulo migrado
2. **Tests continuos**: Prueba que todo funciona después de cada cambio
3. **No mezclar**: No agregues features nuevas durante la reorganización
4. **Documentar**: Actualiza documentación mientras migras
5. **Comunicar**: Si trabajas en equipo, coordina qué estás migrando

---

## 📝 Formato de Commits Recomendado

```bash
# Fase 2-3: Backend
git commit -m "refactor(backend): rename files to consistent convention"
git commit -m "refactor(backend): create service layer for obras module"
git commit -m "refactor(backend): move FacturaDirecta to integrations"

# Fase 4-5: Frontend
git commit -m "refactor(frontend): create centralized API client"
git commit -m "refactor(frontend): migrate horas to feature-based structure"
git commit -m "refactor(frontend): migrate obras to feature-based structure"

# Fase 6: Limpieza
git commit -m "refactor: remove old folder structure"
git commit -m "docs: update project documentation"
```

---

## 🎯 Siguiente Paso

**¡Empieza aquí!**

```bash
# 1. Crear branch
git checkout -b refactor/project-structure

# 2. Backend - Renombrar archivos
cd BACK-END
node scripts/rename-backend-files.js
node scripts/update-imports.js
node scripts/validate-imports.js
npm run dev  # Verificar que funciona

# 3. Si todo va bien, commit
git add .
git commit -m "refactor(backend): rename files to consistent convention"
```

Luego continúa con el **PLAN_REORGANIZACION.md** para el proceso completo.

---

**¿Dudas?** Consulta el plan completo en `PLAN_REORGANIZACION.md`
