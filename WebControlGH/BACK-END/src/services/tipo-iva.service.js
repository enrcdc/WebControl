import { TipoIvaModel } from "../models/tipo-iva.js";

export class TipoIvaService {
  static async getAll() {
    return TipoIvaModel.getAll();
  }
}
