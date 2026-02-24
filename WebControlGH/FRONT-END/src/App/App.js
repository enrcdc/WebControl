import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "styles/App.css";

// -- LOGIN -- \\
import { Login, AuthProvider, PrivateRoute } from "../features/auth";
// -- NAVBAR -- \\
import Navbar from "../Components/layout/Navbar";

// -- RENTABILIDAD -- \\
import { ProfitabilityTable } from "../features/rentabilidad";

// -- EMPRESAS -- \\
import {
  GestionEmpresas,
  CrearEmpresa,
  DetalleEmpresa,
} from "../features/empresas";

// -- COMPLEJOS -- \\
import {
  GestionComplejos,
  CrearComplejo,
  DetalleComplejo,
} from "../features/complejos";

// -- CONTACTOS -- \\
import {
  GestionContactos,
  CrearContacto,
  DetalleContacto,
} from "../features/contactos";

// -- PROVEEDORES -- \\
import {
  GestionProveedores,
  CrearProveedor,
  DetalleProveedor,
} from "../features/proveedores";

// -- ALMACEN -- \\
import { GestionAlmacen } from "../features/almacen";

// -- OBRA -- \\
import {
  GestionObras as ListaObras,
  DetalleObra,
  CrearObra,
  ImprimirObras,
} from "../features/obras";

// -- FACTURA -- \\
import {
  GestionFacturas,
  DetalleFactura,
  ImprimirFacturas,
} from "../features/facturas";

// -- PEDIDO -- \\
import {
  GestionPedidos,
  DetallePedido,
  CrearPedido,
  ImprimirPedido,
} from "../features/pedidos";

// -- COMPRA -- \\
import {
  GestionCompras,
  DetalleCompra,
  NuevaCompra,
} from "../features/compras";

// -- HORAS -- \\
import { HorasList, DetalleHora, NuevaHora } from "../features/horas";

// -- GASTOS -- \\
import { GastosList } from "../features/gastos";

// -- TIPO GASTO -- \\
import {
  GestionTipoGastos,
  CrearTipoGasto,
  DetalleTipoGasto,
} from "../features/tipoGasto";

// Componente principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home/*"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
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
          {/* Facturas se crean desde FacturaDirecta, no desde el ERP */}
          <Route path="nuevo-pedido" element={<CrearPedido />} />
          {<Route path="nueva-compra" element={<NuevaCompra />} />}
          <Route path="nueva-hora" element={<NuevaHora />} />
          <Route path="profitability" element={<ProfitabilityTable />} />
          <Route path="gestion-facturas" element={<GestionFacturas />} />
          <Route path="imprimir-obra" element={<ImprimirObras />} />
          <Route
            path="gestion-facturas/detalle/:id"
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
          <Route path="gestion-empresas" element={<GestionEmpresas />} />
          <Route path="nueva-empresa" element={<CrearEmpresa />} />
          <Route
            path="gestion-empresas/detalle/:id"
            element={<DetalleEmpresa />}
          />
          <Route path="gestion-complejos" element={<GestionComplejos />} />
          <Route path="nuevo-complejo" element={<CrearComplejo />} />
          <Route
            path="gestion-complejos/detalle/:id"
            element={<DetalleComplejo />}
          />
          <Route path="gestion-contactos" element={<GestionContactos />} />
          <Route path="nuevo-contacto" element={<CrearContacto />} />
          <Route
            path="gestion-contactos/detalle/:id"
            element={<DetalleContacto />}
          />
          <Route path="gestion-proveedores" element={<GestionProveedores />} />
          <Route path="nuevo-proveedor" element={<CrearProveedor />} />
          <Route
            path="gestion-proveedores/detalle/:id"
            element={<DetalleProveedor />}
          />
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
          {/* Tipos de Gasto */}
          <Route
            path="gestion-tipos-gasto"
            element={<GestionTipoGastos />}
          />
          <Route path="nuevo-tipo-gasto" element={<CrearTipoGasto />} />
          <Route
            path="gestion-tipos-gasto/detalle/:id"
            element={<DetalleTipoGasto />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App; // Exporta el componente App como predeterminado
