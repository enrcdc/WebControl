# 📘 Guía Completa para Crear Servicios - Backend

## Referencia: `obra.service.js`

Este documento explica todas las casuísticas cubiertas en el servicio de obras, que puedes usar como plantilla para crear los demás servicios.

---

## 🎯 ¿Qué es un Service Layer?

El **Service Layer** es la capa que contiene toda la **lógica de negocio** de la aplicación. Se sitúa entre el Controller (manejo HTTP) y el Model (acceso a datos).

```
Request → Controller → Service → Model → Database
                ↓         ↓        ↓
            Solo HTTP  Lógica   Solo SQL
                      Negocio
```

---

## 📦 Estructura del Servicio `obra.service.js`

El servicio tiene **700 líneas** organizadas en:

1. **Errores personalizados** (líneas 17-51)
2. **Métodos públicos CRUD** (líneas 53-333)
3. **Métodos privados helpers** (líneas 335-607)
4. **Métodos adicionales de utilidad** (líneas 609-700)

---

## 1️⃣ ERRORES PERSONALIZADOS

### ¿Por qué crear errores personalizados?

Los errores personalizados permiten:
- Mensajes descriptivos específicos del dominio
- Incluir `statusCode` HTTP correcto
- Agregar detalles adicionales para debugging
- Manejo consistente en el error handler middleware

### Ejemplo del servicio:

```javascript
export class ObraNotFoundError extends Error {
  constructor(id) {
    super(`Obra con ID ${id} no encontrada`);
    this.name = "ObraNotFoundError";
    this.statusCode = 404;
  }
}

export class InvalidObraDataError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "InvalidObraDataError";
    this.statusCode = 400;
    this.details = details; // Info adicional para debugging
  }
}
```

### Errores incluidos en obra.service.js:

| Error | Cuándo usar | Status Code |
|-------|-------------|-------------|
| `ObraNotFoundError` | Obra no existe | 404 |
| `ObraAlreadyDeletedError` | Obra ya eliminada (soft delete) | 400 |
| `NoObrasFoundError` | No hay obras o búsqueda sin resultados | 404 |
| `InvalidObraDataError` | Datos inválidos o reglas de negocio no cumplidas | 400 |

### Uso en el servicio:

```javascript
static async getById(id) {
  if (!id || isNaN(Number(id))) {
    throw new InvalidObraDataError(
      "ID de obra inválido",
      { field: "id", value: id, message: "El ID debe ser un número válido" }
    );
  }

  const obra = await ObraModel.getById({ idObra: Number(id) });

  if (!obra) {
    throw new ObraNotFoundError(id);
  }

  if (obra.fecha_baja) {
    throw new ObraAlreadyDeletedError(id);
  }

  return obra;
}
```

---

## 2️⃣ MÉTODOS PÚBLICOS (API del Servicio)

### 2.1 GET ALL - Obtener todos los registros

**Ubicación:** Líneas 63-72

**Características:**
- ✅ Valida que existan resultados
- ✅ Enriquece datos con campos calculados
- ✅ Lanza error descriptivo si no hay datos

```javascript
static async getAll() {
  const obras = await ObraModel.getAll();

  if (!obras || obras.length === 0) {
    throw new NoObrasFoundError();
  }

  // Transformación de datos: agregar campos calculados
  return obras.map(obra => this._enrichObraData(obra));
}
```

**¿Cuándo lanzar error vs retornar array vacío?**
- **Lanzar error:** Cuando no tener datos es anormal (ej: sistema sin obras es raro)
- **Retornar []:** Cuando es normal no tener datos (ej: búsqueda sin resultados)

En obras, no tener ninguna obra es anormal, por eso lanza error.

---

### 2.2 GET BY ID - Obtener por identificador

**Ubicación:** Líneas 85-109

**Características:**
- ✅ Valida que el ID sea válido (número)
- ✅ Maneja el caso de array vs objeto del modelo
- ✅ Verifica soft delete (fecha_baja)
- ✅ Enriquece datos antes de retornar

