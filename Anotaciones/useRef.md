## 1️⃣ Qué es `useRef` (en una frase)

`useRef` te da una **cajita mutable** que:

* ✅ **persiste entre renders**
* ✅ **no provoca re-render cuando cambia**
* ❌ **no sirve para renderizar UI**

```js
const ref = useRef(valorInicial);
```

Eso devuelve siempre el mismo objeto:

```js
{ current: valorInicial }
```

---

## 2️⃣ Qué significa `useRef(0)` exactamente

```js
const requestRef = useRef(0);
```

Esto crea:

```js
requestRef = { current: 0 }
```

Y **ese objeto nunca cambia**, aunque el componente se re-renderice.

Lo que sí puede cambiar es:

```js
requestRef.current
```

---

## 3️⃣ Diferencia clave con `useState` (esto es LO importante)

| `useState`            | `useRef`                 |
| --------------------- | ------------------------ |
| Cambiarlo → re-render | Cambiarlo → NO re-render |
| Para UI               | Para lógica interna      |
| Inmutable por render  | Mutable                  |

Ejemplo mental:

```js
ref.current = ref.current + 1; // React ni se entera
```

---

## 4️⃣ Por qué lo usamos para búsquedas async

### El problema real

Usuario escribe rápido:

1. 🔍 `"ca"` → request #1
2. 🔍 `"car"` → request #2

Pero la red es traicionera:

* request #2 responde primero ✅
* request #1 responde después ❌ (con datos viejos)

👉 Sin control, **pisas el estado con resultados antiguos**.

---

## 5️⃣ Cómo `useRef` soluciona esto

```js
const requestRef = useRef(0);
```

Este número es un **contador global del hook**.

Cada búsqueda:

```js
const currentRequest = ++requestRef.current;
```

Ejemplo real:

* Primera búsqueda → `requestRef.current = 1`
* Segunda búsqueda → `requestRef.current = 2`

Guardas el número **localmente**:

```js
const currentRequest = 2;
```

---

### Cuando llega la respuesta async

```js
if (currentRequest !== requestRef.current) return;
```

Esto pregunta:

> “¿Esta respuesta sigue siendo la más reciente?”

* ❌ No → fue una búsqueda vieja → la ignoras
* ✅ Sí → actualizas estado

🎯 **Magia:** evitas condiciones de carrera sin cancelar requests.

---

## 6️⃣ Por qué `useRef` y no `useState`

Si hicieras esto con `useState`:

```js
setRequestId(id + 1);
```

❌ Cada búsqueda haría re-render
❌ Más renders innecesarios
❌ Más complejidad
❌ Riesgo de closures obsoletos

`useRef` es perfecto porque:

* solo lo usas como **variable interna**
* React **no tiene que renderizar nada**

---

## 7️⃣ Regla mental para recordarlo

🧠 **Usa `useRef` cuando necesites:**

> “Una variable que sobreviva a los renders
> pero que no afecte a la UI”

Ejemplos comunes:

* requestId
* timeouts / intervals
* valores anteriores (`prevValue`)
* flags (`isMounted`)
* acceso a nodos DOM

---