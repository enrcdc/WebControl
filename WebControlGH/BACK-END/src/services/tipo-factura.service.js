import { TipoFacturaModel } from "../models/tipo-factura.js";

export class TipoFacturaService {
  static async getAll() {
    const tipos = await TipoFacturaModel.getAll();
    return tipos;
  }
}
