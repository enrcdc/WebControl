import { db } from "../config/database.js";

export class ObraModel {
  /**
   * getAll recupera todas las obras según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idObra] - filtrar por id
   * @param {string} [filters.empresa] - filtrar por nombre de empresa (like)
   * @param {string} [filters.complejo] - filtrar por nombre de edificio (like)
   * @param {Array<string>} [filters.estados] - filtrar por descripciones de estado [Array]
   * @param {Array<string>} [filters.tipos] - filtrar por descripciones de tipo [Array]
   * @param {boolean} [filters.enSeguimiento] - true: con fecha_seg, false: sin fecha_seg
   * @param {boolean} [filters.ofertada] - true: con fecha_oferta, false: sin fecha_oferta
   * @param {string} [filters.fechaDesde] - filtrar desde fecha de alta (inclusive)
   * @param {string} [filters.fechaHasta] - filtrar hasta fecha de alta (inclusive)
   * @param {boolean} [filters.conPedidos] - true: con pedidos, false: sin pedidos
   * @param {boolean} [filters.conFacturas] - true: con facturas, false: sin facturas
   * @param {boolean} [filters.conHoras] - true: con horas, false: sin horas
   * @param {boolean} [filters.conGastos] - true: con gastos, false: sin gastos
   * @param {boolean} [filters.mostrarBaja] - true: solo dadas de baja, false: solo activas
   * @param {string} [filters.relacionEntreObras] - filtrar por relación padre/hija: "mostrarHijas", "mostrarPadres", "mostrarPadresHijas", "ocultarHijas", "ocultarPadres", "ocultarPadresHijas"
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("obras as o")
      .select(
        "o.*",
        db.ref("tipoO.descripcion").as("desc_tipo_obra"),
        db.ref("te.descripcion_estado").as("desc_estado_obra"),
        db.ref("e.nombre").as("nombre_empresa"),
        "r.rentabilidadPorcentaje",
        "r.horasTotal",
        db.ref("ed.nombre").as("nombre_edificio"),
        "f.fecha_ultima_factura",
        db.ref("re2.id_obraPadre").as("obra_padre"),
        db.raw("COALESCE(re.num_hijas, 0) AS num_hijas"),
        db.raw("COALESCE(go2.total_gastos, 0) AS total_gastos"),
        db.raw("COALESCE(p.total_pedidos, 0) AS total_pedidos"),
        db.raw("COALESCE(f.total_facturas, 0) AS total_facturas"),
        db.raw("COALESCE(h.total_horas, 0) AS total_horas"),
      )
      .leftJoin("empresas as e", "o.id_empresa", "e.id_empresa")
      .leftJoin("tipoobra as tipoO", "o.tipo_obra", "tipoO.id_tipo")
      .leftJoin(
        "tipoestadosobras as te",
        "o.estado_obra",
        "te.codigo_estado",
      )
      .leftJoin("rentabilidad as r", "o.id_obra", "r.id_obra")
      .leftJoin("edificios as ed", "o.id_edificio", "ed.id_edificio")
      .leftJoin(
        db("ecopedido")
          .select("id_obra", db.raw("SUM(importe) as total_pedidos"))
          .groupBy("id_obra")
          .as("p"),
        "o.id_obra",
        "p.id_obra",
      )
      .leftJoin(
        db("ecofactura")
          .select(
            "id_obra",
            db.raw("SUM(importe) as total_facturas"),
            db.raw("MAX(fecha) as fecha_ultima_factura"),
          )
          .groupBy("id_obra")
          .as("f"),
        "o.id_obra",
        "f.id_obra",
      )
      .leftJoin(
        db("horasobra")
          .select("id_obra", db.raw("SUM(num_horas) as total_horas"))
          .groupBy("id_obra")
          .as("h"),
        "o.id_obra",
        "h.id_obra",
      )
      .leftJoin(
        db("relacionobras")
          .select(
            "id_obraPadre",
            db.raw("COUNT(id_obraHija) as num_hijas"),
          )
          .groupBy("id_obraPadre")
          .as("re"),
        "o.id_obra",
        "re.id_obraPadre",
      )
      .leftJoin(
        db("gastosobra")
          .select(
            "id_obra",
            db.raw("SUM(cantidad * importe) as total_gastos"),
          )
          .groupBy("id_obra")
          .as("go2"),
        "o.id_obra",
        "go2.id_obra",
      )
      .leftJoin(
        "relacionobras as re2",
        "o.id_obra",
        "re2.id_obraHija",
      )
      .orderBy("o.codigo_obra");

    if (filters.idObra) {
      query.where("o.id_obra", filters.idObra);
    }

    if (filters.empresa) {
      query.where("e.nombre", "like", `%${filters.empresa}%`);
    }

    if (filters.complejo) {
      query.where("ed.nombre", "like", `%${filters.complejo}%`);
    }

    if (filters.estados) {
      query.whereIn("te.descripcion_estado", filters.estados);
    }

    if (filters.tipos) {
      query.whereIn("tipoO.descripcion", filters.tipos);
    }

    if (filters.enSeguimiento !== undefined) {
      if (
        filters.enSeguimiento === "true" ||
        filters.enSeguimiento === true
      ) {
        query.whereNotNull("o.fecha_seg");
      } else {
        query.whereNull("o.fecha_seg");
      }
    }

    if (filters.ofertada !== undefined) {
      if (filters.ofertada === "true" || filters.ofertada === true) {
        query.whereNotNull("o.fecha_oferta");
      } else {
        query.whereNull("o.fecha_oferta");
      }
    }

    if (filters.fechaDesde) {
      query.where("o.fecha_alta", ">=", filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      query.where("o.fecha_alta", "<=", filters.fechaHasta);
    }

    if (filters.conPedidos !== undefined) {
      if (filters.conPedidos === "true" || filters.conPedidos === true) {
        query.whereNotNull("p.total_pedidos");
      } else {
        query.whereNull("p.total_pedidos");
      }
    }

    if (filters.conFacturas !== undefined) {
      if (
        filters.conFacturas === "true" ||
        filters.conFacturas === true
      ) {
        query.whereNotNull("f.total_facturas");
      } else {
        query.whereNull("f.total_facturas");
      }
    }

    if (filters.conHoras !== undefined) {
      if (filters.conHoras === "true" || filters.conHoras === true) {
        query.whereNotNull("h.total_horas");
      } else {
        query.whereNull("h.total_horas");
      }
    }

    if (filters.conGastos !== undefined) {
      if (filters.conGastos === "true" || filters.conGastos === true) {
        query.whereNotNull("go2.total_gastos");
      } else {
        query.whereNull("go2.total_gastos");
      }
    }

    if (filters.mostrarBaja !== undefined) {
      if (
        filters.mostrarBaja === "true" ||
        filters.mostrarBaja === true
      ) {
        query.whereNotNull("o.fecha_baja");
      } else {
        query.whereNull("o.fecha_baja");
      }
    }

    if (filters.relacionEntreObras) {
      switch (filters.relacionEntreObras) {
        case "mostrarHijas":
          query.whereNotNull("re2.id_obraPadre");
          break;
        case "mostrarPadres":
          query.whereRaw("COALESCE(re.num_hijas, 0) > 0");
          break;
        case "mostrarPadresHijas":
          query.where(function () {
            this.whereNotNull("re2.id_obraPadre").orWhereRaw(
              "COALESCE(re.num_hijas, 0) > 0",
            );
          });
          break;
        case "ocultarHijas":
          query.whereNull("re2.id_obraPadre");
          break;
        case "ocultarPadres":
          query.whereRaw("COALESCE(re.num_hijas, 0) = 0");
          break;
        case "ocultarPadresHijas":
          query
            .whereNull("re2.id_obraPadre")
            .whereRaw("COALESCE(re.num_hijas, 0) = 0");
          break;
      }
    }

    return query;
  }

  static async getById({ idObra }) {
    return (
      db("obras as o")
        .select(
          "o.*",
          db.ref("tipoO.descripcion").as("desc_tipo_obra"),
          db.ref("tf.descripcion").as("desc_facturable"),
          db.ref("te.descripcion_estado").as("desc_estado_obra"),
          db.ref("u.nombre").as("nombre_usuario"),
          db.ref("u.apellido1").as("apellido_1_usuario"),
          db.ref("u.apellido2").as("apellido_2_usuario"),
          db.ref("u.codigo_firma").as("firma_usuario"),
          db.ref("e.nombre").as("nombre_empresa"),
          "c.nombre_contacto",
          db.ref("c.apellido1").as("apellido_1_contacto"),
          db.ref("c.apellido2").as("apellido_2_contacto"),
          db.ref("ed.nombre").as("nombre_edificio"),
        )
        .leftJoin("empresas as e", "o.id_empresa", "e.id_empresa")
        .leftJoin("tipoobra as tipoO", "o.tipo_obra", "tipoO.id_tipo")
        .leftJoin(
          "tipoestadosobras as te",
          "o.estado_obra",
          "te.codigo_estado",
        )
        .leftJoin("tipofacturable as tf", "o.facturable", "tf.id_tipo")
        .leftJoin(
          "usuarios as u",
          "o.codigo_usuario_alta",
          "u.codigo_usuario",
        )
        .leftJoin("contactos as c", "o.id_contacto", "c.id_contacto")
        .leftJoin("edificios as ed", "o.id_edificio", "ed.id_edificio")
        .where("o.id_obra", idObra)
        .first() ?? null
    );
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByDescripcion({ descripcionObra }) {
    return db("obras")
      .select("id_obra", "codigo_obra", "descripcion_obra")
      .where("descripcion_obra", "like", `%${descripcionObra}%`);
  }


  // Al llegar aquí, input ya está validado gracias al middleware de validación.
  static async create({ input }) {
    const [insertId] = await db("obras").insert({
      codigo_obra: input.cod,
      descripcion_obra: input.desc,
      fecha_seg: input.fechaSeg,
      descripcion_seg: input.descSeg,
      tipo_obra: input.tipoObra,
      facturable: input.facturable,
      estado_obra: input.estadoObra,
      fecha_alta: input.fechaAlta,
      codigo_usuario_alta: input.usuarioAlta,
      fecha_prevista_fin: input.fechaFin,
      fecha_oferta: input.fechaOferta,
      horas_previstas: input.horasPrevistas,
      gasto_previsto: input.gastoPrevisto,
      importe: input.importe,
      viabilidad: input.viabilidad,
      id_empresa: input.empresa,
      id_contacto: input.contacto,
      id_edificio: input.edificio,
      observaciones: input.observaciones,
      observaciones_internas: input.observacionesInternas,
      version: 0,
    });

    return (
      db("obras")
        .select(
          "id_obra",
          "codigo_obra",
          "descripcion_obra",
          "fecha_seg",
          "tipo_obra",
          "facturable",
          "estado_obra",
          "fecha_alta",
          "codigo_usuario_alta",
          "fecha_prevista_fin",
          "fecha_oferta",
          "horas_previstas",
          "gasto_previsto",
          "importe",
          "viabilidad",
          "id_empresa",
          "id_contacto",
          "id_edificio",
          "observaciones",
          "observaciones_internas",
        )
        .where("id_obra", insertId)
        .first() ?? null
    );
  }

  static async update({ idObra, input }) {
    if (Object.keys(input).length === 0) {
      const error = new Error("No fields provided for update");
      error.name = "EmptyUpdateError";
      throw error;
    }

    const fieldMap = {
      cod: "codigo_obra",
      desc: "descripcion_obra",
      fechaSeg: "fecha_seg",
      descSeg: "descripcion_seg",
      tipoObra: "tipo_obra",
      facturable: "facturable",
      estadoObra: "estado_obra",
      fechaAlta: "fecha_alta",
      usuarioAlta: "codigo_usuario_alta",
      fechaFin: "fecha_prevista_fin",
      fechaOferta: "fecha_oferta",
      horasPrevistas: "horas_previstas",
      gastoPrevisto: "gasto_previsto",
      importe: "importe",
      viabilidad: "viabilidad",
      empresa: "id_empresa",
      contacto: "id_contacto",
      edificio: "id_edificio",
      observaciones: "observaciones",
      observacionesInternas: "observaciones_internas",
    };

    const updateData = {};
    for (const [camelKey, value] of Object.entries(input)) {
      const dbColumn = fieldMap[camelKey];
      if (dbColumn) {
        updateData[dbColumn] = value;
      }
    }

    await db("obras").where("id_obra", idObra).update(updateData);

    return db("obras").where("id_obra", idObra).first() ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ idObra, codigoUsuarioBaja = 67 } = {}) {
    const affectedRows = await db("obras")
      .where("id_obra", idObra)
      .update({
        fecha_baja: db.fn.now(),
        codigo_usuario_baja: codigoUsuarioBaja,
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("obras")
        .select(
          "codigo_obra",
          "descripcion_obra",
          "fecha_baja",
          "codigo_usuario_baja",
        )
        .where("id_obra", idObra)
        .first() ?? null
    );
  }
}
