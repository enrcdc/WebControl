import { ContactoService } from "../services/contacto.service.js";

export class ContactoController {
  static async getAll(req, res, next) {
    try {
      const contactos = await ContactoService.getAll();
      res.json({ success: true, data: contactos });
    } catch (error) {
      next(error);
    }
  }

  static async getByEmpresa(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const contactos = await ContactoService.getByEmpresa(idEmpresa);
      res.json({ success: true, data: contactos });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const contactos = await ContactoService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: contactos,
        count: contactos.length,
        filtros: filtros,
      });
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
