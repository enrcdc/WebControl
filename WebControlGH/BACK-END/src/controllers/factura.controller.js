import { FacturasModel } from "../models/factura.model.js";

export class FacturasController {
	static async getAll(req, res, next) {
		try {
			const facturas = await FacturasModel.getAll();
			res.json({ success: true, data: facturas });
		} catch (error) {
			next(error);
		}
	}

	static async getByObra(req, res, next) {
		try {
			const { idObra } = req.params;
			const facturas = await FacturasModel.getByObra({
				idObra: Number(idObra),
			});
			res.json({ success: true, data: facturas });
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const factura = await FacturasModel.getById({ id: Number(id) });

			if (!factura) {
				const error = new Error("Factura no encontrada");
				error.name = "NotFoundError";
				throw error;
			}
			res.json({ success: true, data: factura });
		} catch (error) {
			next(error);
		}
	}

	static async getByConcepto(req, res, next) {
		try {
			const { concepto } = req.query;
			const facturas = await FacturasModel.getByConcepto({ concepto });
			res.json({ success: true, data: facturas });
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const input = req.body;
			const nuevaFactura = await FacturasModel.create({ input });
			res.status(201).json({ success: true, data: nuevaFactura });
		} catch (error) {
			next(error);
		}
	}

	static async update(req, res, next) {
		try {
			const { id } = req.params;
			const input = req.body;

			const facturaActualizada = await FacturasModel.update({
				id: Number(id),
				input,
			});

			if (!facturaActualizada) {
				const error = new Error("Factura no encontrada o no actualizada");
				error.name = "NotFoundError";
				throw error;
			}
			res.json({ success: true, data: facturaActualizada });
		} catch (error) {
			next(error);
		}
	}

	static async delete(req, res, next) {
		try {
			const { id } = req.params;
			const { codigoUsuarioBaja } = req.body;

			if (!codigoUsuarioBaja) {
				const error = new Error("codigoUsuarioBaja es requerido para eliminar");
				error.name = "ValidationError";
				throw error;
			}
			const facturaEliminada = await FacturasModel.delete({
				id: Number(id),
				codigoUsuarioBaja,
			});

			if (!facturaEliminada) {
				const error = new Error("Factura no encontrada o ya eliminada");
				error.name = "NotFoundError";
				throw error;
			}
			res.json({ success: true, data: facturaEliminada });
		}
		catch (error) {
			next(error);
		}
	}
}