import zod from "zod";

const movimientoAlmacenSchema = zod.object({
  idReferencia: zod
    .number({
      required_error: "El id de referencia es requerido",
      invalid_type_error: "El id de referencia debe ser un número",
    })
    .int()
    .positive(),

  fechaAlta: zod
    .string({
      required_error: "La fecha de alta es requerida",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de alta debe tener un formato válido",
    }),

  usuarioAlta: zod
    .number({
      required_error: "El usuario de alta es requerido",
      invalid_type_error: "El código de usuario debe ser un número",
    })
    .int()
    .positive(),

  tipoMovimiento: zod
    .number({
      required_error: "El tipo de movimiento es requerido",
      invalid_type_error: "El tipo de movimiento debe ser un número",
    })
    .int()
    .positive(),

  conceptoMovimiento: zod
    .number({
      required_error: "El concepto de movimiento es requerido",
      invalid_type_error: "El concepto de movimiento debe ser un número",
    })
    .int()
    .positive(),

  cantidad: zod
    .number({
      required_error: "La cantidad es requerida",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int(),

  importe: zod
    .number({
      required_error: "El importe es requerido",
      invalid_type_error: "El importe debe ser un número",
    })
    .refine((value) => Number.isInteger(value * 100), {
      message: "El importe debe tener como máximo 2 decimales",
    }),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),

  idFactura: zod
    .number({
      invalid_type_error: "El id de la factura debe ser un número",
    })
    .int()
    .positive()
    .nullish(),

  idObra: zod
    .number({
      invalid_type_error: "El id de la obra debe ser un número",
    })
    .int()
    .positive()
    .nullish(),
});

// En update, el campo se llama fechaMovimiento en vez de fechaAlta
const movimientoAlmacenUpdateSchema = zod.object({
  fechaMovimiento: zod
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha del movimiento debe tener un formato válido",
    })
    .optional(),

  usuarioAlta: movimientoAlmacenSchema.shape.usuarioAlta.optional(),
  tipoMovimiento: movimientoAlmacenSchema.shape.tipoMovimiento.optional(),
  conceptoMovimiento: movimientoAlmacenSchema.shape.conceptoMovimiento.optional(),
  cantidad: movimientoAlmacenSchema.shape.cantidad.optional(),
  importe: movimientoAlmacenSchema.shape.importe.optional(),
  observaciones: movimientoAlmacenSchema.shape.observaciones,
  idFactura: movimientoAlmacenSchema.shape.idFactura,
  idObra: movimientoAlmacenSchema.shape.idObra,
});

export const createMovimientoAlmacenSchema = movimientoAlmacenSchema;
export const updateMovimientoAlmacenSchema = movimientoAlmacenUpdateSchema;
