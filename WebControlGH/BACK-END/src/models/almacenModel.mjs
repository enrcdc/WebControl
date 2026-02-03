import db from "../database.js";
import {
  validateProducto,
  validatePartialProducto,
} from "../validations/productoValidator.mjs";
import { ValidationError } from "../validations/ValidationError.mjs";

// MODELO DE NEGOCIO PARA LOS PRODUCTOS DEL ALMACÉN

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
        f.etiqueta,
        m.etiqueta,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total
    FROM
        almacen AS a
    LEFT JOIN
        proveedores AS p ON a.id_proveedor = p.id
    LEFT JOIN
        familias AS f ON a.id_familia = f.id
    LEFT JOIN
        marcas AS m ON a.id_marca = m.id
    LEFT JOIN
        tipounidad AS tu ON a.id_tipounidad = tu.id
    ORDER BY a.descripcion
  `;

    const [result] = await db.query(query);
    return result;
  }

  static async getById({ idProducto }) {
    const query = `
    SELECT
        a.id,
        a.codigo,
        a.descripcion,
        a.etiqueta,
        p.NombreProveedor,
        a.fecha_alta,
        f.etiqueta,
        m.etiqueta,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total,
        a.observaciones
    FROM
        almacen AS a
    LEFT JOIN
        proveedores AS p ON a.id_proveedor = p.id
    LEFT JOIN
        familias AS f ON a.id_familia = f.id
    LEFT JOIN
        marcas AS m ON a.id_marca = m.id
    LEFT JOIN
        tipounidad AS tu ON a.id_tipounidad = tu.id
    WHERE a.id = ?
  `;
    const [result] = await db.query(query, [idProducto]);
    return result;
  }

  static async getByDescripcion({ descripcion }) {
    const query = `
    SELECT
      id,
      descripcion
    FROM
      almacen
    WHERE
      descripcion LIKE CONCAT('%', ?, '%')`;

    const [result] = await db.query(query, descripcion);
    return result;
  }

  static async create({ input }) {
    const validatedProducto = validateProducto(input);

    if (!validatedProducto.success) {
      throw new ValidationError(
        "Producto con formato inválido",
        validatedProducto.error.issues
      );
    }

    const validData = validatedProducto.data;
    const values = Object.values(validData);

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
    observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Con mysql2/promise el resultado de db.query(...) devuelve dos elementos:
    // -> 1º El array de resultados (filas de la consulta)
    // ->2º Metadatos: Información adicional sobre la consulta

    // El principio de desestructuración de JS es posicional, no nombrado.
    // Con esto extraemos el resultado de la consulta
    const [result] = await db.query(insertQuery, values);

    // Mostramos el producto recién almacenado
    const [rows] = await db.query(
      `
        SELECT *
        FROM almacen
        WHERE id = ?
        `,
      [result.insertId]
    );

    return rows[0] ?? null;
  }

  static async update({ idProducto, input }) {
    const updatedInfo = validateProducto(input);

    if (!updatedInfo.success) {
      throw new ValidationError(
        "Producto con formato inválido",
        updatedInfo.error.issues
      );
    }

    const valid = updatedInfo.data;
    const values = Object.values(valid);

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

    await db.query(query, [...values, idProducto]);
    const [rows] = await db.query(
      `
        SELECT
            codigo, 
            etiqueta, 
            descripcion, 
            fecha_alta, 
            codigo_usuario_alta, 
            id_proveedor, 
            id_familia, 
            id_marca, 
            id_tipounidad, 
            precio_unitario, 
            stock_min, 
            stock_max, 
            observaciones
        FROM almacen
        WHERE id = ?`,
      [idProducto]
    );

    return rows[0] ?? null;
  }

  static async delete({ idProducto, codigoUsuarioBaja }) {
    const query = `
    UPDATE almacen
    SET
      fecha_baja = NOW(),
      codigo_usuario_baja = ?
    WHERE id = ?
    `;

    const [result] = await db.query(query, [codigoUsuarioBaja, idProducto]);

    if (result.affectedRows === 0) {
      return null;
    }
    const [rows] = await db.query(
      `
       SELECT
        codigo,
        descripcion,
        fecha_baja,
        codigo_usuario_baja
      FROM almacen
      WHERE id = ?`,
      [idProducto]
    );
    return rows[0] ?? null;
  }
}
