import { Router } from "express";
import { AlmacenController } from "../controllers/almacen.controller.js";
import { validate } from "../middlewares/validate.js";
import { createProductoSchema, updateProductoSchema } from "../validations/productoValidator.js";

export const almacenRouter = Router();

almacenRouter.get("/", AlmacenController.getAll);
almacenRouter.post("/", validate(createProductoSchema), AlmacenController.create);
almacenRouter.patch("/:idProducto", validate(updateProductoSchema), AlmacenController.update);
almacenRouter.delete("/:idProducto", AlmacenController.delete);

export default almacenRouter;
