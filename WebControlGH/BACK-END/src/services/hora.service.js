import { HoraModel } from "../models/hora.model.js";
import { NotFoundError, InvalidDataError } from "../errors/index.js";
import { validateId } from "../utils/index.js";

export class HoraService {
  static async getAllHoras() {
    const horas = await HoraModel.getAllHoras();

    if (!horas || horas.length === 0) {
      throw new NotFoundError(
        "Horas",
        null,
        "No hay horas registradas en el sistema",
      );
    }

    return horas;
  }

  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getByObra(idsObra) {
    this._validateIdsObra(idsObra);

    const horas = await HoraModel.getByObra({ idsObra });

    return horas;
  }

  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getHorasBySubordinados(managerCodigo) {
    const validCodigo = validateId(managerCodigo, "código del manager");

    const horas = await HoraModel.getHorasBySubordinados(validCodigo);

    return horas;
  }

  // TODO: Faltan más operaciones CRUD
  static async create(horaData) {
    if (!horaData) {
      throw new InvalidDataError("Los datos de la hora son obligatorios");
    }

    const nuevaHora = await HoraModel.create({ input: horaData });

    if (!nuevaHora) {
      throw new Error("Error al crear la hora");
    }

    return nuevaHora;
  }

  // TODO: De momento hay los métodos específicos, pero se pueden unificar.
  static async buscarConFiltros(filtros) {
    let horas = [];

    // Este filtro sustituye a getByObra
    if (filtros.idsObras) {
      this._validateIdsObra(filtros.idsObras);
      horas = await HoraModel.getByObra({ idsObra: filtros.idsObras });
    } else {
      horas = await HoraModel.getAllHoras();
    }

    if (filtros.usuario) {
      horas = horas.filter((h) =>
        h.nombre_usuario?.toLowerCase().includes(filtros.usuario.toLowerCase()),
      );
    }

    if (filtros.estadosObra) {
      horas = horas.filter((h) => filtros.estadosObra.includes(h.estado_obra));
    }

    if (filtros.tiposObra) {
      horas = horas.filter((h) => filtros.tiposObra.includes(h.tipo_obra));
    }

    if (filtros.tareas) {
      horas = horas.filter((h) => filtros.tareas.includes(h.id_tarea));
    }

    // Este filtro sustituye a getHorasBySubordinados
    if (filtros.manager) {
      horas = horas.filter((h) => h.cod_usuario_manager === filtros.manager);
    }

    if (filtros.validadas !== undefined) {
      horas = filtros.validadas
        ? horas.filter((h) => h.fecha_validacion !== null)
        : horas.filter((h) => h.fecha_validacion === null);
    }

    if (filtros.fechaDesde) {
      const desde = new Date(filtros.fechaDesde);
      horas = horas.filter((h) => new Date(h.dia_trabajado) >= desde);
    }

    if (filtros.fechaHasta) {
      const hasta = new Date(filtros.fechaHasta);
      horas = horas.filter((h) => new Date(h.dia_trabajado) <= hasta);
    }

    return horas;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static _validateIdsObra(idsObra) {
    if (!Array.isArray(idsObra) || idsObra.length === 0) {
      throw new InvalidDataError("Se requiere al menos un ID de obra", {
        field: "idsObra",
      });
    }
  }
}
