import { TipoFacturableModel } from "../models/tipo-facturable.model.js";

export class TipoFacturableService {
  static async getAll() {
    const tipos = await TipoFacturableModel.getAll();
    return tipos;
  }
}
