import { ContactoModel } from "../models/contacto.model.js";

export class ContactoController {
  static async getAll(req, res, next) {
    try {
      const contactos = await ContactoModel.getAll();
      res.json({ success: true, data: contactos });
    } catch (error) {
      next(error);
    }
  }
  static async getByEmpresa(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const contactos = await ContactoModel.getByEmpresa({ idEmpresa });
      res.json({ success: true, data: contactos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const contactoCreado = await ContactoModel.create(input);
      res.status(201).json({ success: true, data: contactoCreado });
    } catch (error) {
      next(error);
    }
  }
}
