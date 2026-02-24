# Plan de Reorganización Gradual - WebControl ERP

## Resumen Ejecutivo

Este documento detalla el plan para reorganizar la estructura del proyecto WebControl ERP siguiendo los estándares de la industria para aplicaciones Full-Stack con React + Express + Node.js + SQL.

**Alcance del proyecto:**
- Frontend: 96 archivos JS/JSX
- Backend: 73 archivos JS/MJS
- Tiempo estimado: 4-6 semanas (trabajando de forma incremental)
- Riesgo: BAJO (migración gradual sin downtime)

---

## Fase 1: Preparación (Semana 1)

### Objetivo
Preparar el entorno y crear la nueva estructura sin afectar el código existente.

### 1.1 Crear branch de reorganización
```bash
git checkout -b refactor/project-structure
```

### 1.2 Crear archivo de configuración de rutas
Crear `FRONT-END/.eslintrc.json` y `BACK-END/.eslintrc.json` con reglas de nombrado consistentes.

### 1.3 Documentar imports actuales
Ejecutar script para mapear todas las dependencias entre módulos (proporcionado más adelante).

### 1.4 Crear nueva estructura de carpetas (COEXISTIENDO con la antigua)

#### Frontend - Nueva estructura:
```
FRONT-END/src/
├── app/                           # [NUEVO]
│   └── App.js (mover desde App/)
├── components/                    # [RENOMBRAR desde Components]
│   ├── ui/                       # [NUEVO]
│   │   └── Modal.jsx
│   └── layout/                   # [NUEVO]
│       └── Navbar/ (mover)
├── features/                      # [NUEVO - Principal cambio]
│   ├── almacen/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── auth/                     # (desde Login/)
│   ├── compras/                  # (desde Compra/)
│   ├── facturas/                 # (desde Factura/)
│   ├── gastos/                   # (desde Gastos/)
│   ├── horas/                    # (desde Horas/)
│   ├── obras/                    # (desde Obra/)
│   ├── pedidos/                  # (desde Pedido/)
│   └── rentabilidad/             # (desde Rentabilidad/)
├── services/                      # [MANTENER - Reorganizar]
│   ├── api/
│   │   └── client.js            # Cliente axios base
│   └── shared/                   # Servicios compartidos
├── hooks/                         # [NUEVO]
├── utils/                         # [NUEVO]
├── constants/                     # [NUEVO]
├── styles/                        # [RENOMBRAR desde css/]
│   └── global.css
├── index.js                       # [MANTENER]
└── reportWebVitals.js            # [MANTENER]
```

#### Backend - Nueva estructura:
```
BACK-END/src/
├── config/                        # [NUEVO]
│   ├── database.js               # (mover desde src/)
│   ├── env.js                    # [NUEVO]
│   └── constants.js              # [NUEVO]
├── controllers/                   # [MANTENER - Renombrar archivos]
│   ├── almacen.controller.js
│   ├── obra.controller.js
│   └── ...
├── services/                      # [NUEVO - CRÍTICO]
│   ├── almacen.service.js
│   ├── obra.service.js
│   └── ...
├── models/                        # [MANTENER - Renombrar archivos]
│   ├── almacen.model.js
│   ├── obra.model.js
│   └── ...
├── routes/                        # [MANTENER - Renombrar archivos]
│   ├── almacen.routes.js
│   ├── obra.routes.js
│   ├── index.js                  # [NUEVO] Centralizador de rutas
│   └── ...
├── middlewares/                   # [MANTENER]
│   ├── auth.middleware.js
│   ├── error-handler.middleware.js
│   └── validator.middleware.js
├── validations/                   # [MANTENER]
├── integrations/                  # [NUEVO]
│   └── factura-directa/          # (mover desde FacturaDirecta/)
│       ├── albaranes/
│       ├── contactos/
│       └── ...
├── utils/                         # [NUEVO]
├── types/                         # [NUEVO - Para futuro TS]
└── app.js                         # [RENOMBRAR desde app.mjs]

BACK-END/
├── tests/                         # [MOVER desde src/test]
│   ├── http/                     # [MOVER desde src/Peticiones]
│   │   └── *.http
│   └── unit/                     # [NUEVO]
├── .env                          # [MANTENER]
├── .env.example                  # [NUEVO]
└── package.json
```

### 1.5 Crear scripts de migración
- Script para renombrar archivos con convención consistente
- Script para actualizar imports automáticamente
- Script para validar que no hay imports rotos

