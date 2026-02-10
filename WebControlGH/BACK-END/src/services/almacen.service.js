import { AlmacenModel } from "../models/almacen.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class AlmacenService {
  static async getAll() {
    const productos = await AlmacenModel.getAll();
    return productos;
  }

  static async getById(id) {
    const validId = validateId(id, "ID de producto");

    const producto = await AlmacenModel.getById({ id: validId });

    if (!producto) {
      throw new NotFoundError("Producto", id);
    }

    if (producto.fecha_baja) {
      throw new AlreadyDeletedError("Producto", id);
    }

    return producto;
  }

  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getByDescripcion(descripcion) {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new InvalidDataError("La descripción de búsqueda es obligatoria", {
        field: "descripcion",
      });
    }

    const productos = await AlmacenModel.getByDescripcion({ descripcion });
    return productos;
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

  static async buscarConFiltros(filtros) {
    let productos = await AlmacenModel.getAll();

    if (filtros.descripcion) {
      productos = productos.filter((p) =>
        p.descripcion
          ?.toLowerCase()
          .includes(filtros.descripcion.toLowerCase()),
      );
    }

    if (filtros.codigo) {
      productos = productos.filter((p) =>
        p.codigo?.toLowerCase().includes(filtros.codigo.toLowerCase()),
      );
    }

    if (filtros.proveedor) {
      productos = productos.filter((p) =>
        p.NombreProveedor?.toLowerCase().includes(
          filtros.proveedor.toLowerCase(),
        ),
      );
    }

    if (filtros.familia) {
      productos = productos.filter((p) =>
        p.etiqueta_familia
          ?.toLowerCase()
          .includes(filtros.familia.toLowerCase()),
      );
    }

    if (filtros.unidades) {
      productos = productos.filter((p) =>
        p.etiqueta_unidad
          ?.toLowerCase()
          .includes(filtros.unidades.toLowerCase()),
      );
    }

    if (filtros.marca) {
      productos = productos.filter((p) =>
        p.etiqueta_marca?.toLowerCase().includes(filtros.marca.toLowerCase()),
      );
    }

    if (filtros.porDebajoMinimo !== undefined) {
      productos = filtros.porDebajoMinimo
        ? productos.filter((p) => p.stock < p.stock_min)
        : productos.filter((p) => p.stock >= p.stock_min);
    }

    if (filtros.porEncimaMaximo !== undefined) {
      productos = filtros.porEncimaMaximo
        ? productos.filter((p) => p.stock > p.stock_max)
        : productos.filter((p) => p.stock <= p.stock_max);
    }

    return productos;
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
