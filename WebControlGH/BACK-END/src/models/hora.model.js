import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

// TODO: Faltan más operaciones CRUD

export class HoraModel {
  /**
   * getAll recupera todas las horas según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idHora] - filtrar por id
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.usuario] - filtrar por nickname (like)
   * @param {number} [filters.manager] - filtrar por código de usuario manager
   * @param {Array<number>} [filters.estadosObra] - filtrar por estados de obra [Array]
   * @param {Array<number>} [filters.tiposObra] - filtrar por tipos de obra [Array]
   * @param {Array<number>} [filters.tareas] - filtrar por ids de tarea [Array]
   * @param {boolean} [filters.validadas] - true: solo validadas, false: solo sin validar
   * @param {string} [filters.fechaDesde] - filtrar desde fecha (inclusive)
   * @param {string} [filters.fechaHasta] - filtrar hasta fecha (inclusive)
   * @returns {Promise<Array>} Array de resultados de filtrado
   * @note Especificar al menos un filtro. Obtener todos los registros es costoso.
   */
  static async getAll(filters = {}) {
    const query = db("horasobra as h")
      .select(
        "h.id_horasobra",
        "u.codigo_usuario",
        "u.nombre",
        "u.apellido1",
        "u.apellido2",
        db.ref("u.usuario_bonita").as("nombre_usuario"),
        "r.cod_usuario_manager",
        "o.id_obra",
        "o.codigo_obra",
        "o.descripcion_obra",
        "o.observaciones",
        "o.estado_obra",
        "o.tipo_obra",
        db.ref("eo.descripcion_estado").as("estado_obra_descripcion"),
        db.ref("tip.descripcion").as("tipo_obra_descripcion"),
        "h.dia_trabajado",
        "h.fecha_validacion",
        "h.fecha_planificacion",
        "h.codigo_usuario_validacion",
        db.ref("u_validador.nombre").as("nombre_validador"),
        db.ref("u_validador.apellido1").as("apellido1_validador"),
        db.ref("u_validador.apellido2").as("apellido2_validador"),
        db.ref("u_validador.usuario_bonita").as("nombre_usuario_validador"),
        db.ref("t.etiqueta").as("tarea"),
        db.ref("t.descripcion").as("descripcion_tarea"),
        "h.num_horas",
      )
      .join("usuarios as u", "h.codigo_usuario", "u.codigo_usuario")
      .join("responsables as r", "u.codigo_usuario", "r.cod_usuario")
      .leftJoin(
        "usuarios as u_validador",
        "h.codigo_usuario_validacion",
        "u_validador.codigo_usuario",
      )
      .join("obras as o", "h.id_obra", "o.id_obra")
      .leftJoin("tipoestadosobras as eo", "o.estado_obra", "eo.codigo_estado")
      .leftJoin("tipoobra as tip", "o.tipo_obra", "tip.id_tipo")
      .leftJoin("tareas as t", "h.id_tarea", "t.id")
      .whereNull("h.fecha_baja")
      .orderBy([
        { column: "h.dia_trabajado", order: "desc" },
        { column: "u.codigo_usuario" },
        { column: "o.codigo_obra" },
      ]);

    if (filters.idHora) {
      query.where("h.id_horasobra", filters.idHora);
    }

    if (filters.idsObra) {
      query.whereIn("h.id_obra", filters.idsObra);
    }

    if (filters.usuario) {
      query.where("u.usuario_bonita", "like", `%${filters.usuario}%`);
    }

    if (filters.manager) {
      query.where("r.cod_usuario_manager", filters.manager);
    }

    if (filters.estadosObra) {
      query.whereIn("o.estado_obra", filters.estadosObra);
    }

    if (filters.tiposObra) {
      query.whereIn("o.tipo_obra", filters.tiposObra);
    }

    if (filters.tareas) {
      query.whereIn("h.id_tarea", filters.tareas);
    }

    if (filters.validadas !== undefined) {
      if (filters.validadas === true || filters.validadas === "true") {
        query.whereNotNull("h.fecha_validacion");
      } else {
        query.whereNull("h.fecha_validacion");
      }
    }

    if (filters.fechaDesde) {
      query.where("h.dia_trabajado", ">=", filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      query.where("h.dia_trabajado", "<=", filters.fechaHasta);
    }

    return applyPagination(query, filters);
  }

  static async create({ input }) {
    const [insertId] = await db("horasobra").insert({
      dia_trabajado: input.diaTrabajado,
      codigo_usuario: input.usuarioAsignado,
      id_obra: input.obraAsignada,
      id_tarea: input.tareaAsignada,
      num_horas: input.horasAsignadas,
      observaciones: input.observaciones,
    });

    return (
      db("horasobra")
        .select(
          "dia_trabajado",
          "codigo_usuario",
          "id_obra",
          "id_tarea",
          "num_horas",
          "observaciones",
        )
        .where("id_horasobra", insertId)
        .first() ?? null
    );
  }
}
