import { Router } from "express";
import { TipoGastoController } from "../controllers/tipo-gasto.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createTipoGastoSchema,
  updateTipoGastoSchema,
} from "../validations/tipogastoValidator.js";

export const tipoGastoRouter = Router();

tipoGastoRouter.get("/", TipoGastoController.getAll);
tipoGastoRouter.post("/filtrar", TipoGastoController.filtrar);
tipoGastoRouter.get("/:idTipoGasto", TipoGastoController.getById);
tipoGastoRouter.post(
  "/",
  validate(createTipoGastoSchema),
  TipoGastoController.create,
);
tipoGastoRouter.patch(
  "/:idTipoGasto",
  validate(updateTipoGastoSchema),
  TipoGastoController.update,
);
tipoGastoRouter.delete("/", TipoGastoController.delete);

export default tipoGastoRouter;
