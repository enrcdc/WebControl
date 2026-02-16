import React from "react"; // Importa React
import ReactDOM from "react-dom/client"; // Importa ReactDOM para renderizar la aplicación
import "styles/index.css"; // Importa los estilos globales
import App from "./App/App"; // Importa el componente App
import reportWebVitals from "./reportWebVitals"; // Importa la función para reportar métricas de rendimiento

// Renderiza el componente App en el elemento con id 'root'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Llama a reportWebVitals para medir el rendimiento de la aplicación
reportWebVitals();
