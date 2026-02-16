// hooks/useCalculos.js
import { useMemo } from "react";
import {
  calcularTotales,
  calcularGastoTotal,
  calcularRentabilidad,
  calcularPorcentajeRentabilidad,
  calcularPorcentajePedido,
} from "../utils/calculos.js";

/* El hook useMemo permite memorizar el resultado de una función. Siempre y
cuando la dependencia que le hemos pasado a useMemo no haya cambiado, se devolverá
el mismo resultado sin necesidad de recalcularlo otra vez.*/

export const useCalculos = ({
  obra,
  pedidos = [],
  facturas = [],
  gastos = [],
  horas = [],
  horasExtra = [],
  movimientosAlmacen = [],
  facturasCompras = [],
  obrasHijas = [],
  gastosHijas = [],
  horasHijas = [],
  horasExtraHijas = [],
  pedidosHijas = [],
  facturasHijas = [],
}) => {
  // Cálculos de la obra principal
  const totalImporteGastos = useMemo(
    () => calcularTotales.importeGastos(gastos),
    [gastos]
  );
  const totalHoras = useMemo(() => calcularTotales.horas(horas), [horas]);
  const totalImporteHoras = useMemo(
    () => calcularTotales.importeHoras(horas),
    [horas]
  );
  const totalHorasExtra = useMemo(
    () => calcularTotales.horasExtra(horasExtra),
    [horasExtra]
  );
  const totalImporteHorasExtra = useMemo(
    () => calcularTotales.importeHorasExtra(horasExtra),
    [horasExtra]
  );
  const totalImportePedidos = useMemo(
    () => calcularTotales.importePedidos(pedidos),
    [pedidos]
  );
  const totalImporteFacturas = useMemo(
    () => calcularTotales.importeFacturas(facturas),
    [facturas]
  );
  const totalImporteMovimientosAlmacen = useMemo(
    () => calcularTotales.importeMovimientosAlmacen(movimientosAlmacen),
    [movimientosAlmacen]
  );
  const totalImporteCompras = useMemo(
    () => calcularTotales.importeCompras(facturasCompras),
    [facturasCompras]
  );

  // Cálculos de obras subordinadas
  const totalImporteGastosSub = useMemo(
    () => calcularTotales.importeGastos(gastosHijas),
    [gastosHijas]
  );
  const totalHorasSub = useMemo(
    () => calcularTotales.horas(horasHijas),
    [horasHijas]
  );
  const totalImporteHorasSub = useMemo(
    () => calcularTotales.importeHoras(horasHijas),
    [horasHijas]
  );
  const totalHorasExtraSub = useMemo(
    () => calcularTotales.horasExtra(horasExtraHijas),
    [horasExtraHijas]
  );
  const totalImporteHorasExtraSub = useMemo(
    () => calcularTotales.importeHorasExtra(horasExtraHijas),
    [horasExtraHijas]
  );
  const totalHorasPrevistasSub = useMemo(
    () => calcularTotales.horasPrevistasSubordinadas(obrasHijas),
    [obrasHijas]
  );
  const totalImporteObrasSub = useMemo(
    () => calcularTotales.importeObrasSubordinadas(obrasHijas),
    [obrasHijas]
  );
  const totalGastosPrevistosSub = useMemo(
    () => calcularTotales.gastosPrevistosSubordinadas(obrasHijas),
    [obrasHijas]
  );
  const totalImporteFacturasSub = useMemo(
    () => calcularTotales.importeFacturas(facturasHijas),
    [facturasHijas]
  );
  const totalImportePedidosSub = useMemo(
    () => calcularTotales.importePedidos(pedidosHijas),
    [pedidosHijas]
  );

  // Gastos totales
  const gastoTotal = useMemo(
    () =>
      calcularGastoTotal(
        totalImporteHoras,
        totalImporteGastos,
        totalImporteHorasExtra,
        totalImporteMovimientosAlmacen,
        totalImporteCompras
      ),
    [
      totalImporteHoras,
      totalImporteGastos,
      totalImporteHorasExtra,
      totalImporteMovimientosAlmacen,
      totalImporteCompras,
    ]
  );

  const gastoTotalSub = useMemo(
    () =>
      totalImporteHorasSub + totalImporteGastosSub + totalImporteHorasExtraSub,
    [totalImporteHorasSub, totalImporteGastosSub, totalImporteHorasExtraSub]
  );

  // Rentabilidad
  const rentabilidad = useMemo(
    () => calcularRentabilidad(obra.importe || 0, gastoTotal),
    [obra.importe, gastoTotal]
  );

  const porcentajeRentabilidad = useMemo(
    () => calcularPorcentajeRentabilidad(obra.importe || 0, gastoTotal),
    [obra.importe, gastoTotal]
  );

  const rentabilidadSub = useMemo(
    () => calcularRentabilidad(totalImporteObrasSub, gastoTotalSub),
    [totalImporteObrasSub, gastoTotalSub]
  );

  const porcentajeRentabilidadSub = useMemo(
    () => calcularPorcentajeRentabilidad(totalImporteObrasSub, gastoTotalSub),
    [totalImporteObrasSub, gastoTotalSub]
  );

  // Rentabilidad total (obra + subordinadas)
  const importeTotal = useMemo(
    () => (obra.importe || 0) + totalImporteObrasSub,
    [obra.importe, totalImporteObrasSub]
  );

  const gastoTotalCompleto = useMemo(
    () => gastoTotal + gastoTotalSub,
    [gastoTotal, gastoTotalSub]
  );

  const rentabilidadTotal = useMemo(
    () => calcularRentabilidad(importeTotal, gastoTotalCompleto),
    [importeTotal, gastoTotalCompleto]
  );

  const porcentajeRentabilidadTotal = useMemo(
    () => calcularPorcentajeRentabilidad(importeTotal, gastoTotalCompleto),
    [importeTotal, gastoTotalCompleto]
  );

  // Porcentajes de pedidos y facturas
  const porcentajePedido = useMemo(
    () => calcularPorcentajePedido(totalImportePedidos, obra.importe || 0),
    [totalImportePedidos, obra.importe]
  );

  const porcentajeFacturado = useMemo(
    () => calcularPorcentajePedido(totalImporteFacturas, obra.importe || 0),
    [totalImporteFacturas, obra.importe]
  );

  return {
    // Obra principal
    totalImporteGastos,
    totalHoras,
    totalImporteHoras,
    totalHorasExtra,
    totalImporteHorasExtra,
    totalImportePedidos,
    totalImporteFacturas,
    totalImporteMovimientosAlmacen,
    totalImporteCompras,
    gastoTotal,
    rentabilidad,
    porcentajeRentabilidad,
    porcentajePedido,
    porcentajeFacturado,

    // Obras subordinadas
    totalImporteGastosSub,
    totalHorasSub,
    totalImporteHorasSub,
    totalHorasExtraSub,
    totalImporteHorasExtraSub,
    totalHorasPrevistasSub,
    totalImporteObrasSub,
    totalGastosPrevistosSub,
    totalImporteFacturasSub,
    totalImportePedidosSub,
    gastoTotalSub,
    rentabilidadSub,
    porcentajeRentabilidadSub,

    // Total (obra + subordinadas)
    importeTotal,
    gastoTotalCompleto,
    rentabilidadTotal,
    porcentajeRentabilidadTotal,
  };
};
