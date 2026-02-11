import { db } from "../config/database.js";

export class RelacionObraModel {
  static async getObraPadre({ idObra }) {
    return (
      db("relacionobras as r")
        .select(
          "r.id_obraPadre",
          "o.codigo_obra",
          "o.descripcion_obra",
        )
        .leftJoin("obras as o", "r.id_obraPadre", "o.id_obra")
        .where("r.id_obraHija", idObra)
        .first() ?? null
    );
  }

  static async getObrasHijas({ idObra }) {
    return db("relacionobras as r")
      .select(
        "r.id_obraHija",
        "o.codigo_obra",
        "o.descripcion_obra",
        "o.horas_previstas",
        "o.gasto_previsto",
        "o.importe",
      )
      .leftJoin("obras as o", "r.id_obraHija", "o.id_obra")
      .where("r.id_obraPadre", idObra);
  }

  static async deleteRelacionesPadre({ idObraHija }) {
    await db("relacionobras").where("id_obraHija", idObraHija).del();
  }

  static async insertRelacionPadre({ idObraPadre, idObraHija }) {
    await db("relacionobras").insert({
      id_obraPadre: idObraPadre,
      id_obraHija: idObraHija,
    });

    return (
      db("relacionobras")
        .where("id_obraPadre", idObraPadre)
        .andWhere("id_obraHija", idObraHija)
        .first() ?? null
    );
  }

  static async deleteRelacionesHijas({ idObraPadre }) {
    await db("relacionobras").where("id_obraPadre", idObraPadre).del();
  }

  static async insertRelacionesHijas({ idObraPadre, idsObrasHijas }) {
    const rows = idsObrasHijas.map((idHija) => ({
      id_obraPadre: idObraPadre,
      id_obraHija: idHija,
    }));

    await db("relacionobras").insert(rows);

    return db("relacionobras").where("id_obraPadre", idObraPadre);
  }
}
