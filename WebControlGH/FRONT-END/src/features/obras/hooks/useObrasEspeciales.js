import { useState, useEffect } from "react";

export const useObrasEspeciales = (obras) => {
  const [obrasSuperadas, setObrasSuperadas] = useState([]);
  const [obrasFacturadas, setObrasFacturadas] = useState([]);
  const [obrasSeguimiento, setObrasSeguimiento] = useState([]);
  const [obrasSinPedidosConHoras, setObrasSinPedidosConHoras] = useState([]);

  // Estados para selección en los desplegables de las alertas
  const [obraSuperadaSelec, setObraSuperadaSelec] = useState(null);
  const [obraFacturadaSelec, setObraFacturadaSelec] = useState(null);
  const [obraSeguimientoSelec, setObraSeguimientoSelec] = useState(null);
  const [obraSinPedidosConHorasSelec, setObraSinPedidosConHorasSelec] =
    useState(null);

  // Función para contar las obras confirmadas cuyas horas imputadas superan las horas previstas
  const countObrasSuperadas = (obras) => {
    const superadas = obras.filter(
      (obra) =>
        obra.desc_estado_obra === "Confirmada" &&
        obra.horasTotal > obra.horas_previstas
    );
    setObrasSuperadas(superadas);
  };

  // Función para contar las obras confirmadas y totalmente facturadas hace más de 30 días
  const countObrasFacturadas = (obras) => {
    const facturadas = obras.filter((obra) => {
      if (
        obra.desc_estado_obra === "Confirmada" &&
        (obra.total_facturas / obra.importe) * 100 >= 100 &&
        (obra.total_pedidos / obra.importe) * 100 >= 100
      ) {
        const facturacionDate = new Date(obra.fecha_ultima_factura);
        const today = new Date();
        const diffTime = Math.abs(today - facturacionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 30;
      }
      return false;
    });
    setObrasFacturadas(facturadas);
  };

  // Función para contar las obras en seguimiento
  const countObrasSeguimiento = (obras) => {
    const enSeguimiento = obras.filter((obra) => obra.fecha_seg !== null);
    setObrasSeguimiento(enSeguimiento);
  };

  // Función para contar obras con horas pero sin pedidos
  const countObrasConHorasSinPedidos = (obras) => {
    const sinPedidosConHoras = obras.filter(
      (obra) => obra.total_pedidos === 0 && obra.total_horas !== 0
    );
    setObrasSinPedidosConHoras(sinPedidosConHoras);
  };

  // Actualizar conteos cuando cambien las obras
  useEffect(() => {
    if (obras && obras.length > 0) {
      countObrasSuperadas(obras);
      countObrasFacturadas(obras);
      countObrasSeguimiento(obras);
      countObrasConHorasSinPedidos(obras);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obras.length]);

  return {
    // Obras filtradas
    obrasSuperadas,
    obrasFacturadas,
    obrasSeguimiento,
    obrasSinPedidosConHoras,

    // Selecciones
    obraSuperadaSelec,
    setObraSuperadaSelec,
    obraFacturadaSelec,
    setObraFacturadaSelec,
    obraSeguimientoSelec,
    setObraSeguimientoSelec,
    obraSinPedidosConHorasSelec,
    setObraSinPedidosConHorasSelec,
  };
};