### Entregables Fase 1:
- ✅ Branch nueva creada
- ✅ Estructura de carpetas vacía creada
- ✅ Scripts de migración listos
- ✅ Documentación de dependencias

---

## Fase 2: Backend - Migración de Configuración y Utilities (Semana 2)

### Objetivo
Mover elementos que no tienen dependencias complejas.

### 2.1 Crear capa de configuración

**Archivo: `BACK-END/src/config/database.js`**
```javascript
// Mover contenido de database.js actual aquí
// Mejorar con manejo de errores y retry logic
```

**Archivo: `BACK-END/src/config/env.js`**
```javascript
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  }
};
```

### 2.2 Mover FacturaDirecta a integrations
```bash
mv BACK-END/src/FacturaDirecta BACK-END/src/integrations/factura-directa
```

### 2.3 Mover Peticiones a tests
```bash
mkdir -p BACK-END/tests/http
mv BACK-END/src/Peticiones/*.http BACK-END/tests/http/
```

### 2.4 Eliminar archivos incorrectos
```bash
# Los logos no deben estar en el backend
rm BACK-END/src/logo.svg
rm BACK-END/src/logoControlCube.jpeg
# Moverlos a FRONT-END/public/assets/ si son necesarios
```

### 2.5 Actualizar app.js
- Cambiar imports a usar `config/`
- Importar desde `routes/index.js` en lugar de rutas individuales

### Entregables Fase 2:
- ✅ Configuración centralizada en `config/`
- ✅ FacturaDirecta movida a `integrations/`
- ✅ Archivos de prueba en `tests/`
- ✅ Backend funcional con nueva estructura parcial

---

## Fase 3: Backend - Creación de Service Layer (Semana 3)

### Objetivo
Extraer lógica de negocio de controllers a services.

### 3.1 Patrón para cada módulo

**Antes (Controller con lógica):**
```javascript
// controllers/ObraController.mjs
export const getObra = async (req, res) => {
  try {
    const { id } = req.params;
    // Lógica de negocio aquí (MAL)
    const [rows] = await pool.query('SELECT * FROM obras WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Después (Separado en capas):**
```javascript
// services/obra.service.js
import { ObraModel } from '../models/obra.model.js';

export class ObraService {
  async getObraById(id) {
    const obra = await ObraModel.findById(id);
    if (!obra) {
      throw new Error('Obra no encontrada');
    }
    return obra;
  }
}

// controllers/obra.controller.js
import { ObraService } from '../services/obra.service.js';

const obraService = new ObraService();

export const getObra = async (req, res, next) => {
  try {
    const obra = await obraService.getObraById(req.params.id);
    res.json(obra);
  } catch (error) {
    next(error); // Delegar al middleware de errores
  }
};

// models/obra.model.js
import { pool } from '../config/database.js';

export class ObraModel {
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM obras WHERE id = ?', [id]);
    return rows[0] || null;
  }
}
```

### 3.2 Orden de migración (del menos al más complejo)

1. **Módulos simples** (sin relaciones complejas):
   - estadoObra
   - tipoObra
   - tipoFacturable
   - usuario

2. **Módulos intermedios**:
   - almacen
   - contacto
   - edificio
   - empresa
   - responsables

3. **Módulos complejos** (muchas relaciones):
   - obra
   - facturas
   - gastos
   - horas
   - pedidos
   - rentabilidad

### 3.3 Renombrar archivos con convención consistente

Crear script `BACK-END/scripts/rename-files.js`:
```javascript
// Script que renombra:
// - ObraController.mjs → obra.controller.js
// - obraRoutes.mjs → obra.routes.js
// - ObraModel.mjs → obra.model.js
// Y actualiza todos los imports
```

### 3.4 Crear centralizador de rutas

**Archivo: `BACK-END/src/routes/index.js`**
```javascript
import express from 'express';
import almacenRouter from './almacen.routes.js';
import obraRouter from './obra.routes.js';
// ... importar todas las rutas

const router = express.Router();

router.use('/almacen', almacenRouter);
router.use('/obra', obraRouter);
// ... registrar todas las rutas

