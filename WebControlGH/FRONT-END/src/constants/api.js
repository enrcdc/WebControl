/**
 * Endpoints del backend.
 * Centralizados aquí para que si un endpoint cambia,
 * solo se modifique este archivo.
 */
export const API_ENDPOINTS = {
  // Autenticación
  AUTH_LOGIN: "/auth/login",

  // Entidades principales
  OBRA: "/obra",
  FACTURA_OBRA: "/facturaObra",
  PEDIDO_OBRA: "/pedidoObra",
  GASTOS: "/gastos",
  HORAS: "/horas",

  // Facturas de compra
  FACTURA_COMPRA: "/facturaCompra",

  // Almacén
  ALMACEN: "/almacen",
  MOVIMIENTOS_ALMACEN: "/movimientos-almacen",

  // Catálogos
  TIPO_OBRA: "/tipo-obra",
  TIPO_FACTURABLE: "/tipo-facturable",
  TIPO_FACTURA: "/tipo-factura",
  ESTADO_OBRA: "/estado-obra",
  RESPONSABLES: "/responsables",

  // Entidades de negocio
  EMPRESA: "/empresa",
  EDIFICIO: "/edificio",
  CONTACTO: "/contacto",
  PROVEEDOR: "/proveedor",

  // Relaciones
  RELACION_OBRAS: "/relacion-obras",

  // Reportes
  RENTABILIDAD: "/rentabilidad",

  // Usuarios
  USUARIO: "/usuario",
};
