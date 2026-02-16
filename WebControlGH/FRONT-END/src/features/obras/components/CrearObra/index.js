// Componente principal orquestador para la creación de obras
import { Form, Button, Container } from "react-bootstrap";
import "../../../../css/NuevoObra.css";

// Hooks personalizados (refactorizados)
import { useObraForm } from "../../hooks/useObraForm";
import { useObrasRelacionadas } from "../../hooks/useObrasRelacionadas";
import { useCrearObra } from "../../hooks/useCrearObra";
import { useContactos } from "../../hooks/useContactos";

// Componentes presentacionales
import FormDatosBasicos from "./Components/FormDatosBasicos";
import FormInformacionGeneral from "./Components/FormInformacionGeneral";
import SelectorObrasRelacionadas from "./Components/SelectorObrasRelacionadas";

// Modales
import ModalContacto from "./Components/Modals/ModalContacto";

const CrearObra = () => {
  // Hook del formulario de obra (incluye catálogos)
  const {
    formObra,
    catalogos,
    ofertado,
    enSeguimiento,
    handleChange,
    handleChangeOfertado,
    handleChangeSeguimiento,
  } = useObraForm();

  // Hook de obras relacionadas (sin idObra = modo creación)
  const obrasRelacionadas = useObrasRelacionadas(null);

  // Hook de creación de obra
  const { loading, handleGuardar, handleCancelar } = useCrearObra();

  // Hook de la modal de contactos
  const contactosHook = useContactos();

  // Handler del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGuardar(
      formObra,
      obrasRelacionadas.obraPadre,
      obrasRelacionadas.obrasHijas,
    );
  };

  return (
    <Container className="nuevo-obra-container">
      <div className="nuevo-obra">
        <h2>Editor de Obra</h2>
        <Form onSubmit={handleSubmit}>
          {/* Datos básicos: código, descripción, seguimiento */}
          <FormDatosBasicos
            formObra={formObra}
            enSeguimiento={enSeguimiento}
            onChangeForm={handleChange}
            onChangeSeguimiento={handleChangeSeguimiento}
          />

          {/* Selector de obras relacionadas */}
          <SelectorObrasRelacionadas
            obraPadreBusqueda={obrasRelacionadas.busquedaPadre}
            sugerenciasPadre={obrasRelacionadas.sugerenciasPadre}
            obraPadreSeleccionada={obrasRelacionadas.obraPadre}
            onBuscarPadre={obrasRelacionadas.handleBuscarPadre}
            onSeleccionarPadre={obrasRelacionadas.seleccionarObraPadre}
            onEliminarPadre={obrasRelacionadas.eliminarObraPadre}
            obraHijaBusqueda={obrasRelacionadas.busquedaHijas}
            sugerenciasHijas={obrasRelacionadas.sugerenciasHijas}
            obrasHijasSeleccionadas={obrasRelacionadas.obrasHijas}
            onBuscarHija={obrasRelacionadas.handleBuscarHija}
            onAgregarHija={obrasRelacionadas.agregarObraHija}
            onEliminarHija={obrasRelacionadas.eliminarObraHija}
          />

          {/* Información general: tipo, estado, fechas, empresa, etc. */}
          <FormInformacionGeneral
            formObra={formObra}
            catalogos={catalogos}
            ofertado={ofertado}
            onChangeForm={handleChange}
            onChangeOfertado={handleChangeOfertado}
            onAgregarContacto={contactosHook.handleAgregar}
          />

          {/* Modal para la creación de contactos */}
          <ModalContacto
            show={contactosHook.showModal}
            formData={contactosHook.formData}
            complejos={contactosHook.complejos}
            busquedaComplejos={contactosHook.busquedaComplejos}
            sugerenciasComplejos={contactosHook.sugerenciasComplejos}
            onBuscarComplejo={contactosHook.handleBuscarComplejo}
            onSeleccionarComplejo={contactosHook.agregarComplejo}
            onEliminarComplejo={contactosHook.eliminarComplejo}
            empresa={contactosHook.empresa}
            busquedaEmpresa={contactosHook.busquedaEmpresa}
            sugerenciasEmpresas={contactosHook.sugerenciasEmpresas}
            onBuscarEmpresa={contactosHook.handleBuscarEmpresa}
            onSeleccionarEmpresa={contactosHook.agregarEmpresa}
            onEliminarEmpresa={contactosHook.eliminarEmpresa}
            onHide={contactosHook.handleClose}
            onChangeForm={contactosHook.handleChangeForm}
            onGuardar={contactosHook.handleGuardar}
          />

          {/* Botones de acción */}
          <div className="actions">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar obra"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancelar}
              disabled={loading}
            >
              Cancelar cambios
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CrearObra;
