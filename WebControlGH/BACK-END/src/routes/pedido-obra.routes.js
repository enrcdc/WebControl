import { Router } from "express";
import { PedidoObraController } from "../controllers/pedido-obra.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createPedidoObraSchema,
  updatePedidoObraSchema,
} from "../validations/pedidoObraValidator.js";

const pedidoObraRouter = Router();

pedidoObraRouter.get("/", PedidoObraController.getAll);
pedidoObraRouter.get("/:idPedido", PedidoObraController.getById);
pedidoObraRouter.post("/filtrar", PedidoObraController.filtrar);
pedidoObraRouter.post(
  "/",
  validate(createPedidoObraSchema),
  PedidoObraController.create,
);
pedidoObraRouter.patch(
  "/:idPedido",
  validate(updatePedidoObraSchema),
  PedidoObraController.update,
);
pedidoObraRouter.delete("/", PedidoObraController.deleteMany);
pedidoObraRouter.delete("/:idPedido", PedidoObraController.delete);

export default pedidoObraRouter;
