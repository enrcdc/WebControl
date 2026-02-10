import { pool } from "../config/database.js";

export class AlmacenModel {
  static async getAll() {
    const query = `
      SELECT
        a.id,
        a.codigo,
        a.descripcion,
        a.etiqueta,
        p.NombreProveedor,
        a.fecha_alta,
        f.etiqueta AS etiqueta_familia,
        m.etiqueta AS etiqueta_marca,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta AS etiqueta_unidad,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total
      FROM almacen AS a
      LEFT JOIN proveedores AS p ON a.id_proveedor = p.id
      LEFT JOIN familias AS f ON a.id_familia = f.id
      LEFT JOIN marcas AS m ON a.id_marca = m.id
      LEFT JOIN tipounidad AS tu ON a.id_tipounidad = tu.id
      ORDER BY a.descripcion`;

    const [result] = await pool.query(query);
    return result;
  }

  static async getById({ id }) {
    const query = `
      SELECT
        a.id,
        a.codigo,
        a.descripcion,
        a.etiqueta,
        p.NombreProveedor,
        a.fecha_alta,
        f.etiqueta AS etiqueta_familia,
        m.etiqueta AS etiqueta_marca,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta AS etiqueta_unidad,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total,
        a.observaciones,
        a.fecha_baja
      FROM almacen AS a
      LEFT JOIN proveedores AS p ON a.id_proveedor = p.id
      LEFT JOIN familias AS f ON a.id_familia = f.id
      LEFT JOIN marcas AS m ON a.id_marca = m.id
      LEFT JOIN tipounidad AS tu ON a.id_tipounidad = tu.id
      WHERE a.id = ?`;

    const [rows] = await pool.query(query, [id]);
    return rows[0] ?? null;
  }

  static async getByDescripcion({ descripcion }) {
    const query = `
      SELECT id, descripcion
      FROM almacen
      WHERE descripcion LIKE CONCAT('%', ?, '%')`;

    const [result] = await pool.query(query, [descripcion]);
    return result;
  }

  static async create({ input }) {
    const insertQuery = `
      INSERT INTO almacen (
        codigo,
        descripcion,
        etiqueta,
        id_proveedor,
        id_familia,
        id_tipounidad,
        fecha_alta,
        codigo_usuario_alta,
        stock,
        stock_min,
        stock_max,
        id_marca,
        precio_unitario,
        precio_total,
        observaciones
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      input.cod,
      input.descripcion,
      input.etiqueta,
      input.proveedor,
      input.familia,
      input.tipoUnidad,
      input.fechaAlta,
      input.usuarioAlta,
      input.stock,
      input.stockMin,
      input.stockMax,
      input.marca,
      input.precioUnitario,
      input.precioTotal,
      input.observaciones,
    ];

    const [result] = await pool.query(insertQuery, values);

    const [rows] = await pool.query(
      "SELECT * FROM almacen WHERE id = ?",
      [result.insertId],
    );

    return rows[0] ?? null;
  }

  static async update({ id, input }) {
    const query = `
      UPDATE almacen SET
        codigo = ?,
        descripcion = ?,
        etiqueta = ?,
        id_proveedor = ?,
        id_familia = ?,
        id_tipounidad = ?,
        fecha_alta = ?,
        codigo_usuario_alta = ?,
        stock = ?,
        stock_min = ?,
        stock_max = ?,
        id_marca = ?,
        precio_unitario = ?,
        precio_total = ?,
        observaciones = ?
      WHERE id = ?`;

    const values = [
      input.cod,
      input.descripcion,
      input.etiqueta,
      input.proveedor,
      input.familia,
      input.tipoUnidad,
      input.fechaAlta,
      input.usuarioAlta,
      input.stock,
      input.stockMin,
      input.stockMax,
      input.marca,
      input.precioUnitario,
      input.precioTotal,
      input.observaciones,
    ];

    await pool.query(query, [...values, id]);

    const [rows] = await pool.query(
      "SELECT * FROM almacen WHERE id = ?",
      [id],
    );

    return rows[0] ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ id, codigoUsuarioBaja = 67 }) {
    const query = `
      UPDATE almacen
      SET
        fecha_baja = NOW(),
        codigo_usuario_baja = ?
      WHERE id = ?`;

    await pool.query(query, [codigoUsuarioBaja, id]);

    const [rows] = await pool.query(
      `SELECT id, codigo, descripcion, fecha_baja, codigo_usuario_baja
       FROM almacen
       WHERE id = ?`,
      [id],
    );

    return rows[0] ?? null;
  }
}
