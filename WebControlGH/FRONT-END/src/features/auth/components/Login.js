import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/Login.css";
import { authService } from "../services/auth.service";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Por favor, completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const res = await authService.login(username, password);

      if (res.data?.success) {
        const { token, usuario } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(usuario));

        navigate("/home/gestion-obras");
      } else {
        setError(res.data?.message || "Error al iniciar sesión");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Credenciales inválidas");
      } else if (error.request) {
        setError("No se pudo conectar con el servidor");
      } else {
        setError("Error al procesar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header">
        <h1>GESTOR CC</h1>
      </div>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>LOGIN</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
