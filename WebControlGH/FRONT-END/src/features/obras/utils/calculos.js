// UTILIDAD PARA LOS CÁLCULOS

export const calcularTotales = {
  importeGastos: (gastos) =>
    gastos.reduce((acc, gasto) => acc + gasto.cantidad * gasto.importe, 0),

  horas: (horas) => horas.reduce((acc, hora) => acc + hora.num_horas, 0),

  importeHoras: (horas) =>
    horas.reduce((acc, hora) => acc + hora.num_horas * hora.precio_hora, 0),

  horasExtra: (horas) => horas.reduce((acc, hora) => acc + hora.cantidad, 0),

  importeHorasExtra: (horas) =>
    horas.reduce((acc, hora) => acc + hora.cantidad * hora.importe, 0),

  importePedidos: (pedidos) =>
    pedidos.reduce((acc, pedido) => acc + pedido.importe, 0),

  importeFacturas: (facturas) =>
    facturas.reduce((acc, factura) => acc + factura.importe, 0),

  importeMovimientosAlmacen: (movimientos) =>
    movimientos.reduce((acc, mov) => acc + mov.cantidad * mov.importe, 0),

  importeCompras: (compras) =>
    compras.reduce((acc, compra) => acc + compra.importe, 0),

  horasPrevistasSubordinadas: (obras) =>
    obras.reduce((acc, obra) => acc + obra.horas_previstas, 0),

  importeObrasSubordinadas: (obras) =>
    obras.reduce((acc, obra) => acc + obra.importe, 0),

  gastosPrevistosSubordinadas: (obras) =>
    obras.reduce((acc, obra) => acc + obra.gasto_previsto, 0),
};

export const calcularGastoTotal = (
  importeHoras,
  importeGastos,
  importeHorasExtra,
  importeMovimientosAlmacen,
  importeCompras
) => {
  return (
    importeHoras +
    importeGastos +
    importeHorasExtra +
    importeMovimientosAlmacen +
    importeCompras
  );
};

export const calcularRentabilidad = (importe, gastoTotal) => {
  return importe - gastoTotal;
};

export const calcularPorcentajeRentabilidad = (importe, gastoTotal) => {
  if (importe === 0) return 0;
  return ((importe - gastoTotal) * 100) / importe;
};

export const calcularPorcentajePedido = (totalPedidos, importe) => {
  if (importe === 0) return 0;
  return (totalPedidos / importe) * 100;
};

export const getTiposGastos = (gastosObra) => {
  const resumen = {};

  gastosObra.forEach((gasto) => {
    if (gasto.tipo_gasto) {
      const totalGasto = gasto.cantidad * gasto.importe;
      if (!resumen[gasto.tipo_gasto]) {
        resumen[gasto.tipo_gasto] = 0;
      }
      resumen[gasto.tipo_gasto] += totalGasto;
      resumen[gasto.tipo_gasto] =
        Math.round(resumen[gasto.tipo_gasto] * 100) / 100;
    }
  });

  return Object.entries(resumen).map(([tipo, importe]) => ({
    tipo,
    importe: Number(importe.toFixed(2)),
  }));
};
