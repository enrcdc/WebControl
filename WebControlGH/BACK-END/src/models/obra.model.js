import db from "../config/database.js";
import {
  validateObra,
  validatePartialObra,
} from "../validations/obrasValidator.js";
import { ValidationError } from "../validations/ValidationError.js";

export class ObraModel {
  static async getAll() {
    const query = `
    SELECT
      o.*,
      tipoO.descripcion AS desc_tipo_obra,
      te.descripcion_estado AS desc_estado_obra,      
      e.nombre AS nombre_empresa,
      r.rentabilidadPorcentaje,
      r.horasTotal,
      ed.nombre AS nombre_edificio,
      f.fecha_ultima_factura,
      re2.id_obraPadre AS obra_padre,
      COALESCE (re.num_hijas, 0) AS num_hijas,
      COALESCE (go.total_gastos, 0) AS total_gastos,
      COALESCE(p.total_pedidos, 0) AS total_pedidos,
      COALESCE(f.total_facturas, 0) AS total_facturas,
      COALESCE (h.total_horas, 0) AS total_horas

    FROM 
      obras AS o
    
    LEFT JOIN
      empresas AS e ON o.id_empresa = e.id_empresa
    
    LEFT JOIN
      tipoobra AS tipoO ON o.tipo_obra = tipoO.id_tipo
    
    LEFT JOIN
      tipoestadosobras AS te ON o.estado_obra = te.codigo_estado
    
    LEFT JOIN
      rentabilidad AS r ON o.id_obra = r.id_obra

    LEFT JOIN
      edificios AS ed ON o.id_edificio = ed.id_edificio
    
    LEFT JOIN (
      SELECT id_obra, SUM(importe) AS total_pedidos FROM ecopedido GROUP BY id_obra
    ) AS p ON o.id_obra = p.id_obra

    LEFT JOIN (
      SELECT id_obra, SUM(importe) AS total_facturas, MAX(fecha) AS fecha_ultima_factura 
      FROM ecofactura 
      GROUP BY id_obra
    ) AS f ON o.id_obra = f.id_obra
    
    LEFT JOIN (
	    SELECT id_obra, SUM(num_horas) AS total_horas
      FROM horasobra
      GROUP BY id_obra
    ) AS h ON o.id_obra = h.id_obra

    LEFT JOIN (
	    SELECT id_obraPadre, COUNT(id_obraHija) AS num_hijas
      FROM relacionobras
      GROUP BY id_obraPadre
    ) AS re ON o.id_obra = re.id_obraPadre

    LEFT JOIN (
	    SELECT id_obra, SUM((cantidad * importe)) AS total_gastos
      FROM gastosobra
      GROUP BY id_obra
    ) AS go ON o.id_obra = go.id_obra

    LEFT JOIN relacionobras AS re2 ON o.id_obra = re2.id_obraHija
    
    ORDER BY o.codigo_obra;`;

    const [result] = await db.query(query);
    return result;
  }

  static async getById({ idObra }) {
    const query = `
    SELECT
      o.*,
      tipoO.descripcion AS desc_tipo_obra,
      tf.descripcion AS desc_facturable,
      te.descripcion_estado AS desc_estado_obra,
      u.nombre AS nombre_usuario,
      u.apellido1 AS apellido_1_usuario,
      u.apellido2 AS apellido_2_usuario,
      u.codigo_firma AS firma_usuario,
      e.nombre AS nombre_empresa,
      c.nombre_contacto,
      c.apellido1 AS apellido_1_contacto,
      c.apellido2 AS apellido_2_contacto,
      ed.nombre AS nombre_edificio

    FROM 
      obras AS o
    
    LEFT JOIN
      empresas AS e ON o.id_empresa = e.id_empresa
    
    LEFT JOIN
      tipoobra AS tipoO ON o.tipo_obra = tipoO.id_tipo
    
    LEFT JOIN
      tipoestadosobras AS te ON o.estado_obra = te.codigo_estado

    LEFT JOIN
      tipofacturable AS tf ON o.facturable = tf.id_tipo
    
    LEFT JOIN
      usuarios AS u ON o.codigo_usuario_alta = u.codigo_usuario
    
    LEFT JOIN
      contactos AS c ON o.id_contacto = c.id_contacto
    
    LEFT JOIN
      edificios AS ed ON o.id_edificio = ed.id_edificio

    WHERE o.id_obra = ?`;

    const [result] = await db.query(query, [idObra]);
    return result;
  }

  static async getByDescripcion({ descripcionObra }) {
    const query = `
    SELECT
      id_obra,
      codigo_obra,
      descripcion_obra
    FROM
      obras
    WHERE
      descripcion_obra LIKE CONCAT('%', ?, '%')`;

    const [result] = await db.query(query, descripcionObra);
    return result;
  }

