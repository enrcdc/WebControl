import { EdificioModel } from "../models/edificioModel.mjs";

export class EdificioController {
  static async getAll(req, res, next) {
    try {
      const edificios = await EdificioModel.getAll();
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }

  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.params;
      const edificios = await EdificioModel.getByNombre({ nombre });
      res.status(200).json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }
}
