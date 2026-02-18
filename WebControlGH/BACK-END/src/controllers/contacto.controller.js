import { ContactoService } from "../services/contacto.service.js";

export class ContactoController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await ContactoService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }


  static async create(req, res, next) {
    try {
      const contactoData = req.body;
      const nuevoContacto = await ContactoService.create(contactoData);
      res.status(201).json({
        success: true,
        message: "Contacto creado exitosamente",
        data: nuevoContacto,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idContacto } = req.params;
      const updateData = req.body;
      const contactoActualizado = await ContactoService.update(
        idContacto,
        updateData,
      );
      res.json({
        success: true,
        message: "Contacto actualizado exitosamente",
        data: contactoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idContactos } = req.body;
      const contactosEliminados = await ContactoService.delete(idContactos);
      res.json({
        success: true,
        message: "Contacto(s) eliminado(s) exitosamente",
        data: contactosEliminados,
      });
    } catch (error) {
      next(error);
    }
  }
}
