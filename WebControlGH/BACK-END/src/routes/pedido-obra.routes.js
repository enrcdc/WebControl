import { Router } from "express";
import { PedidoObraController } from "../controllers/pedido-obra.controller.js";

const pedidoObraRouter = Router();

pedidoObraRouter.get("/", PedidoObraController.getAll);
pedidoObraRouter.post("/filtrar", PedidoObraController.filtrar);
pedidoObraRouter.post("/", PedidoObraController.create);
pedidoObraRouter.patch("/:idPedido", PedidoObraController.update);
pedidoObraRouter.delete("/:idPedido", PedidoObraController.delete);

export default pedidoObraRouter;
