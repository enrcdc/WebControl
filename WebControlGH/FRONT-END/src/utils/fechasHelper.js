// UTIL PARA RESOLVER EL PROBLEMA DE DISMINUCIÓN DE UN DÍA CADA VEZ QUE SE REGISTRA/MODIFICA UNA FECHA

export const normalizarFecha = (fechaISO) => {
  if (!fechaISO) return null;
  const fecha = new Date(fechaISO);
  return fecha.toISOString().split("T")[0];
};

export const formatearFechaLocal = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES");
};
