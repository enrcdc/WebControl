# Interceptores - Explicación

Los **interceptores** son exactamente lo que su nombre sugiere: **"aduanas" o "puntos de control"** por los que pasa cada una de tus peticiones HTTP antes de salir hacia el servidor o justo antes de que lleguen a tu código.

Imagina que Axios es un mensajero. Un interceptor es como un asistente que revisa el paquete antes de que el mensajero se vaya, o que revisa la respuesta antes de entregártela a ti.

---

### ¿Cómo funcionan en tu código?

En el ejemplo que pusiste, tienes dos tipos de interceptores fundamentales:

#### 1. Interceptor de Petición (Request)

```javascript
// Interceptor de request: añadir token JWT automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Este se ejecuta **antes** de que la petición salga de tu aplicación.

- **Su misión aquí:** Mirar si tienes un `token` guardado en el navegador.
- **El beneficio:** En lugar de escribir manualmente el encabezado de autorización (`Authorization: Bearer ...`) en cada `axios.get` o `axios.post` de toda tu app, este interceptor lo inyecta automáticamente en todas.

#### 2. Interceptor de Respuesta (Response)

```javascript
// Interceptor de response: redirigir a login si el token es inválido/expirado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

Este se ejecuta **cuando llega algo** del servidor, pero antes de que tu `try/catch` o `.then()` lo reciba.

- **Su misión aquí:** Vigilar si el servidor responde con un error **401 (No autorizado)**.
- **El beneficio:** Si el token caducó mientras el usuario usaba la app, el interceptor lo detecta, borra el token inservible y lo manda directo al `/login`. Te ahorras poner esa lógica en cada componente.

---

### Resumen Visual de la Lógica

| Momento                | Acción del Interceptor                                                           |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Salida (Request)**   | "Espera, ¿tenemos token? Sí, ponlo en el sobre antes de enviarlo".               |
| **Entrada (Response)** | "¿El servidor dice que el token no vale? Borra todo y echa al usuario al Login". |

---

### ¿Por qué son tan útiles?

1. **DRY (Don't Repeat Yourself):** Centralizas la lógica de autenticación en un solo archivo.
2. **Mantenimiento:** Si mañana decides cambiar `localStorage` por `sessionStorage`, solo cambias una línea de código en el interceptor, no en 50 archivos diferentes.
3. **Manejo Global de Errores:** Puedes usar interceptores para mostrar alertas genéricas cada vez que haya un error 500 (error de servidor), por ejemplo.
