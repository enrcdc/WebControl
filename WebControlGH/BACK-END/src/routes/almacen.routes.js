import { Router } from "express";
import { AlmacenController } from "../controllers/almacen.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const almacenRouter = Router();

almacenRouter.get("/", AlmacenController.getAll);
almacenRouter.get("/:idProducto", AlmacenController.getById);
almacenRouter.get("/buscar/descripcion", AlmacenController.getByDescripcion);
almacenRouter.post("/", AlmacenController.create);
almacenRouter.put("/:idProducto", AlmacenController.update);
almacenRouter.delete("/:idProducto", AlmacenController.delete);

almacenRouter.use(errorHandler);

export default almacenRouter;