  static async create({ input }) {
    const validatedData = validateObra(input);

    if (!validatedData.success) {
      throw new ValidationError(
        "Obra con formato inválido",
        validatedData.error.issues
      );
    }

    // Extraemos la info
    const validData = validatedData.data;
    // Extraemos propiedades de la información validada
    const values = Object.values(validData);

    // Query
    const query = `
    INSERT INTO obras (
        codigo_obra,
        descripcion_obra,
        fecha_seg,
        descripcion_seg,
        tipo_obra,
        facturable,
        estado_obra,
        fecha_alta,
        codigo_usuario_alta,
        fecha_prevista_fin,
        fecha_oferta,
        horas_previstas,
        gasto_previsto,
        importe,
        viabilidad,
        id_empresa,
        id_contacto,
        id_edificio,
        observaciones,
        observaciones_internas,
        version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    const [result] = await db.query(query, [...values]);

    // Seleccionamos el registro recién insertado y que vamos a devolver
    // como resultado de la operación de creación
    const [rows] = await db.query(
      `
       SELECT
        id_obra,
        codigo_obra,
        descripcion_obra,
        fecha_seg,
        tipo_obra,
        facturable,
        estado_obra,
        fecha_alta,
        codigo_usuario_alta,
        fecha_prevista_fin,
        fecha_oferta,
        horas_previstas,
        gasto_previsto,
        importe,
        viabilidad,
        id_empresa,
        id_contacto,
        id_edificio,
        observaciones,
        observaciones_internas
      FROM obras
      WHERE id_obra = ?`,
      [result.insertId]
    );
    return rows[0] ?? null;
  }

  static async update({ idObra, input }) {
    const updatedInfo = validatePartialObra(input);

    if (!updatedInfo.success) {
      throw new ValidationError(
        "Obra con formato inválido",
        updatedInfo.error.issues
      );
    }

    const valid = updatedInfo.data;

    if (Object.keys(valid).length === 0) {
      const error = new Error("No fields provided for update");
      error.name = "EmptyUpdateError";
      throw error;
    }

    const fields = Object.keys(valid)
      .map((key) => {
        switch (key) {
          case "cod":
            return "codigo_obra = ?";
          case "desc":
            return "descripcion_obra = ?";
          case "fechaSeg":
            return "fecha_seg = ?";
          case "descSeg":
            return "descripcion_seg = ?";
          case "tipoObra":
            return "tipo_obra = ?";
          case "facturable":
            return "facturable = ?";
          case "estadoObra":
            return "estado_obra = ?";
          case "fechaAlta":
            return "fecha_alta = ?";
          case "usuarioAlta":
            return "codigo_usuario_alta = ?";
          case "fechaFin":
            return "fecha_prevista_fin = ?";
          case "fechaOferta":
            return "fecha_oferta = ?";
          case "horasPrevistas":
            return "horas_previstas = ?";
          case "gastoPrevisto":
            return "gasto_previsto = ?";
          case "importe":
            return "importe = ?";
          case "viabilidad":
            return "viabilidad = ?";
          case "empresa":
            return "id_empresa = ?";
          case "contacto":
            return "id_contacto = ?";
          case "edificio":
            return "id_edificio = ?";
          case "observaciones":
            return "observaciones = ?";
          case "observacionesInternas":
            return "observaciones_internas = ?";
        }
      })
      .join(", ");

    const values = Object.values(valid);

    await db.query(
      `UPDATE obras
      SET  ${fields}
      WHERE id_obra = ?`,
      [...values, idObra]
    );

    const [rows] = await db.query(
      `
       SELECT *
      FROM obras
      WHERE id_obra = ?`,
      [idObra]
    );
    return rows[0] ?? null;
  }

  // TEMPORAL -> De momento el usuario por defecto que da de bajas las obras
  // es el usuario 67 (andres_abaco)
  static async delete({ idObra, codigoUsuarioBaja = 67 } = {}) {
    const query = `
    UPDATE obras
    SET
      fecha_baja = NOW(),
      codigo_usuario_baja = ?
    WHERE id_obra = ?
    `;

    const [result] = await db.query(query, [codigoUsuarioBaja, idObra]);

    if (result.affectedRows === 0) {
      return null;
    }
    const [rows] = await db.query(
      `
       SELECT
        codigo_obra,
        descripcion_obra,
        fecha_baja,
        codigo_usuario_baja
      FROM obras
      WHERE id_obra = ?`,
      [idObra]
    );
    return rows[0] ?? null;
  }
}