```javascript
static async getById(id) {
  // VALIDACIÓN DE ENTRADA
  if (!id || isNaN(Number(id))) {
    throw new InvalidObraDataError(
      "ID de obra inválido",
      { field: "id", value: id, message: "El ID debe ser un número válido" }
    );
  }

  const result = await ObraModel.getById({ idObra: Number(id) });

  // MANEJO DE RESPUESTA DEL MODELO
  // El modelo retorna un array, tomamos el primer elemento
  const obra = Array.isArray(result) ? result[0] : result;

  if (!obra) {
    throw new ObraNotFoundError(id);
  }

  // VERIFICACIÓN DE SOFT DELETE
  if (obra.fecha_baja) {
    throw new ObraAlreadyDeletedError(id);
  }

  return this._enrichObraData(obra);
}
```

**Lecciones clave:**
1. **Siempre valida la entrada** antes de llamar al modelo
2. **Maneja diferentes formatos de respuesta** del modelo (array vs objeto)
3. **Verifica soft deletes** si tu aplicación los usa
4. **Enriquece datos** antes de retornar (campos calculados, relaciones, etc.)

---

### 2.3 SEARCH - Búsqueda con criterios

**Ubicación:** Líneas 121-144

**Características:**
- ✅ Valida que el criterio no esté vacío
- ✅ Sanitiza la entrada (trim)
- ✅ Mensaje de error descriptivo con el criterio usado

```javascript
static async getByDescripcion(descripcion) {
  // VALIDACIÓN
  if (!descripcion || descripcion.trim() === "") {
    throw new InvalidObraDataError(
      "La descripción de búsqueda no puede estar vacía",
      { field: "descripcion", value: descripcion }
    );
  }

  // SANITIZACIÓN
  const sanitizedDescripcion = descripcion.trim();

  const obras = await ObraModel.getByDescripcion({
    descripcionObra: sanitizedDescripcion
  });

  // ERROR DESCRIPTIVO
  if (!obras || obras.length === 0) {
    throw new NoObrasFoundError(
      `No se encontraron obras con la descripción "${sanitizedDescripcion}"`
    );
  }

  return obras;
}
```

---

### 2.4 CREATE - Crear nuevo registro

**Ubicación:** Líneas 156-207

**Características:**
- ✅ Validaciones de negocio adicionales a Zod
- ✅ Verifica fechas lógicas (fechaAlta no futura, fechaFin > fechaAlta)
- ✅ Valida rangos razonables (horas no excesivas)
- ✅ Llama a helper de validaciones de negocio complejas

```javascript
static async create(obraData) {
  // VALIDACIONES DE NEGOCIO (adicionales a Zod)
  await this._validateBusinessRules(obraData);

  // VALIDACIÓN: fechaAlta no futura
  if (obraData.fechaAlta) {
    const fechaAlta = new Date(obraData.fechaAlta);
    const hoy = new Date();
    if (fechaAlta > hoy) {
      throw new InvalidObraDataError(
        "La fecha de alta no puede ser futura",
        { field: "fechaAlta", value: obraData.fechaAlta }
      );
    }
  }

  // VALIDACIÓN: fechaFin > fechaAlta
  if (obraData.fechaAlta && obraData.fechaFin) {
    const fechaAlta = new Date(obraData.fechaAlta);
    const fechaFin = new Date(obraData.fechaFin);
    if (fechaFin <= fechaAlta) {
      throw new InvalidObraDataError(
        "La fecha prevista de fin debe ser posterior a la fecha de alta",
        {
          field: "fechaFin",
          value: obraData.fechaFin,
          fechaAlta: obraData.fechaAlta
        }
      );
    }
  }

  // VALIDACIÓN: valor razonable
  if (obraData.horasPrevistas && obraData.horasPrevistas > 10000) {
    throw new InvalidObraDataError(
      "Las horas previstas parecen excesivas. Verifica el valor.",
      { field: "horasPrevistas", value: obraData.horasPrevistas }
    );
  }

  // CREAR (el modelo maneja Zod y SQL)
  const nuevaObra = await ObraModel.create({ input: obraData });

  if (!nuevaObra) {
    throw new Error("Error al crear la obra. No se obtuvo respuesta del modelo.");
  }

  return nuevaObra;
}
```

**Tipos de validaciones en CREATE:**
1. **Validación de schema (Zod)** → En el Modelo
2. **Validación de lógica de fechas** → En el Servicio
3. **Validación de rangos razonables** → En el Servicio
4. **Validación de existencia de relaciones** → En el Servicio (helper `_validateBusinessRules`)

