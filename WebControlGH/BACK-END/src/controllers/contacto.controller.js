import { ContactoService } from "../services/contacto.service.js";

export class ContactoController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const contactos = await ContactoService.getAll(filters);
      res.json({ success: true, data: contactos });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByEmpresa(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const contactos = await ContactoService.getByEmpresa(idEmpresa);
      res.json({ success: true, data: contactos });
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
}
