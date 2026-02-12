import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

export class AlmacenModel {
  /**
   * getAll recupera todos los productos de almacén según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.id] - filtrar por id
   * @param {string} [filters.descripcion] - filtrar por descripción (like)
   * @param {string} [filters.codigo] - filtrar por código (like)
   * @param {string} [filters.proveedor] - filtrar por nombre de proveedor (like)
   * @param {string} [filters.familia] - filtrar por familia (like)
   * @param {string} [filters.unidades] - filtrar por tipo de unidad (like)
   * @param {string} [filters.marca] - filtrar por marca (like)
   * @param {boolean} [filters.porDebajoMinimo] - true: stock < stock_min, false: stock >= stock_min
   * @param {boolean} [filters.porEncimaMaximo] - true: stock > stock_max, false: stock <= stock_max
   * @param {boolean} [filters.mostrarBaja] - true: solo dados de baja, false: solo activos
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("almacen as a")
      .select(
        "a.id",
        "a.codigo",
        "a.descripcion",
        "a.etiqueta",
        db.ref("p.NombreProveedor").as("NombreProveedor"),
        "a.fecha_alta",
        db.ref("f.etiqueta").as("etiqueta_familia"),
        db.ref("m.etiqueta").as("etiqueta_marca"),
        "a.stock",
        "a.stock_min",
        "a.stock_max",
        "a.codigo_usuario_alta",
        db.ref("tu.etiqueta").as("etiqueta_unidad"),
        "a.precio_minimo",
        "a.precio_maximo",
        "a.precio_total",
      )
      .leftJoin("proveedores as p", "a.id_proveedor", "p.id")
      .leftJoin("familias as f", "a.id_familia", "f.id")
      .leftJoin("marcas as m", "a.id_marca", "m.id")
      .leftJoin("tipounidad as tu", "a.id_tipounidad", "tu.id")
      .orderBy("a.descripcion");

    if (filters.id) {
      query.where("a.id", filters.id);
    }

    if (filters.descripcion) {
      query.where("a.descripcion", "like", `%${filters.descripcion}%`);
    }

    if (filters.codigo) {
      query.where("a.codigo", "like", `%${filters.codigo}%`);
    }

    if (filters.proveedor) {
      query.where("p.NombreProveedor", "like", `%${filters.proveedor}%`);
    }

    if (filters.familia) {
      query.where("f.etiqueta", "like", `%${filters.familia}%`);
    }

    if (filters.unidades) {
      query.where("tu.etiqueta", "like", `%${filters.unidades}%`);
    }

    if (filters.marca) {
      query.where("m.etiqueta", "like", `%${filters.marca}%`);
    }

    if (filters.porDebajoMinimo !== undefined) {
      if (filters.porDebajoMinimo === "true" || filters.porDebajoMinimo === true) {
        query.whereRaw("a.stock < a.stock_min");
      } else {
        query.whereRaw("a.stock >= a.stock_min");
      }
    }

    if (filters.porEncimaMaximo !== undefined) {
      if (filters.porEncimaMaximo === "true" || filters.porEncimaMaximo === true) {
        query.whereRaw("a.stock > a.stock_max");
      } else {
        query.whereRaw("a.stock <= a.stock_max");
      }
    }

    if (filters.mostrarBaja !== undefined) {
      if (filters.mostrarBaja === "true" || filters.mostrarBaja === true) {
        query.whereNotNull("a.fecha_baja");
      } else {
        query.whereNull("a.fecha_baja");
      }
    }

    return applyPagination(query, filters);
  }

  static async getById({ id }) {
    return (
      db("almacen as a")
        .select(
          "a.id",
          "a.codigo",
          "a.descripcion",
          "a.etiqueta",
          db.ref("p.NombreProveedor").as("NombreProveedor"),
          "a.fecha_alta",
          db.ref("f.etiqueta").as("etiqueta_familia"),
          db.ref("m.etiqueta").as("etiqueta_marca"),
          "a.stock",
          "a.stock_min",
          "a.stock_max",
          "a.codigo_usuario_alta",
          db.ref("tu.etiqueta").as("etiqueta_unidad"),
          "a.precio_minimo",
          "a.precio_maximo",
          "a.precio_total",
          "a.observaciones",
          "a.fecha_baja",
        )
        .leftJoin("proveedores as p", "a.id_proveedor", "p.id")
        .leftJoin("familias as f", "a.id_familia", "f.id")
        .leftJoin("marcas as m", "a.id_marca", "m.id")
        .leftJoin("tipounidad as tu", "a.id_tipounidad", "tu.id")
        .where("a.id", id)
        .first() ?? null
    );
  }

  static async create({ input }) {
    const [insertId] = await db("almacen").insert({
      codigo: input.cod,
      descripcion: input.descripcion,
      etiqueta: input.etiqueta,
      id_proveedor: input.proveedor,
      id_familia: input.familia,
      id_tipounidad: input.tipoUnidad,
      fecha_alta: input.fechaAlta,
      codigo_usuario_alta: input.usuarioAlta,
      stock: input.stock,
      stock_min: input.stockMin,
      stock_max: input.stockMax,
      id_marca: input.marca,
      precio_unitario: input.precioUnitario,
      precio_total: input.precioTotal,
      observaciones: input.observaciones,
    });

    return db("almacen").where("id", insertId).first() ?? null;
  }

  static async update({ id, input }) {
    await db("almacen").where("id", id).update({
      codigo: input.cod,
      descripcion: input.descripcion,
      etiqueta: input.etiqueta,
      id_proveedor: input.proveedor,
      id_familia: input.familia,
      id_tipounidad: input.tipoUnidad,
      fecha_alta: input.fechaAlta,
      codigo_usuario_alta: input.usuarioAlta,
      stock: input.stock,
      stock_min: input.stockMin,
      stock_max: input.stockMax,
      id_marca: input.marca,
      precio_unitario: input.precioUnitario,
      precio_total: input.precioTotal,
      observaciones: input.observaciones,
    });

    return db("almacen").where("id", id).first() ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ id, codigoUsuarioBaja = 67 }) {
    const affectedRows = await db("almacen").where("id", id).update({
      fecha_baja: db.fn.now(),
      codigo_usuario_baja: codigoUsuarioBaja,
    });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("almacen")
        .select("id", "codigo", "descripcion", "fecha_baja", "codigo_usuario_baja")
        .where("id", id)
        .first() ?? null
    );
  }
}
