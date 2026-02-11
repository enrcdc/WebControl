import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";

// ============================================
// BARREL EXPORT - Solo 1 import de rutas
// ============================================
import apiRoutes from "./routes/index.js";

const app = express();

// ============================================
// Middlewares
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// TODAS las rutas con una sola línea
// ============================================
app.use("/api", apiRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "WebControl ERP API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      docs: "/api/docs", // Para futuro
    },
  });
});

// ============================================
// Middleware de errores centralizado
// ============================================
app.use(errorHandler);

// ============================================
// Iniciar servidor
// ============================================

app.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
  console.log(`Health check: http://localhost:${config.port}/api/health`);
});

export default app;
