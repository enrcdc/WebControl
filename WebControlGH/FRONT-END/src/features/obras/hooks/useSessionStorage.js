import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  // sessionStorage es una propiedad exclusiva del objeto global window.
  // Este objeto global window solo está disponible en el lado del cliente (navegador)
  // y no en el server. Por lo tanto debemos incluir un if para hacer que este fragmento
  // de código solo se ejecute del lado del cliente
  if (typeof window !== "undefined") {
    const saved = sessionStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
}

export const useSessionStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  /* El useEffect es el sitio ideal para llamar a sessionStorage. Cuando el componente
  se monte por primera vez y cuando las dependencias cambian [key, value] se llamará
  al método de almacenamiento */
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
