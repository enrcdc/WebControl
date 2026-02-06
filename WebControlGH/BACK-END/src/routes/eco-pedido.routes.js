import { Router } from "express";
import { EcoPedidoController } from "../controllers/eco-pedido.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const ecoPedidoRouter = Router();

ecoPedidoRouter.post("/buscar", EcoPedidoController.getByObras);
ecoPedidoRouter.post("/", EcoPedidoController.create);
ecoPedidoRouter.put("/:idPedido", EcoPedidoController.update);
ecoPedidoRouter.delete("/:idPedido", EcoPedidoController.delete);

ecoPedidoRouter.use(errorHandler);

export default ecoPedidoRouter;
