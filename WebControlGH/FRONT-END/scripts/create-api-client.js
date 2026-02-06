import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Creating API client structure...\n');

const srcPath = path.join(__dirname, '../src');
const servicesPath = path.join(srcPath, 'services');
const apiPath = path.join(servicesPath, 'api');

// Crear carpetas
if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath, { recursive: true });
  console.log('✓ Created: src/services/api/');
}

// Crear cliente API base
const clientContent = `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

/**
 * Cliente HTTP centralizado para todas las llamadas a la API
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

/**
 * Interceptor para agregar token de autenticación a cada petición
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejo de errores global
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error de red
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Error de conexión. Verifica tu conexión a internet.',
        originalError: error
      });
    }

    // Error 401 - No autorizado
    if (error.response.status === 401) {
      console.warn('Unauthorized - redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Error 403 - Prohibido
    if (error.response.status === 403) {
      console.error('Forbidden - insufficient permissions');
      return Promise.reject({
        message: 'No tienes permisos para realizar esta acción.',
        status: 403,
        originalError: error
      });
    }

    // Error 404 - No encontrado
    if (error.response.status === 404) {
      return Promise.reject({
        message: 'Recurso no encontrado.',
        status: 404,
        originalError: error
      });
    }

    // Error 500 - Error del servidor
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'Error del servidor. Inténtalo de nuevo más tarde.',
        status: error.response.status,
        originalError: error
      });
    }

    // Otros errores
    return Promise.reject({
      message: error.response.data?.message || error.message,
      status: error.response.status,
      data: error.response.data,
      originalError: error
    });
  }
);

/**
 * Configurar el token de autenticación
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Obtener el token actual
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default apiClient;
`;

const clientPath = path.join(apiPath, 'client.js');
fs.writeFileSync(clientPath, clientContent);
console.log('✓ Created: src/services/api/client.js');

// Crear archivo de constantes de API
const constantsContent = `/**
 * Endpoints de la API
 * Centraliza todas las rutas de la API para facilitar mantenimiento
 */

export const API_ENDPOINTS = {
  // Obras
  OBRAS: '/obra',
  OBRA_BY_ID: (id) => \`/obra/\${id}\`,

  // Facturas
  FACTURAS: '/facturas',
  FACTURA_BY_ID: (id) => \`/facturas/\${id}\`,

  // Gastos
  GASTOS: '/gastos',
  GASTO_BY_ID: (id) => \`/gastos/\${id}\`,

  // Horas
  HORAS: '/horas',
  HORA_BY_ID: (id) => \`/horas/\${id}\`,

  // Pedidos
  PEDIDOS: '/ecoPedido',
  PEDIDO_BY_ID: (id) => \`/ecoPedido/\${id}\`,

  // Compras (ecoFactura)
  ECO_FACTURAS: '/ecoFactura',
  ECO_FACTURA_BY_ID: (id) => \`/ecoFactura/\${id}\`,

  // Almacén
  ALMACEN: '/almacen',
  MOVIMIENTOS_ALMACEN: '/movimientos-almacen',

  // Catálogos
  TIPO_OBRA: '/tipo-obra',
  TIPO_FACTURABLE: '/tipo-facturable',
  ESTADO_OBRA: '/estado-obra',
  RESPONSABLES: '/responsables',

  // Entidades
  EMPRESAS: '/empresa',
  EDIFICIOS: '/edificio',
  CONTACTOS: '/contacto',

  // Relaciones
  RELACION_OBRAS: '/relacion-obras',

  // Rentabilidad
  RENTABILIDAD: '/rentabilidad',

  // Autenticación
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Usuarios
  USUARIOS: '/usuario',
  USUARIO_BY_ID: (id) => \`/usuario/\${id}\`,
};

export default API_ENDPOINTS;
`;

const constantsPath = path.join(srcPath, 'constants', 'api.js');
if (!fs.existsSync(path.join(srcPath, 'constants'))) {
  fs.mkdirSync(path.join(srcPath, 'constants'), { recursive: true });
  console.log('✓ Created: src/constants/');
}
fs.writeFileSync(constantsPath, constantsContent);
console.log('✓ Created: src/constants/api.js');

// Crear archivo de ejemplo de servicio
const exampleServiceContent = `import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Servicio para gestión de obras
 * Ejemplo de cómo estructurar un servicio usando el cliente API
 */

export const obraService = {
  /**
   * Obtener todas las obras
   */
  getAll: async (params = {}) => {
    const { data } = await apiClient.get(API_ENDPOINTS.OBRAS, { params });
    return data;
  },

  /**
   * Obtener una obra por ID
   */
  getById: async (id) => {
    const { data } = await apiClient.get(API_ENDPOINTS.OBRA_BY_ID(id));
    return data;
  },

  /**
   * Crear una nueva obra
   */
  create: async (obraData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.OBRAS, obraData);
    return data;
  },

  /**
   * Actualizar una obra existente
   */
  update: async (id, obraData) => {
    const { data } = await apiClient.put(API_ENDPOINTS.OBRA_BY_ID(id), obraData);
    return data;
  },

  /**
   * Eliminar una obra
   */
  delete: async (id) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.OBRA_BY_ID(id));
    return data;
  },

  /**
   * Obtener obras con filtros específicos
   */
  getByFilters: async (filters) => {
    const { data } = await apiClient.post(\`\${API_ENDPOINTS.OBRAS}/filter\`, filters);
    return data;
  },
};

export default obraService;
`;

const exampleServicePath = path.join(apiPath, 'obra.service.example.js');
fs.writeFileSync(exampleServicePath, exampleServiceContent);
console.log('✓ Created: src/services/api/obra.service.example.js (example file)');

// Crear .env.example si no existe
const envExamplePath = path.join(__dirname, '../.env.example');
if (!fs.existsSync(envExamplePath)) {
  const envContent = `# API Configuration
REACT_APP_API_URL=http://localhost:3002/api

# Other configurations
# REACT_APP_ENV=development
`;
  fs.writeFileSync(envExamplePath, envContent);
  console.log('✓ Created: .env.example');
}

console.log('\n' + '═'.repeat(70));
console.log('✓ API client structure created successfully!\n');
console.log('📝 Next steps:\n');
console.log('  1. Create a .env file based on .env.example');
console.log('  2. Update existing services to use the new apiClient');
console.log('  3. Review the example service: src/services/api/obra.service.example.js');
console.log('  4. Update API_ENDPOINTS in src/constants/api.js as needed');
console.log('\n💡 Example usage:\n');
console.log('  import { apiClient } from \'./services/api/client\';');
console.log('  import { API_ENDPOINTS } from \'./constants/api\';\n');
console.log('  const obras = await apiClient.get(API_ENDPOINTS.OBRAS);');
console.log('═'.repeat(70));
