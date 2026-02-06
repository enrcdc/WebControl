import express from "express";
import cors from "cors";

// Enrutadores
import almacenRouter from "./routes/almacen.routes.js";
import facturasRouter from "./routes/factura.routes.js";
import contactoRouter from "./routes/contacto.routes.js";
import edificioRouter from "./routes/edificio.routes.js";
import empresaRouter from "./routes/empresa.routes.js";
import estadoObraRouter from "./routes/estado-obra.routes.js";
import tiposFacRouter from "./routes/tipo-facturable.routes.js";
import tiposObRouter from "./routes/tipo-obra.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import relacionObrasRouter from "./routes/relacion-obra.routes.js";
import obraRouter from "./routes/obra.routes.js";
import rentabilidadRouter from "./routes/rentabilidad.routes.js";
import ecoFacturaRouter from "./routes/eco-factura.routes.js";
import ecoPedidoRouter from "./routes/eco-pedido.routes.js";
import gastoRouter from "./routes/gasto.routes.js";
import horasRouter from "./routes/hora.routes.js";
import movimientosAlmacenRouter from "./routes/movimiento-almacen.routes.js";
import responsablesRouter from "./routes/responsable.routes.js";

const app = express();
const PORT = 3002;

// Middleware para CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Configuramos los enrutadores
app.use("/api/almacen", almacenRouter);
app.use("/api/facturas", facturasRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/edificio", edificioRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/estado-obra", estadoObraRouter);
app.use("/api/tipo-facturable", tiposFacRouter);
app.use("/api/tipo-obra", tiposObRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/relacion-obras", relacionObrasRouter);
app.use("/api/obra", obraRouter);
app.use("/api/rentabilidad", rentabilidadRouter);
app.use("/api/ecoPedido", ecoPedidoRouter);
app.use("/api/ecoFactura", ecoFacturaRouter);
app.use("/api/gastos", gastoRouter);
app.use("/api/horas", horasRouter);
app.use("/api/movimientos-almacen", movimientosAlmacenRouter);
app.use("/api/responsables", responsablesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
