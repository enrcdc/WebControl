## ¿Qué es `useCallback`?

`useCallback` es un **hook de React que memoriza una función** para que **no se vuelva a crear en cada render**, **a menos que cambien ciertas dependencias**.

```js
const memoizedFn = useCallback(() => {
  // lógica
}, [deps])
```

En pocas palabras:
👉 **Evita que una función cambie de identidad innecesariamente.**

---

## ¿Por qué importa eso?

En JavaScript, **una función nueva = referencia nueva**.
Aunque el código sea igual, React la ve como *otra función*.

Esto puede causar:

* Re-renders innecesarios
* Efectos que se ejecutan de más
* Componentes memoizados que pierden optimización

---

## Casos de uso típicos (los importantes)

### 1. Pasar callbacks a componentes hijos (`React.memo`)

```js
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, [])

return <Button onClick={handleClick} />
```

✔️ Útil cuando:

* El hijo está envuelto en `React.memo`
* El callback se pasa como prop

Sin `useCallback`, el hijo re-renderiza **aunque nada lógico haya cambiado**.

---

### 2. Dependencia estable en `useEffect`

```js
const fetchData = useCallback(() => {
  // fetch...
}, [userId])

useEffect(() => {
  fetchData()
}, [fetchData])
```

✔️ Evita:

* Bucles infinitos
* Re-ejecuciones innecesarias del efecto

---

### 3. Optimizar renders costosos

Si una función:

* Se pasa profundo en el árbol
* Se ejecuta muchas veces
* Provoca renders caros

👉 `useCallback` ayuda a **reducir renders evitables**.

---

## ¿Qué NO hace `useCallback`?

🚫 **NO evita que la función se ejecute**
🚫 **NO hace la función más rápida**
🚫 **NO evita renders por sí solo**

Solo **mantiene la misma referencia** entre renders.

---

## Dependencias: la parte crítica

```js
useCallback(() => {
  console.log(count)
}, [count])
```

Regla clave:

> **Toda variable usada dentro que venga de fuera debe ir en el array.**

Si no:

* Usarás valores obsoletos (*stale closures*)
* Bugs difíciles de detectar

---

## `useCallback` vs `useMemo`

| Hook                         | Memoriza         |
| ---------------------------- | ---------------- |
| `useCallback(fn, deps)`      | la **función**   |
| `useMemo(() => value, deps)` | el **resultado** |

De hecho:

```js
useCallback(fn, deps)
// es equivalente a:
useMemo(() => fn, deps)
```

---

## ¿Cuándo NO usar `useCallback`?

❌ En funciones locales que no se pasan como props
❌ En componentes simples
❌ “Por si acaso”

`useCallback` **también tiene costo** (memoria y complejidad).

---

## Regla práctica (muy útil)

👉 **No lo uses por defecto**
👉 Úsalo cuando:

* Pasas funciones a hijos memoizados
* Lo necesitas como dependencia estable
* Detectas renders innecesarios reales

---

## Resumen en una frase

**`useCallback` sirve para que una función no cambie de identidad entre renders, evitando renders y efectos innecesarios cuando realmente importa.**

Perfecto, vamos **despacio y con intuición**, porque `useRef` es uno de los hooks que más confunde al principio… y es normal 🙂

Te explico **exactamente qué es** esto:

```js
const requestRef = useRef(0);
```

y **por qué funciona** en el ejemplo de la búsqueda.

---