---

### 2.5 UPDATE - Actualizar registro

**Ubicación:** Líneas 222-278

**Características:**
- ✅ Verifica que el registro existe antes de actualizar
- ✅ Valida que haya datos para actualizar
- ✅ Verifica que no esté eliminado (soft delete)
- ✅ Valida transiciones de estado válidas
- ✅ Validaciones específicas según campo actualizado

```javascript
static async update(id, updateData) {
  // VALIDACIÓN DE ID
  if (!id || isNaN(Number(id))) {
    throw new InvalidObraDataError(
      "ID de obra inválido",
      { field: "id", value: id }
    );
  }

  // VALIDACIÓN: datos no vacíos
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new InvalidObraDataError(
      "No se proporcionaron datos para actualizar",
      { updateData }
    );
  }

  // VERIFICAR EXISTENCIA Y NO ELIMINADO
  const obraExistente = await this._getObraOrFail(id);

  // VALIDACIÓN: fechas coherentes
  if (updateData.fechaFin && obraExistente.fecha_alta) {
    const fechaFin = new Date(updateData.fechaFin);
    const fechaAlta = new Date(obraExistente.fecha_alta);
    if (fechaFin <= fechaAlta) {
      throw new InvalidObraDataError(
        "La fecha prevista de fin debe ser posterior a la fecha de alta",
        {
          field: "fechaFin",
          value: updateData.fechaFin,
          fechaAlta: obraExistente.fecha_alta
        }
      );
    }
  }

  // VALIDACIÓN: transición de estado válida
  if (updateData.estadoObra !== undefined) {
    await this._validateEstadoTransition(
      obraExistente.estado_obra,
      updateData.estadoObra
    );
  }

  // ACTUALIZAR
  const obraActualizada = await ObraModel.update({
    idObra: Number(id),
    input: updateData
  });

  if (!obraActualizada) {
    throw new ObraNotFoundError(id);
  }

  return obraActualizada;
}
```

**Patrón para UPDATE:**
1. Validar ID
2. Validar que haya datos
3. Verificar que el registro existe
4. Aplicar validaciones específicas según campos
5. Actualizar
6. Retornar actualizado

---

### 2.6 DELETE - Eliminar registro (soft delete)

**Ubicación:** Líneas 293-333

**Características:**
- ✅ Verifica existencia antes de eliminar
- ✅ Verifica que no esté ya eliminado
- ✅ Valida reglas de negocio (¿se puede eliminar?)
- ✅ Soft delete (no elimina físicamente)

```javascript
static async delete(id, codigoUsuarioBaja = 67) {
  // VALIDACIONES DE ENTRADA
  if (!id || isNaN(Number(id))) {
    throw new InvalidObraDataError(
      "ID de obra inválido",
      { field: "id", value: id }
    );
  }

  if (codigoUsuarioBaja && isNaN(Number(codigoUsuarioBaja))) {
    throw new InvalidObraDataError(
      "Código de usuario inválido",
      { field: "codigoUsuarioBaja", value: codigoUsuarioBaja }
    );
  }

  // VERIFICAR EXISTENCIA (sin verificar deleted aún)
  const obraExistente = await this._getObraOrFail(id, false);

  // VERIFICAR NO ELIMINADO YA
  if (obraExistente.fecha_baja) {
    throw new ObraAlreadyDeletedError(id);
  }

  // VALIDAR REGLAS DE NEGOCIO
  // Ejemplo: no eliminar si tiene facturas, horas, etc.
  await this._validateCanDelete(id);

  // ELIMINAR (soft delete)
  const obraEliminada = await ObraModel.delete({
    idObra: Number(id),
    codigoUsuarioBaja: codigoUsuarioBaja ? Number(codigoUsuarioBaja) : 67
  });

  if (!obraEliminada) {
    throw new ObraNotFoundError(id);
  }

  return obraEliminada;
}
```

---

## 3️⃣ MÉTODOS PRIVADOS (HELPERS)

Los métodos privados tienen prefijo `_` y NO deben ser llamados desde fuera del servicio.

### 3.1 Enriquecimiento de Datos

