import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

// Pregunta: La columna TipoFactura es siempre NULL. Merece la pena incluirla en form de creación?
// Pregunta: En la BBDD no hay una tabla que relacione contactos y proveedores

export class ProveedorModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {string} [filters.idProveedor] - filtrar por id
   * @param {string} [filters.codigo] - filtrar por codigo de proveedor
   * @param {string} [filters.nombre] - filtrar por nombre de proveedor
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("proveedores")
      .select(
        "id",
        "NombreProveedor",
        "PersonaContacto",
        "Codigo",
        "Direccion",
        "Poblacion",
        "Provincia",
        "CP",
        "Tel",
        "CIF",
        "DireccionCorreoEl",
        "observaciones",
        "fecha_baja",
      )
      .where("CodEmp", "00004") // -> Proveedores de Control Cube
      .orderBy("NombreProveedor");

    if (filters.idProveedor) {
      query.where("id", filters.idProveedor);
    }

    if (filters.nombre) {
      query.where("NombreProveedor", "like", `%${filters.nombre}%`);
    }

    if (filters.codigo) {
      query.where("Codigo", "like", `%${filters.codigo}%`);
    }

    if (!filters.mostrarBaja) {
      query.whereNull("fecha_baja");
    }

    return applyPagination(query, filters);
  }

  static async getById({ idProveedor }) {
    return (
      db("proveedores")
        .select(
          "id",
          "NombreProveedor",
          "PersonaContacto",
          "Codigo",
          "Direccion",
          "Poblacion",
          "Provincia",
          "CP",
          "Tel",
          "Telefono2",
          "Fax",
          "CIF",
          "DireccionCorreoEl",
          "Evaluacion",
          "TipoFactura",
          "observaciones",
          "fecha_baja",
        )
        .where("id", idProveedor)
        .first() ?? null
    );
  }

  static async getLastCodigo() {
    return db("proveedores")
      .select(db.raw(`MAX(CAST(Codigo AS UNSIGNED)) AS ultimo_codigo`))
      .where(
        db.raw(`
        Codigo REGEXP '^[0-9]+$' AND CodEmp="00004"
        `),
      );
  }

  static async create(input) {
    const [idProveedor] = await db("proveedores").insert({
      CodEmp: "00004", // --> "00004" es el código de empresa de CC en la BBDD y debe estar fijado
      Codigo: input.codigo,
      NombreProveedor: input.nombre,
      CIF: input.cif,
      PersonaContacto: input.contacto,
      Direccion: input.direccion,
      Poblacion: input.poblacion,
      Provincia: input.provincia,
      CP: input.cp,
      Tel: input.telefono1,
      Telefono2: input.telefono2,
      Fax: input.fax,
      id_tipofactura: input.tipoFactura,
      DireccionCorreoEl: input.email,
      Evaluacion: input.evaluacion,
      Observaciones: input.observaciones,
    });

    const proveedor = await db("proveedores")
      .select("*")
      .where("id", idProveedor)
      .first();

    return proveedor ?? null;
  }

  static async update({ idProveedor, input }) {
    await db("proveedores").where("id", idProveedor).update({
      Codigo: input.codigo,
      NombreProveedor: input.nombre,
      CIF: input.cif,
      PersonaContacto: input.contacto,
      Direccion: input.direccion,
      Poblacion: input.poblacion,
      Provincia: input.provincia,
      CP: input.cp,
      Tel: input.telefono1,
      Telefono2: input.telefono2,
      Fax: input.fax,
      DireccionCorreoEl: input.email,
      Evaluacion: input.evaluacion,
      id_tipofactura: input.tipoFactura,
      Observaciones: input.observaciones,
    });

    return db("proveedores").where("id", idProveedor).first() ?? null;
  }

  // SOFT DELETE. DAR DE BAJA Proveedor
  // TODO: Esta operación (junto con la creación y actualización) requeriría permisos especiales
  static async delete({ idProveedores }) {
    const affectedRows = await db("proveedores")
      .whereIn("id", idProveedores)
      .update({
        fecha_baja: db.fn.now(),
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("proveedores")
        .select("id", "NombreProveedor", "fecha_baja")
        .whereIn("id", idProveedores) ?? null
    );
  }
}
