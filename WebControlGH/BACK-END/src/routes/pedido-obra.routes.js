import { Router } from "express";
import { PedidoObraController } from "../controllers/pedido-obra.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const pedidoObraRouter = Router();

pedidoObraRouter.post("/filtrar", PedidoObraController.buscarConFiltros);
pedidoObraRouter.post("/buscar", PedidoObraController.getByObras);
pedidoObraRouter.post("/", PedidoObraController.create);
pedidoObraRouter.patch("/:idPedido", PedidoObraController.update);
pedidoObraRouter.delete("/:idPedido", PedidoObraController.delete);

pedidoObraRouter.use(errorHandler);

export default pedidoObraRouter;
