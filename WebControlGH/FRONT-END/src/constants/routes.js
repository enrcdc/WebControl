/**
 * Rutas del React Router.
 * Centralizadas aquí para evitar strings sueltos en App.js y componentes.
 */
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/home",

  // Obras
  GESTION_OBRAS: "gestion-obras",
  DETALLE_OBRA: "gestion-obras/detalle/:idObra",
  NUEVA_OBRA: "nuevo-obra",
  IMPRIMIR_OBRA: "imprimir-obra",

  // Facturas de obra
  GESTION_FACTURAS: "gestion-facturas",
  DETALLE_FACTURA: "gestion-facturas/detalle/:cod",
  NUEVA_FACTURA: "nueva-factura",
  IMPRIMIR_FACTURA: "imprimir-factura",

  // Pedidos
  GESTION_PEDIDOS: "gestion-pedidos",
  DETALLE_PEDIDO: "gestion-pedidos/detalle/:id",
  NUEVO_PEDIDO: "nuevo-pedido",
  IMPRIMIR_PEDIDO: "imprimir-pedido",

  // Compras
  GESTION_COMPRAS: "gestion-compras",
  DETALLE_COMPRA: "gestion-compras/detalle/:numero",
  NUEVA_COMPRA: "nueva-compra",

  // Horas
  REGISTRO_HORAS: "registro-horas",
  DETALLE_HORA: "registro-horas/detalle/:idUsuario",
  NUEVA_HORA: "nueva-hora",

  // Gastos
  GASTOS_OBRAS: "gastos-obras",

  // Almacén
  GESTION_ALMACEN: "gestion-almacen",

  // Rentabilidad
  RENTABILIDAD: "profitability",
};
