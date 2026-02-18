import { ObraModel } from "../models/obra.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import {
  validateId,
  validateNotEmpty,
  validateAndSanitizeString,
  validateDateNotFuture,
  validateDateRange,
  validateNumberRange,
  calculateDaysBetween,
  calculatePercentage,
  calculateDeviation,
  countBy,
  sumBy,
} from "../utils/index.js";

/**
 * Servicio de Obras
 */
export class ObraService {
  // ============================================
  // MÉTODOS CRUD
  // ============================================

  /**
   * Obtener obras con filtros dinámicos
   * @note El filtro "conAlertas" se aplica en JS porque depende del enrichment
   */
  static async getAll(filters = {}) {
    const conAlertas = filters.conAlertas;
    const filtersForModel = { ...filters };
    delete filtersForModel.conAlertas;

    const { data, pagination } = await ObraModel.getAll(filtersForModel);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Obras",
        null,
        "No hay obras registradas en el sistema",
      );
    }

    // Enriquecer datos
    let obras = data.map((obra) => this._enrichObraData(obra));

    // Filtro conAlertas (requiere enrichment, no se puede hacer en SQL)
    if (conAlertas !== undefined) {
      if (conAlertas === "true" || conAlertas === true) {
        obras = obras.filter((o) => o.alertas && o.alertas.length > 0);
      }
    }

    return { data: obras, pagination };
  }

  /**
   * Obtener obra por ID
   */
  static async getById(id) {
    const validId = validateId(id, "ID de obra");

    const obra = await ObraModel.getById({ idObra: validId });

    if (!obra) {
      throw new NotFoundError("Obra", id);
    }

    if (obra.fecha_baja) {
      throw new AlreadyDeletedError("Obra", id);
    }

    return this._enrichObraData(obra);
  }

  /**
   * Crear una nueva obra
   */
  static async create(obraData) {
    // Validaciones de negocio específicas de obras
    this._validateObraBusinessRules(obraData);

    const nuevaObra = await ObraModel.create({ input: obraData });

    if (!nuevaObra) {
      throw new Error("Error al crear la obra");
    }

    return nuevaObra;
  }

  /**
   * Actualizar una obra existente
   */
  static async update(id, updateData) {
    const validId = validateId(id, "ID de obra");
    validateNotEmpty(updateData, "datos de actualización");

    // Verificar existencia
    const obraExistente = await this._getObraOrFail(validId);

    // Validaciones específicas de actualización
    this._validateObraUpdate(obraExistente, updateData);

    const obraActualizada = await ObraModel.update({
      idObra: validId,
      input: updateData,
    });

    if (!obraActualizada) {
      throw new NotFoundError("Obra", id);
    }

    return obraActualizada;
  }

  /**
   * Eliminar una obra (soft delete)
   */
  static async delete(id, codigoUsuarioBaja = 67) {
    const validId = validateId(id, "ID de obra");

    if (codigoUsuarioBaja) {
      validateId(codigoUsuarioBaja, "Código de usuario");
    }

    const obraExistente = await this._getObraOrFail(validId, false);

    if (obraExistente.fecha_baja) {
      throw new AlreadyDeletedError("Obra", id);
    }

    // Validación específica: ¿se puede eliminar?
    this._validateCanDelete(obraExistente);

    const obraEliminada = await ObraModel.delete({
      idObra: validId,
      codigoUsuarioBaja: codigoUsuarioBaja || 67,
    });

    if (!obraEliminada) {
      throw new NotFoundError("Obra", id);
    }

    return obraEliminada;
  }

  // ============================================
  // MÉTODOS ADICIONALES (ESPECÍFICOS DE OBRAS)
  // ============================================

  /**
   * Obtener estadísticas de obras
   */
  static async getEstadisticas() {
    const { data: obras } = await ObraModel.getAll({ limit: 0 });

    return {
      total: obras.length,
      porEstado: countBy(obras, "desc_estado_obra"),
      porTipo: countBy(obras, "desc_tipo_obra"),
      totalFacturado: sumBy(obras, "total_facturas"),
      totalGastos: sumBy(obras, "total_gastos"),
      rentabilidadPromedio: this._calculateAverageRentabilidad(obras),
    };
  }

  // ============================================
  // MÉTODOS PRIVADOS (ESPECÍFICOS DE OBRAS)
  // ============================================

  /**
   * Validaciones de negocio para crear obra
   */
  static _validateObraBusinessRules(obraData) {
    // Fecha de alta no futura
    if (obraData.fechaAlta) {
      validateDateNotFuture(obraData.fechaAlta, "fecha de alta");
    }

    // Fecha fin > fecha alta
    if (obraData.fechaAlta && obraData.fechaFin) {
      validateDateRange(
        obraData.fechaAlta,
        obraData.fechaFin,
        "fecha de alta",
        "fecha prevista de fin",
      );
    }

    // Horas previstas razonables
    if (obraData.horasPrevistas) {
      validateNumberRange(obraData.horasPrevistas, "horas previstas", 0, 10000);
    }
  }

  /**
   * Validaciones para actualizar obra
   */
  static _validateObraUpdate(obraExistente, updateData) {
    // Validar fechas coherentes
    if (updateData.fechaFin && obraExistente.fecha_alta) {
      validateDateRange(
        obraExistente.fecha_alta,
        updateData.fechaFin,
        "fecha de alta",
        "fecha prevista de fin",
      );
    }

    // Validar transición de estado
    if (updateData.estadoObra !== undefined) {
      this._validateEstadoTransition(
        obraExistente.estado_obra,
        updateData.estadoObra,
      );
    }
  }

  /**
   * Validar si se puede eliminar (regla específica de obras)
   */
  static _validateCanDelete(obra) {
    // Por ahora, permitir siempre (es soft delete)
    return true;
  }

  /**
   * Validar transición de estado (lógica específica de obras)
   */
  static _validateEstadoTransition(estadoActual, nuevoEstado) {
    const transicionesValidas = {
      1: [2, 3, 4], // Oferta → En curso, Parada, Rechazada
      2: [3, 5], // En curso → Parada, Finalizada
      3: [2, 5], // Parada → En curso, Finalizada
      4: [], // Rechazada es final
      5: [], // Finalizada es final
    };

    const permitidas = transicionesValidas[estadoActual] || [];

    if (!permitidas.includes(nuevoEstado)) {
      throw new InvalidDataError(
        `No se puede cambiar del estado ${estadoActual} al estado ${nuevoEstado}`,
        { estadoActual, nuevoEstado, estadosPermitidos: permitidas },
      );
    }
  }

  /**
   * Enriquecer datos de obra con campos calculados
   */
  static _enrichObraData(obra) {
    return {
      ...obra,
      estado_calculado: this._calculateEstadoObra(obra),
      rentabilidad_real: this._calculateRentabilidad(obra),
      alertas: this._checkAlertas(obra),
    };
  }

  /**
   * Calcular estado de obra (lógica específica)
   */
  static _calculateEstadoObra(obra) {
    if (obra.fecha_baja) return "ELIMINADA";

    // Verificar si está retrasada
    if (obra.fecha_prevista_fin) {
      const hoy = new Date();
      const fechaFin = new Date(obra.fecha_prevista_fin);
      if (hoy > fechaFin && obra.estado_obra !== 5) {
        return "RETRASADA";
      }
    }

    // Verificar inactividad
    if (obra.fecha_ultima_factura) {
      const diasSinActividad = calculateDaysBetween(obra.fecha_ultima_factura);
      if (diasSinActividad > 90 && obra.estado_obra !== 5) {
        return "INACTIVA";
      }
    }

    return "ACTIVA";
  }

  /**
   * Calcular rentabilidad (lógica específica)
   */
  static _calculateRentabilidad(obra) {
    if (!obra.importe || !obra.total_gastos) return null;

    const ingresos = Number(obra.total_facturas) || 0;
    const gastos = Number(obra.total_gastos) || 0;
    const rentabilidad = ingresos - gastos;

    return {
      ingresos,
      gastos,
      rentabilidad,
      porcentaje: calculatePercentage(rentabilidad, ingresos),
      desviacionPrevista: calculateDeviation(obra.importe, ingresos),
    };
  }

  /**
   * Verificar alertas (lógica específica)
   */
  static _checkAlertas(obra) {
    const alertas = [];

    // Horas excedidas
    if (obra.horas_previstas && obra.total_horas) {
      if (Number(obra.total_horas) > Number(obra.horas_previstas)) {
        alertas.push({
          tipo: "HORAS_EXCEDIDAS",
          severidad: "WARNING",
          mensaje: `Horas reales (${obra.total_horas}) superan previstas (${obra.horas_previstas})`,
        });
      }
    }

    // Gastos excedidos
    if (obra.gasto_previsto && obra.total_gastos) {
      if (Number(obra.total_gastos) > Number(obra.gasto_previsto)) {
        alertas.push({
          tipo: "GASTOS_EXCEDIDOS",
          severidad: "ERROR",
          mensaje: `Gastos reales (${obra.total_gastos}) superan previstos (${obra.gasto_previsto})`,
        });
      }
    }

    // Sin actividad
    if (obra.fecha_ultima_factura && obra.estado_obra !== 5) {
      const diasSinActividad = calculateDaysBetween(obra.fecha_ultima_factura);
      if (diasSinActividad > 90) {
        alertas.push({
          tipo: "SIN_ACTIVIDAD",
          severidad: "INFO",
          mensaje: `Sin actividad desde hace ${diasSinActividad} días`,
        });
      }
    }

    // Sin contacto
    if (!obra.id_contacto) {
      alertas.push({
        tipo: "SIN_CONTACTO",
        severidad: "WARNING",
        mensaje: "La obra no tiene contacto asignado",
      });
    }

    return alertas;
  }

  /**
   * Helper: obtener obra o lanzar error
   */
  static async _getObraOrFail(id, checkDeleted = true) {
    const obra = await ObraModel.getById({ idObra: id });

    if (!obra) {
      throw new NotFoundError("Obra", id);
    }

    if (checkDeleted && obra.fecha_baja) {
      throw new AlreadyDeletedError("Obra", id);
    }

    return obra;
  }

  /**
   * Helper: calcular rentabilidad promedio
   */
  static _calculateAverageRentabilidad(obras) {
    const obrasConRentabilidad = obras.filter((o) => o.rentabilidadPorcentaje);

    if (obrasConRentabilidad.length === 0) return 0;

    const suma = obrasConRentabilidad.reduce(
      (acc, o) => acc + Number(o.rentabilidadPorcentaje),
      0,
    );

    return (suma / obrasConRentabilidad.length).toFixed(2);
  }
}