export default router;
```

**Actualizar `app.js`:**
```javascript
import routes from './routes/index.js';
app.use('/api', routes);
```

### 3.5 Crear middleware de manejo de errores global

**Archivo: `BACK-END/src/middlewares/error-handler.middleware.js`**
```javascript
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'Obra no encontrada') {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};
```

### Entregables Fase 3:
- ✅ Service layer creado para todos los módulos
- ✅ Controllers simplificados (solo manejo HTTP)
- ✅ Models enfocados solo en acceso a datos
- ✅ Archivos renombrados consistentemente
- ✅ Middleware de errores global
- ✅ Backend 100% funcional con nueva arquitectura

---

## Fase 4: Frontend - Migración de Services y Utils (Semana 4)

### Objetivo
Reorganizar servicios y crear utilities compartidas.

### 4.1 Crear cliente API base

**Archivo: `FRONT-END/src/services/api/client.js`**
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4.2 Refactorizar servicios para usar apiClient

**Antes:**
```javascript
// Services/obraService.js
import axios from 'axios';

export const getObras = async () => {
  const response = await axios.get('http://localhost:3002/api/obra');
  return response.data;
};
```

**Después:**
```javascript
// features/obras/services/obra.service.js
import { apiClient } from '../../../services/api/client';

export const obraService = {
  getAll: async () => {
    const { data } = await apiClient.get('/obra');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/obra/${id}`);
    return data;
  },

  create: async (obraData) => {
    const { data } = await apiClient.post('/obra', obraData);
    return data;
  },

  update: async (id, obraData) => {
    const { data } = await apiClient.put(`/obra/${id}`, obraData);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/obra/${id}`);
    return data;
  },
};
```

### 4.3 Crear barrel exports

**Archivo: `FRONT-END/src/features/obras/index.js`**
```javascript
// Exportar todo desde un solo lugar
export * from './services/obra.service';
export * from './hooks/useObras';
export * from './components/ObrasList';
export * from './components/ObraForm';
```

### 4.4 Crear carpeta de constantes

**Archivo: `FRONT-END/src/constants/routes.js`**
```javascript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  OBRAS: '/obras',
  OBRA_DETAIL: '/obras/:id',
  FACTURAS: '/facturas',
  // ...
};
```

**Archivo: `FRONT-END/src/constants/api.js`**
```javascript
export const API_ENDPOINTS = {
  OBRAS: '/obra',
  FACTURAS: '/facturas',
  GASTOS: '/gastos',
  // ...
};
```

### Entregables Fase 4:
- ✅ Cliente API centralizado
- ✅ Servicios refactorizados usando apiClient
- ✅ Constantes organizadas
- ✅ Barrel exports creados

---

## Fase 5: Frontend - Migración Feature by Feature (Semanas 5-6)

### Objetivo
Migrar módulos a estructura feature-based, de menos a más complejo.

### 5.1 Orden de migración

**Primera ola (Semana 5):**
1. **auth** (desde Login/)
2. **empresas** (desde Empresas/)
3. **almacen** (desde Almacen/)
4. **gastos** (desde Gastos/)
5. **horas** (desde Horas/)

**Segunda ola (Semana 6):**
6. **compras** (desde Compra/)
7. **pedidos** (desde Pedido/)
8. **facturas** (desde Factura/)
9. **rentabilidad** (desde Rentabilidad/)
10. **obras** (desde Obra/) - El más complejo

### 5.2 Template para cada feature

```
features/[nombre]/
├── components/              # Componentes específicos del feature
│   ├── [Nombre]List.jsx
│   ├── [Nombre]Form.jsx
│   ├── [Nombre]Detail.jsx
│   └── [Nombre]Card.jsx
├── hooks/                   # Custom hooks
│   ├── use[Nombre].js
│   └── use[Nombre]Form.js
├── services/                # API calls
│   └── [nombre].service.js
├── utils/                   # Utilidades específicas
│   └── [nombre].utils.js
├── constants/               # Constantes específicas
│   └── [nombre].constants.js
└── index.js                 # Barrel export
```

### 5.3 Ejemplo completo: Migración de "Horas"

#### Paso 1: Crear estructura
```bash
mkdir -p FRONT-END/src/features/horas/{components,hooks,services,utils}
```

#### Paso 2: Mover y adaptar servicio
```javascript
// features/horas/services/hora.service.js
import { apiClient } from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../constants/api';

export const horaService = {
  getAll: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.HORAS);
    return data;
  },
  // ... resto de métodos
};
```

#### Paso 3: Crear custom hook
```javascript
// features/horas/hooks/useHoras.js
import { useState, useEffect } from 'react';
import { horaService } from '../services/hora.service';

export const useHoras = () => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoras = async () => {
      try {
        const data = await horaService.getAll();
        setHoras(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHoras();
  }, []);

  return { horas, loading, error };
};
```

#### Paso 4: Mover componentes
```javascript
// features/horas/components/HorasList.jsx
import React from 'react';
import { useHoras } from '../hooks/useHoras';