**`_enrichObraData(obra)`** - Líneas 346-359

Agrega campos calculados a la obra:

```javascript
static _enrichObraData(obra) {
  const enriched = {
    ...obra,
    estadoCalculado: this._calculateEstadoObra(obra),
    rentabilidadReal: this._calculateRentabilidad(obra),
    alertas: this._checkAlertas(obra),
  };

  return enriched;
}
```

**¿Qué agrega?**
- `estadoCalculado`: Estado basado en fechas y actividad
- `rentabilidadReal`: Cálculo de rentabilidad con ingresos vs gastos
- `alertas`: Array de alertas (horas excedidas, gastos excedidos, etc.)

---

### 3.2 Cálculos de Negocio

**`_calculateEstadoObra(obra)`** - Líneas 368-394

Calcula el estado real de la obra basándose en múltiples factores:

```javascript
static _calculateEstadoObra(obra) {
  const hoy = new Date();

  if (obra.fecha_baja) {
    return 'ELIMINADA';
  }

  if (obra.fecha_prevista_fin) {
    const fechaFin = new Date(obra.fecha_prevista_fin);
    if (hoy > fechaFin && obra.estado_obra !== 5) {
      return 'RETRASADA';
    }
  }

  if (obra.fecha_ultima_factura) {
    const fechaUltimaFactura = new Date(obra.fecha_ultima_factura);
    const diasSinActividad = (hoy - fechaUltimaFactura) / (1000 * 60 * 60 * 24);
    if (diasSinActividad > 90) {
      return 'INACTIVA';
    }
  }

  return 'ACTIVA';
}
```

**`_calculateRentabilidad(obra)`** - Líneas 403-423

Calcula rentabilidad real:

```javascript
static _calculateRentabilidad(obra) {
  if (!obra.importe || !obra.total_gastos) {
    return null;
  }

  const ingresos = Number(obra.total_facturas) || 0;
  const gastos = Number(obra.total_gastos) || 0;
  const rentabilidad = ingresos - gastos;
  const porcentaje = ingresos > 0 ? (rentabilidad / ingresos) * 100 : 0;

  return {
    ingresos,
    gastos,
    rentabilidad,
    porcentaje: porcentaje.toFixed(2),
    desviacionPrevista: obra.importe ?
      ((ingresos - obra.importe) / obra.importe * 100).toFixed(2) :
      null
  };
}
```

---

### 3.3 Sistema de Alertas

**`_checkAlertas(obra)`** - Líneas 432-482

Detecta situaciones que requieren atención:

```javascript
static _checkAlertas(obra) {
  const alertas = [];

  // Alerta: Horas excedidas
  if (obra.horas_previstas && obra.total_horas) {
    if (Number(obra.total_horas) > Number(obra.horas_previstas)) {
      alertas.push({
        tipo: 'HORAS_EXCEDIDAS',
        severidad: 'WARNING',
        mensaje: `Las horas reales (${obra.total_horas}) superan las previstas (${obra.horas_previstas})`
      });
    }
  }

  // Alerta: Gastos excedidos
  if (obra.gasto_previsto && obra.total_gastos) {
    if (Number(obra.total_gastos) > Number(obra.gasto_previsto)) {
      alertas.push({
        tipo: 'GASTOS_EXCEDIDOS',
        severidad: 'ERROR',
        mensaje: `Los gastos reales (${obra.total_gastos}) superan los previstos (${obra.gasto_previsto})`
      });
    }
  }

  // Más alertas...

  return alertas;
}
```

**Tipos de severidad:**
- `INFO`: Informativo
- `WARNING`: Advertencia (requiere atención)
- `ERROR`: Error crítico (requiere acción inmediata)

---

### 3.4 Validaciones de Negocio

**`_validateBusinessRules(obraData)`** - Líneas 516-540

Validaciones que requieren consultar la BD:

```javascript
static async _validateBusinessRules(obraData) {
  // Validar que la empresa existe
  if (obraData.empresa) {
    // const empresa = await EmpresaModel.getById(obraData.empresa);
    // if (!empresa) {
    //   throw new InvalidObraDataError("La empresa especificada no existe");
    // }
  }

  // Validar que el contacto pertenece a la empresa
  if (obraData.contacto && obraData.empresa) {
    // const contacto = await ContactoModel.getById(obraData.contacto);
    // if (!contacto || contacto.id_empresa !== obraData.empresa) {
    //   throw new InvalidObraDataError(
    //     "El contacto no pertenece a la empresa especificada"
    //   );
    // }
  }

  return true;
}
```

