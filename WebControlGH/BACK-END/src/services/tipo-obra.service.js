import { TipoObraModel } from "../models/tipo-obra.model.js";

export class TipoObraService {
  static async getAll() {
    const tipos = await TipoObraModel.getAll();
    return tipos;
  }
}