export const HorasList = () => {
  const { horas, loading, error } = useHoras();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {horas.map(hora => (
        <div key={hora.id}>{hora.descripcion}</div>
      ))}
    </div>
  );
};
```

#### Paso 5: Barrel export
```javascript
// features/horas/index.js
export * from './services/hora.service';
export * from './hooks/useHoras';
export * from './components/HorasList';
export * from './components/HoraForm';
```

#### Paso 6: Actualizar imports en App.js
```javascript
// Antes
import HorasList from './Horas/HorasList';

// Después
import { HorasList } from './features/horas';
```

### 5.4 Manejo especial para "Obra" (el más complejo)

Obra tiene subcarpetas (CrearObra, DetalleObra, GestionObras, Hooks, Utils):

```
features/obras/
├── components/
│   ├── ObraList.jsx           # (desde GestionObras/)
│   ├── ObraForm.jsx           # (desde CrearObra/)
│   ├── ObraDetail.jsx         # (desde DetalleObra/)
│   ├── ObraPrint.jsx          # (desde ImprimirObra/)
│   └── shared/                # Componentes compartidos
├── hooks/                      # (desde Obra/Hooks/)
│   ├── useObras.js
│   ├── useObraForm.js
│   └── useObraDetail.js
├── services/
│   ├── obra.service.js
│   ├── edificio.service.js
│   ├── contacto.service.js
│   └── tipoObra.service.js
├── utils/                      # (desde Obra/Utils/)
│   ├── obra.utils.js
│   └── validation.utils.js
└── index.js
```

### 5.5 Componentes compartidos (UI)

Mover componentes reutilizables a `components/ui/`:

```
components/
├── ui/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Modal.jsx
│   ├── Table.jsx
│   ├── Card.jsx
│   └── index.js
└── layout/
    ├── Navbar.jsx
    ├── Sidebar.jsx
    ├── Footer.jsx
    └── index.js
```

### 5.6 Actualizar rutas en App.js

**Antes:**
```javascript
import Obras from './Obra/GestionObras/ObrasList';
import CrearObra from './Obra/CrearObra/ObraForm';
import DetalleObra from './Obra/DetalleObra/ObraDetail';
```

**Después:**
```javascript
import { ObraList, ObraForm, ObraDetail } from './features/obras';
```

### Entregables Fase 5:
- ✅ Todos los módulos migrados a `features/`
- ✅ Custom hooks creados
- ✅ Componentes UI reutilizables separados
- ✅ Imports actualizados en App.js
- ✅ Frontend 100% funcional con nueva estructura

---

## Fase 6: Limpieza y Optimización (Final)

### Objetivo
Eliminar código viejo y optimizar la estructura.

### 6.1 Eliminar carpetas viejas
```bash
# Frontend
rm -rf FRONT-END/src/Almacen
rm -rf FRONT-END/src/Compra
rm -rf FRONT-END/src/Factura
rm -rf FRONT-END/src/Gastos
rm -rf FRONT-END/src/Horas
rm -rf FRONT-END/src/Login
rm -rf FRONT-END/src/Modulos
rm -rf FRONT-END/src/Obra
rm -rf FRONT-END/src/Pedido
rm -rf FRONT-END/src/Rentabilidad
rm -rf FRONT-END/src/Empresas
rmdir FRONT-END/src/App  # Solo si está vacía
rm -rf FRONT-END/src/css  # Contenido ya movido a styles/

# Backend
# Ya limpiado en fases anteriores
```

### 6.2 Actualizar .gitignore

Agregar:
```
# Environment variables
.env
.env.local
.env.*.local

# Build
dist/
build/

# Tests
coverage/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

### 6.3 Crear .env.example

**FRONT-END/.env.example:**
```
REACT_APP_API_URL=http://localhost:3002/api
```

**BACK-END/.env.example:**
```
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=webcontrol
JWT_SECRET=your-secret-key
```

### 6.4 Actualizar documentación

Crear `README.md` en cada carpeta principal explicando la estructura.

### 6.5 Configurar path aliases (opcional pero recomendado)