**`_validateEstadoTransition(estadoActual, nuevoEstado)`** - Líneas 550-575

Valida máquina de estados:

```javascript
static async _validateEstadoTransition(estadoActual, nuevoEstado) {
  // Definir transiciones válidas
  const transicionesValidas = {
    1: [2, 3, 4], // Desde "Oferta" → "En curso", "Parada", "Rechazada"
    2: [3, 5],    // Desde "En curso" → "Parada" o "Finalizada"
    3: [2, 5],    // Desde "Parada" → Reanudar o Finalizar
    4: [],        // "Rechazada" es estado final
    5: []         // "Finalizada" es estado final
  };

  const permitidas = transicionesValidas[estadoActual] || [];

  if (!permitidas.includes(nuevoEstado)) {
    throw new InvalidObraDataError(
      `No se puede cambiar del estado ${estadoActual} al estado ${nuevoEstado}`,
      { estadoActual, nuevoEstado, estadosPermitidos: permitidas }
    );
  }

  return true;
}
```

**`_validateCanDelete(id)`** - Líneas 584-607

Valida si se puede eliminar:

```javascript
static async _validateCanDelete(id) {
  const result = await ObraModel.getById({ idObra: Number(id) });
  const obra = Array.isArray(result) ? result[0] : result;

  // Ejemplo: No permitir eliminar si tiene facturas
  // if (obra.total_facturas && Number(obra.total_facturas) > 0) {
  //   throw new InvalidObraDataError(
  //     "No se puede eliminar una obra que tiene facturas asociadas",
  //     { id, totalFacturas: obra.total_facturas }
  //   );
  // }

  return true;
}
```

---

### 3.5 Helpers de Utilidad

**`_getObraOrFail(id, checkDeleted)`** - Líneas 494-507

Helper reutilizable para obtener obra o lanzar error:

```javascript
static async _getObraOrFail(id, checkDeleted = true) {
  const result = await ObraModel.getById({ idObra: Number(id) });
  const obra = Array.isArray(result) ? result[0] : result;

  if (!obra) {
    throw new ObraNotFoundError(id);
  }

  if (checkDeleted && obra.fecha_baja) {
    throw new ObraAlreadyDeletedError(id);
  }

  return obra;
}
```

**Beneficios:**
- Evita repetir código
- Manejo consistente de errores
- Fácil de testear

---

## 4️⃣ MÉTODOS ADICIONALES

### 4.1 Estadísticas

**`getEstadisticas()`** - Líneas 618-658

Calcula estadísticas agregadas:

```javascript
static async getEstadisticas() {
  const obras = await ObraModel.getAll();

  const stats = {
    total: obras.length,
    porEstado: {},
    porTipo: {},
    rentabilidadPromedio: 0,
    totalFacturado: 0,
    totalGastos: 0
  };

  obras.forEach(obra => {
    // Contadores por estado y tipo
    stats.porEstado[obra.desc_estado_obra] = (stats.porEstado[obra.desc_estado_obra] || 0) + 1;
    stats.porTipo[obra.desc_tipo_obra] = (stats.porTipo[obra.desc_tipo_obra] || 0) + 1;

    // Totales
    stats.totalFacturado += Number(obra.total_facturas) || 0;
    stats.totalGastos += Number(obra.total_gastos) || 0;
  });

  return stats;
}
```

### 4.2 Búsqueda Avanzada

**`buscarConFiltros(filtros)`** - Líneas 666-699

Filtrado flexible:

```javascript
static async buscarConFiltros(filtros) {
  let obras = await ObraModel.getAll();

  // Aplicar filtros
  if (filtros.empresa) {
    obras = obras.filter(o => o.id_empresa === Number(filtros.empresa));
  }

  if (filtros.estado) {
    obras = obras.filter(o => o.estado_obra === Number(filtros.estado));
  }

  if (filtros.fechaDesde) {
    const desde = new Date(filtros.fechaDesde);
    obras = obras.filter(o => new Date(o.fecha_alta) >= desde);
  }

  if (filtros.conAlertas) {
    obras = obras.map(o => this._enrichObraData(o))
      .filter(o => o.alertas && o.alertas.length > 0);
  }

  return obras;
}
```

