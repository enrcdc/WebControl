import { RelacionObraModel } from "../models/relacion-obra.model.js";
import { InvalidDataError } from "../errors/index.js";
import { validateId } from "../utils/index.js";

export class RelacionObraService {
  static async getObraPadre(idObra) {
    const validId = validateId(idObra, "ID de obra");

    const obraPadre = await RelacionObraModel.getObraPadre({ idObra: validId });
    return obraPadre;
  }

  static async getObrasHijas(idObra) {
    const validId = validateId(idObra, "ID de obra");

    const obrasHijas = await RelacionObraModel.getObrasHijas({
      idObra: validId,
    });
    return obrasHijas;
  }

  static async setObraPadre(idObraPadre, idObraHija) {
    const validIdHija = validateId(idObraHija, "ID de obra hija");

    await RelacionObraModel.deleteRelacionesPadre({ idObraHija: validIdHija });

    if (!idObraPadre) {
      return null;
    }

    const validIdPadre = validateId(idObraPadre, "ID de obra padre");

    if (validIdPadre === validIdHija) {
      throw new InvalidDataError(
        "Una obra no puede ser padre de sí misma",
        { field: "idObraPadre", value: idObraPadre },
      );
    }

    const relacion = await RelacionObraModel.insertRelacionPadre({
      idObraPadre: validIdPadre,
      idObraHija: validIdHija,
    });

    return relacion;
  }

  static async setObrasHijas(idObraPadre, idsObrasHijas) {
    const validIdPadre = validateId(idObraPadre, "ID de obra padre");

    await RelacionObraModel.deleteRelacionesHijas({
      idObraPadre: validIdPadre,
    });

    if (!Array.isArray(idsObrasHijas) || idsObrasHijas.length === 0) {
      return [];
    }

    if (idsObrasHijas.includes(validIdPadre)) {
      throw new InvalidDataError(
        "Una obra no puede ser hija de sí misma",
        { field: "idsObrasHijas", value: idsObrasHijas },
      );
    }

    const relaciones = await RelacionObraModel.insertRelacionesHijas({
      idObraPadre: validIdPadre,
      idsObrasHijas,
    });

    return relaciones;
  }
}
