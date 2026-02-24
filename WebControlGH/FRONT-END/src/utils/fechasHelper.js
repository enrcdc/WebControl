// UTIL PARA RESOLVER EL PROBLEMA DE DISMINUCIÓN DE UN DÍA CADA VEZ QUE SE REGISTRA/MODIFICA UNA FECHA

export const normalizarFecha = (fechaISO) => {
  if (!fechaISO) return null;
  const fecha = new Date(fechaISO);

  const anio = fecha.getFullYear();
  // Sumamos 1 al mes porque van de 0 a 11, y rellenamos con 0 a la izquierda
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

export const formatearFechaLocal = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES");
};

export const fechaHoyFormateada = () => {
  return new Date().toLocaleDateString("en-CA").split("T")[0];
};