**FRONT-END/jsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@components/*": ["components/*"],
      "@features/*": ["features/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@hooks/*": ["hooks/*"],
      "@constants/*": ["constants/*"]
    }
  }
}
```

Después puedes hacer:
```javascript
// Antes
import { obraService } from '../../../features/obras/services/obra.service';

// Después
import { obraService } from '@features/obras';
```

### 6.6 Testing

Escribir tests para las capas críticas:
- Services (backend)
- API calls (frontend)
- Custom hooks (frontend)

### 6.7 Commit final y merge
```bash
git add .
git commit -m "refactor: reorganize project structure following industry standards

- Implement feature-based architecture in frontend
- Add service layer in backend
- Standardize file naming conventions
- Centralize configuration
- Improve code organization and maintainability"

git push origin refactor/project-structure
# Crear PR y merge a main
```

### Entregables Fase 6:
- ✅ Código viejo eliminado
- ✅ Documentación actualizada
- ✅ Path aliases configurados
- ✅ Tests básicos implementados
- ✅ Cambios mergeados a main

---

## Scripts de Automatización

### Script 1: Renombrar archivos Backend

**BACK-END/scripts/rename-backend-files.js:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const renameRules = {
  controllers: [
    { from: 'ObraController.mjs', to: 'obra.controller.js' },
    { from: 'almacenController.mjs', to: 'almacen.controller.js' },
    { from: 'FacturasController.mjs', to: 'factura.controller.js' },
    // ... agregar todos
  ],
  models: [
    { from: 'ObraModel.mjs', to: 'obra.model.js' },
    { from: 'almacenModel.mjs', to: 'almacen.model.js' },
    { from: 'Facturas.mjs', to: 'factura.model.js' },
    // ... agregar todos
  ],
  routes: [
    { from: 'obraRoutes.mjs', to: 'obra.routes.js' },
    { from: 'almacenRoutes.mjs', to: 'almacen.routes.js' },
    { from: 'FacturasRouter.mjs', to: 'factura.routes.js' },
    // ... agregar todos
  ]
};

const srcPath = path.join(__dirname, '../src');

Object.entries(renameRules).forEach(([folder, rules]) => {
  rules.forEach(({ from, to }) => {
    const oldPath = path.join(srcPath, folder, from);
    const newPath = path.join(srcPath, folder, to);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ Renamed: ${folder}/${from} → ${to}`);
    }
  });
});

console.log('✓ All files renamed successfully!');
```

### Script 2: Actualizar imports automáticamente

**BACK-END/scripts/update-imports.js:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const importReplacements = [
  { from: './ObraController.mjs', to: './obra.controller.js' },
  { from: './almacenController.mjs', to: './almacen.controller.js' },
  // ... agregar todos
];

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  importReplacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from, 'g'), to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated imports in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      updateImportsInFile(filePath);
    }
  });
}

const srcPath = path.join(__dirname, '../src');
walkDir(srcPath);

console.log('✓ All imports updated successfully!');
```

### Script 3: Validar imports

**BACK-END/scripts/validate-imports.js:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const errors = [];

function validateImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /from ['"](\.[^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const resolvedPath = path.resolve(path.dirname(filePath), importPath);

    // Intentar con diferentes extensiones
    const possiblePaths = [
      resolvedPath,
      resolvedPath + '.js',
      resolvedPath + '.mjs',
      path.join(resolvedPath, 'index.js'),
    ];

    const exists = possiblePaths.some(p => fs.existsSync(p));

    if (!exists) {
      errors.push({
        file: filePath,
        import: importPath,
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      validateImportsInFile(filePath);
    }
  });
}

const srcPath = path.join(__dirname, '../src');
walkDir(srcPath);

if (errors.length > 0) {
  console.error('❌ Found broken imports:');
  errors.forEach(err => {
    console.error(`  ${err.file}:${err.line} - "${err.import}"`);
  });
  process.exit(1);
} else {
  console.log('✓ All imports are valid!');
}
```

### Script 4: Migrar feature Frontend

**FRONT-END/scripts/migrate-feature.js:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Uso: node scripts/migrate-feature.js Horas horas
const [oldFolder, newFeatureName] = process.argv.slice(2);

if (!oldFolder || !newFeatureName) {
  console.error('Usage: node migrate-feature.js <OldFolder> <newFeatureName>');
  console.error('Example: node migrate-feature.js Horas horas');
  process.exit(1);
}

const srcPath = path.join(__dirname, '../src');
const oldPath = path.join(srcPath, oldFolder);
const newPath = path.join(srcPath, 'features', newFeatureName);

if (!fs.existsSync(oldPath)) {
  console.error(`Error: Folder ${oldPath} does not exist`);
  process.exit(1);
}

// Crear estructura
fs.mkdirSync(path.join(newPath, 'components'), { recursive: true });
fs.mkdirSync(path.join(newPath, 'hooks'), { recursive: true });
fs.mkdirSync(path.join(newPath, 'services'), { recursive: true });
fs.mkdirSync(path.join(newPath, 'utils'), { recursive: true });

// Mover archivos (lógica básica, necesita personalización)
console.log(`Migrating ${oldFolder} to features/${newFeatureName}...`);
console.log('Please review and move files manually, then update imports.');
console.log('Structure created at:', newPath);
```

---

## Checklist por Fase

### Fase 1: Preparación
- [ ] Branch creada: `refactor/project-structure`
- [ ] Estructura de carpetas nueva creada (vacía)
- [ ] Scripts de migración creados
- [ ] Dependencias documentadas
- [ ] Equipo informado del plan

### Fase 2: Backend Config
- [ ] `config/` creado con database.js y env.js
- [ ] FacturaDirecta movida a `integrations/`
- [ ] Peticiones movidas a `tests/http/`
- [ ] Logos eliminados del backend
- [ ] app.js actualizado
- [ ] Tests ejecutados y pasando

### Fase 3: Backend Service Layer
- [ ] Service layer creado para todos los módulos
- [ ] Controllers refactorizados
- [ ] Models refactorizados
- [ ] Archivos renombrados consistentemente
- [ ] Middleware de errores implementado
- [ ] Centralizador de rutas creado
- [ ] Tests ejecutados y pasando

### Fase 4: Frontend Services
- [ ] Cliente API creado
- [ ] Servicios refactorizados para usar apiClient
- [ ] Constantes organizadas
- [ ] Barrel exports creados
- [ ] Tests ejecutados y pasando

### Fase 5: Frontend Features
- [ ] auth migrado
- [ ] empresas migrado
- [ ] almacen migrado
- [ ] gastos migrado
- [ ] horas migrado
- [ ] compras migrado
- [ ] pedidos migrado
- [ ] facturas migrado
- [ ] rentabilidad migrado
- [ ] obras migrado (el más complejo)
- [ ] Componentes UI separados
- [ ] App.js actualizado
- [ ] Tests ejecutados y pasando

### Fase 6: Limpieza
- [ ] Carpetas viejas eliminadas
- [ ] .gitignore actualizado
- [ ] .env.example creados
- [ ] Path aliases configurados
- [ ] Documentación actualizada
- [ ] Tests finales ejecutados
- [ ] PR creado y revisado
- [ ] Merge a main

---

## Estrategia de Testing Durante la Migración

### Backend
1. Mantener servidor corriendo durante migración
2. Probar cada endpoint después de mover su módulo
3. Usar archivos `.http` en `tests/` para validar

### Frontend
1. Mantener aplicación corriendo en modo desarrollo
2. Probar cada feature después de migrarlo
3. Verificar que no hay errores en consola

### Rollback Plan
- Si algo falla, el código viejo sigue en el mismo branch
- Podemos revertir commits específicos
- La migración es gradual, no big bang

---

## Mejores Prácticas Durante la Migración

1. **Commits pequeños y frecuentes**
   - Un commit por módulo migrado
   - Mensajes descriptivos

2. **No mezclar refactoring con features nuevas**
   - Solo reorganizar, no agregar funcionalidad

3. **Mantener tests pasando**
   - Si no hay tests, crear tests básicos primero

4. **Actualizar documentación en paralelo**
   - No dejar para el final

5. **Comunicación con el equipo**
   - Avisar qué módulos se están migrando
   - Coordinar para evitar conflictos

---

## Comandos Útiles

### Crear carpetas de estructura nueva
```bash
# Frontend
cd FRONT-END/src
mkdir -p app components/{ui,layout} features hooks utils constants styles services/api

# Backend
cd BACK-END/src
mkdir -p config controllers services models routes middlewares validations integrations utils
```

### Ejecutar scripts de migración
```bash
# Backend
cd BACK-END
node scripts/rename-backend-files.js
node scripts/update-imports.js
node scripts/validate-imports.js

# Frontend
cd FRONT-END
node scripts/migrate-feature.js Horas horas
```

### Validar que todo funciona
```bash
# Backend
cd BACK-END
npm run dev

# Frontend
cd FRONT-END
npm start
```

---

## Contacto y Soporte

Si tienes dudas durante la migración:
1. Revisar este documento
2. Consultar los scripts de automatización
3. Hacer pruebas en un branch separado primero

---

**Última actualización:** 2026-02-06
**Versión:** 1.0
**Autor:** Claude Code Assistant