---

## 📝 PLANTILLA PARA OTROS SERVICIOS

```javascript
/**
 * Servicio de [Entidad]
 */

import { [Entidad]Model } from "../models/[entidad].model.js";

// ============================================
// ERRORES PERSONALIZADOS
// ============================================

export class [Entidad]NotFoundError extends Error {
  constructor(id) {
    super(`[Entidad] con ID ${id} no encontrada`);
    this.name = "[Entidad]NotFoundError";
    this.statusCode = 404;
  }
}

export class Invalid[Entidad]DataError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "Invalid[Entidad]DataError";
    this.statusCode = 400;
    this.details = details;
  }
}

// ============================================
// SERVICIO
// ============================================

export class [Entidad]Service {
  /**
   * Obtener todos
   */
  static async getAll() {
    const items = await [Entidad]Model.getAll();

    if (!items || items.length === 0) {
      throw new [Entidad]NotFoundError("No se encontraron registros");
    }

    return items;
  }

  /**
   * Obtener por ID
   */
  static async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new Invalid[Entidad]DataError("ID inválido", { field: "id", value: id });
    }

    const item = await [Entidad]Model.getById(id);

    if (!item) {
      throw new [Entidad]NotFoundError(id);
    }

    return item;
  }

  /**
   * Crear
   */
  static async create(data) {
    // Validaciones de negocio aquí

    const newItem = await [Entidad]Model.create({ input: data });

    if (!newItem) {
      throw new Error("Error al crear el registro");
    }

    return newItem;
  }

  /**
   * Actualizar
   */
  static async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new Invalid[Entidad]DataError("ID inválido", { field: "id", value: id });
    }

    // Verificar existencia
    await this._getItemOrFail(id);

    // Actualizar
    const updated = await [Entidad]Model.update({ id, input: data });

    if (!updated) {
      throw new [Entidad]NotFoundError(id);
    }

    return updated;
  }

  /**
   * Eliminar
   */
  static async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new Invalid[Entidad]DataError("ID inválido", { field: "id", value: id });
    }

    // Verificar existencia
    await this._getItemOrFail(id);

    // Eliminar
    const deleted = await [Entidad]Model.delete({ id });

    if (!deleted) {
      throw new [Entidad]NotFoundError(id);
    }

    return deleted;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getItemOrFail(id) {
    const item = await [Entidad]Model.getById(id);

    if (!item) {
      throw new [Entidad]NotFoundError(id);
    }

    return item;
  }
}
```

---

## ✅ CHECKLIST PARA CREAR UN SERVICIO

- [ ] Definir errores personalizados (NotFound, InvalidData, etc.)
- [ ] Implementar `getAll()` con validación de resultados
- [ ] Implementar `getById()` con validación de ID
- [ ] Implementar `create()` con validaciones de negocio
- [ ] Implementar `update()` con verificación de existencia
- [ ] Implementar `delete()` (soft o hard según negocio)
- [ ] Agregar helper `_getItemOrFail()` si es útil
- [ ] Agregar métodos de enriquecimiento de datos si aplica
- [ ] Agregar validaciones de negocio específicas del dominio
- [ ] Documentar con JSDoc todos los métodos públicos

---

## 🎯 RESUMEN DE BUENAS PRÁCTICAS

1. **Errores descriptivos**: Usa clases de error personalizadas
2. **Validación temprana**: Valida inputs antes de llamar al modelo
3. **Documentación**: JSDoc en todos los métodos públicos
4. **Métodos privados**: Prefijo `_` para helpers internos
5. **Separación de responsabilidades**:
   - Controller → Solo HTTP
   - Service → Lógica de negocio
   - Model → Solo SQL
6. **Reutilización**: Helpers para código repetitivo
7. **Enriquecimiento**: Agrega campos calculados útiles
8. **Consistencia**: Todos los servicios siguen la misma estructura

---

**¡Usa `obra.service.js` como referencia para crear todos tus servicios!**
