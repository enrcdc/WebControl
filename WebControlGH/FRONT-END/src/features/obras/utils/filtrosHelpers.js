// Todas estas son funciones puras que no modifican el array original

export const aplicarFiltroPorFecha = (obras, fechaInicio, fechaFin) => {
  let filtered = obras;

  if (fechaInicio) {
    filtered = filtered.filter(
      (obra) => new Date(obra.fecha_alta) >= new Date(fechaInicio)
    );
  }

  if (fechaFin) {
    filtered = filtered.filter(
      (obra) => new Date(obra.fecha_alta) <= new Date(fechaFin)
    );
  }

  return filtered;
};

export const aplicarFiltroPorComplejo = (obras, complejo) => {
  if (!complejo) return obras;
  return obras.filter((obra) => obra.nombre_edificio === complejo);
};

export const aplicarFiltroPorEmpresa = (obras, empresa) => {
  if (!empresa) return obras;
  return obras.filter((obra) => obra.nombre_empresa === empresa);
};

export const aplicarFiltroPorSeguimiento = (obras, enSeguimiento) => {
  if (!enSeguimiento) return obras;

  if (enSeguimiento === "Si") {
    return obras.filter((obra) => obra.fecha_seg !== null);
  } else {
    return obras.filter((obra) => obra.fecha_seg === null);
  }
};

export const aplicarFiltroPorEstado = (obras, estadoObra) => {
  if (!estadoObra) return obras;
  return obras.filter((obra) => obra.desc_estado_obra === estadoObra);
};

export const aplicarFiltroPorTipo = (obras, tipoObra) => {
  if (!tipoObra) return obras;
  return obras.filter((obra) => obra.desc_tipo_obra === tipoObra);
};

export const aplicarFiltroPorOfertada = (obras, ofertada) => {
  if (!ofertada) return obras;

  if (ofertada === "Si") {
    return obras.filter((obra) => obra.fecha_oferta !== null);
  } else {
    return obras.filter((obra) => obra.fecha_oferta === null);
  }
};

export const aplicarFiltroPorPedido = (obras, conPedido) => {
  if (!conPedido) return obras;

  if (conPedido === "Si") {
    return obras.filter((obra) => obra.total_pedidos !== 0);
  } else {
    return obras.filter((obra) => obra.total_pedidos === 0);
  }
};

export const aplicarFiltroPorFactura = (obras, conFactura) => {
  if (!conFactura) return obras;

  if (conFactura === "Si") {
    return obras.filter((obra) => obra.total_facturas !== 0);
  } else {
    return obras.filter((obra) => obra.total_facturas === 0);
  }
};

export const aplicarFiltroPorHoras = (obras, conHoras) => {
  if (!conHoras) return obras;

  if (conHoras === "Si") {
    return obras.filter((obra) => obra.total_horas !== 0);
  } else {
    return obras.filter((obra) => obra.total_horas === 0);
  }
};

export const aplicarFiltroPorGastos = (obras, conGastos) => {
  if (!conGastos) return obras;

  if (conGastos === "Si") {
    return obras.filter((obra) => obra.total_gastos !== 0);
  } else {
    return obras.filter((obra) => obra.total_gastos === 0);
  }
};

export const aplicarFiltroPorRelacion = (obras, relacionEntreObras) => {
  if (!relacionEntreObras) return obras;

  switch (relacionEntreObras) {
    case "mostrarHijas":
      return obras.filter((obra) => obra.obra_padre !== null);

    case "mostrarPadres":
      return obras.filter((obra) => obra.num_hijas !== 0);

    case "mostrarPadresHijas":
      return obras.filter(
        (obra) => obra.obra_padre !== null || obra.num_hijas !== 0
      );

    case "ocultarHijas":
      return obras.filter((obra) => obra.obra_padre === null);

    case "ocultarPadres":
      return obras.filter((obra) => obra.num_hijas === 0);

    case "ocultarPadresHijas":
      return obras.filter(
        (obra) => obra.obra_padre === null && obra.num_hijas === 0
      );

    default:
      return obras;
  }
};

export const aplicarFiltroPorBaja = (obras, mostrarBajas) => {
  if (mostrarBajas) {
    return obras.filter((obra) => obra.fecha_baja !== null);
  } else {
    return obras.filter((obra) => obra.fecha_baja === null);
  }
};

export const aplicarFiltroPorCodigo = (obras, searchTerm) => {
  if (!searchTerm) return obras;

  return obras.filter((obra) =>
    obra.codigo_obra.toUpperCase().includes(searchTerm.toUpperCase())
  );
};
