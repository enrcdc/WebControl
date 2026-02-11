import { Router } from "express";
import { AlmacenController } from "../controllers/almacen.controller.js";

export const almacenRouter = Router();

almacenRouter.get("/", AlmacenController.getAll);
almacenRouter.post("/", AlmacenController.create);
almacenRouter.patch("/:idProducto", AlmacenController.update);
almacenRouter.delete("/:idProducto", AlmacenController.delete);

export default almacenRouter;
