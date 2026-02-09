import { pool } from "../config/database.js";
import {
  validateFactura,
  validatePartialFactura,
} from "../validations/facturasValidator.js";
import { ValidationError } from "../validations/ValidationError.js";

export class FacturaCompraModel {
  static async getAll() {
    const [results] = await pool.query(
      `SELECT 
            f.id,
            f.id_obra,
            o.codigo_obra AS codigo_obra,
            fc.Concepto AS concepto,
            f.id_facturascompras,
            fc.numero AS num_factura,
            f.importe,
            f.fecha_alta,
            f.codigo_usuario_alta,
            f.fecha_actualizacion,
            f.fecha_baja,
            f.codigo_usuario_baja,
            f.observaciones,
            f.version
            FROM facturascompras_obra f
            LEFT JOIN obras o ON f.id_obra = o.id_obra
            LEFT JOIN facturascompras fc ON f.id_facturascompras = fc.id`
    );
    return results;
  }

  static async getByObra({ idObra }) {
    const query = `
        SELECT
        fo.*,
        fc.Numero,
        fc.Concepto,
        u.codigo_firma
        FROM facturascompras_obra AS fo
        LEFT JOIN facturascompras fc ON fo.id_facturascompras = fc.id
        LEFT JOIN usuarios AS u ON fo.codigo_usuario_alta = u.codigo_usuario
        WHERE fo.id_obra = ? AND fo.fecha_baja IS NULL`;

    const [result] = await pool.query(query, [idObra]);
    return result;
  }

  static async getById({ id }) {
    const [result] = await pool.query(
      `SELECT 
                importe, fecha_alta, codigo_usuario_alta, fecha_actualizacion, fecha_baja, 
                codigo_usuario_baja, observaciones, version 
            FROM facturascompras_obra WHERE id = ?`,
      [id]
    );
    return result[0] ?? null;
  }

  static async getByConcepto({ concepto }) {
    const query = `
		SELECT
		id,
		Numero,
		Concepto
		FROM
		facturascompras
		WHERE
		Concepto LIKE CONCAT('%', ?, '%')`;

    const [result] = await pool.query(query, concepto);
    return result;
  }

  static async create({ input }) {
    const validatedData = validateFactura(input);

    if (!validatedData.success) {
      throw new ValidationError(
        "Factura con formacto inválido",
        validatedData.error.issues
      );
    }

    const validData = validatedData.data;
    const data = [
      validData.idObra,
      validData.idFacturasCompras,
      validData.importe,
      validData.fechaAlta,
      validData.codigoUsuarioAlta,
      validData.fechaActualizacion,
      validData.fechaBaja,
      validData.codigoUsuarioBaja,
      validData.observaciones,
      validData.version,
    ];

    const [result] = await pool.query(
      `INSERT INTO facturascompras_obra (
            id_obra, id_facturascompras, importe, fecha_alta, codigo_usuario_alta, 
            fecha_actualizacion, fecha_baja, codigo_usuario_baja, observaciones, version
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      data
    );

    // Seleccionar el registro recién insertado
    const [rows] = await pool.query(
      `SELECT id, id_obra, id_facturascompras, importe, fecha_alta, codigo_usuario_alta, 
                fecha_actualizacion, fecha_baja, codigo_usuario_baja, observaciones, version
         FROM facturascompras_obra
         WHERE id = ?`,
      [result.insertId]
    );
    return rows[0] ?? null;
  }

  static async update({ id, input }) {
    const parsed = validatePartialFactura(input);
    if (!parsed.success) {
      const error = new Error("Validation failed");
      error.name = "ValidationError";
      error.details = parsed.error.format();
      throw error;
    }

    const valid = parsed.data;

    if (Object.keys(valid).length === 0) {
      const error = new Error("No fields provided for update");
      error.name = "EmptyUpdateError";
      throw error;
    }

    const fields = Object.keys(valid)
      .map((key) => {
        switch (key) {
          case "idObra":
            return "id_obra = ?";
          case "idFacturasCompras":
            return "id_facturascompras = ?";
          case "fechaAlta":
            return "fecha_alta = ?";
          case "codigoUsuarioAlta":
            return "codigo_usuario_alta = ?";
          case "fechaActualizacion":
            return "fecha_actualizacion = ?";
          case "fechaBaja":
            return "fecha_baja = ?";
          case "codigoUsuarioBaja":
            return "codigo_usuario_baja = ?";
          default:
            return `${key.toLowerCase()} = ?`;
        }
      })
      .join(", ");

    const values = Object.values(valid);

    await pool.query(
      `UPDATE facturascompras_obra 
             SET ${fields}
             WHERE id = ?`,
      [...values, id]
    );

    const [rows] = await pool.query(
      `SELECT id, id_obra, id_facturascompras, importe, fecha_alta, codigo_usuario_alta,
                    fecha_actualizacion, fecha_baja, codigo_usuario_baja, observaciones, version
             FROM facturascompras_obra
             WHERE id = ?`,
      [id]
    );

    return rows[0] ?? null;
  }

  static async delete({ id, codigoUsuarioBaja = 67 } = {}) {
    const [result] = await pool.query(
      `UPDATE facturascompras_obra 
         SET fecha_baja = NOW(), codigo_usuario_baja = ?
         WHERE id = ?`,
      [codigoUsuarioBaja, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const [rows] = await pool.query(
      `SELECT id, id_obra, id_facturascompras, importe, fecha_alta, codigo_usuario_alta,
                fecha_actualizacion, fecha_baja, codigo_usuario_baja, observaciones, version
         FROM facturascompras_obra
         WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }
}
