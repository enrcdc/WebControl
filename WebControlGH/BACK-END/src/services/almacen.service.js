import { AlmacenModel } from "../models/almacen.model.js";
import { NotFoundError, AlreadyDeletedError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class AlmacenService {
  static async getAll(filters = {}) {
    const { data, pagination } = await AlmacenModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Productos",
        null,
        "No hay productos registrados en el sistema",
      );
    }

    return { data, pagination };
  }

  static async create(productoData) {
    validateNotEmpty(productoData, "datos del producto");

    const nuevoProducto = await AlmacenModel.create({ input: productoData });

    if (!nuevoProducto) {
      throw new Error("Error al crear el producto");
    }

    return nuevoProducto;
  }

  static async update(id, updateData) {
    const validId = validateId(id, "ID de producto");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getProductoOrFail(validId);

    const productoActualizado = await AlmacenModel.update({
      id: validId,
      input: updateData,
    });

    if (!productoActualizado) {
      throw new NotFoundError("Producto", id);
    }

    return productoActualizado;
  }

  static async delete(id, codigoUsuarioBaja) {
    const validId = validateId(id, "ID de producto");

    const producto = await this._getProductoOrFail(validId, false);

    if (producto.fecha_baja) {
      throw new AlreadyDeletedError("Producto", id);
    }

    const productoEliminado = await AlmacenModel.delete({
      id: validId,
      codigoUsuarioBaja,
    });

    if (!productoEliminado) {
      throw new NotFoundError("Producto", id);
    }

    return productoEliminado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getProductoOrFail(id, checkDeleted = true) {
    const producto = await AlmacenModel.getById({ id });

    if (!producto) {
      throw new NotFoundError("Producto", id);
    }

    if (checkDeleted && producto.fecha_baja) {
      throw new AlreadyDeletedError("Producto", id);
    }

    return producto;
  }
}
