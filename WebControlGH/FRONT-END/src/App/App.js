import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../css/App.css";

// -- LOGIN -- \\
import { Login } from "../features/auth";
// -- NAVBAR -- \\
import Navbar from "../Navbar/Navbar";

// -- RENTABILIDAD -- \\
import { ProfitabilityTable } from "../features/rentabilidad";

// -- ALMACEN -- \\
import { GestionAlmacen } from "../features/almacen";

// -- OBRA -- \\
import { GestionObras as ListaObras, DetalleObra, CrearObra, ImprimirObras } from "../features/obras";

// -- FACTURA -- \\
import { GestionFacturas, DetalleFactura, NuevaFactura, ImprimirFacturas } from "../features/facturas";

// -- PEDIDO -- \\
import { GestionPedidos, DetallePedido, NuevoPedido, ImprimirPedido } from "../features/pedidos";

// -- COMPRA -- \\
import { GestionCompras, DetalleCompra, NuevaCompra } from "../features/compras";

// -- HORAS -- \\
import { HorasList, DetalleHora, NuevaHora } from "../features/horas";

// -- GASTOS -- \\
import { GastosList } from "../features/gastos";


// Componente principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {" "}
        {/* Usa una clase del CSS global */}
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<MainLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Componente de diseño principal que contiene la barra de navegación y las rutas internas
function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="gestion-obras" element={<ListaObras />} />
          <Route path="nuevo-obra" element={<CrearObra />} />
          <Route path="nueva-factura" element={<NuevaFactura />} />
          <Route path="nuevo-pedido" element={<NuevoPedido />} />
          {<Route path="nueva-compra" element={<NuevaCompra />} />}
          <Route path="nueva-hora" element={<NuevaHora />} />
          <Route path="profitability" element={<ProfitabilityTable />} />
          <Route path="gestion-facturas" element={<GestionFacturas />} />
          <Route path="imprimir-obra" element={<ImprimirObras />} />
          <Route
            path="gestion-facturas/detalle/:cod"
            element={<DetalleFactura />}
          />
          <Route
            path="gestion-compras/detalle/:numero"
            element={<DetalleCompra />}
          />
          <Route
            path="gestion-pedidos/detalle/:id"
            element={<DetallePedido />}
          />
          <Route path="imprimir-factura" element={<ImprimirFacturas />} />{" "}
          {/* Nueva ruta para imprimir facturas */}
          <Route path="imprimir-pedido" element={<ImprimirPedido />} />
          <Route path="gestion-almacen" element={<GestionAlmacen />} />
          <Route path="gestion-pedidos" element={<GestionPedidos />} />
          <Route path="gestion-compras" element={<GestionCompras />} />
          <Route
            path="gestion-obras/detalle/:idObra"
            element={<DetalleObra />}
          />
          <Route path="registro-horas" element={<HorasList />} />
          <Route
            path="registro-horas/detalle/:idUsuario"
            element={<DetalleHora />}
          />
          
          {/*Gastos  */}
          <Route path="gastos-obras" element={<GastosList />} />

        </Routes>
      </div>
    </div>
  );
}

export default App; // Exporta el componente App como predeterminado
