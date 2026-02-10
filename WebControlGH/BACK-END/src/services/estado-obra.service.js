import { EstadoObraModel } from "../models/estado-obra.model.js";

export class EstadoObraService {
  static async getAll() {
    const estados = await EstadoObraModel.getAll();
    return estados;
  }
}
