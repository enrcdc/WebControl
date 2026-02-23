import zod from "zod";

const tipoGastoSchema = zod.object({
  descripcion: zod.string({
    required_error: "La descripcion del tipo de gasto es requerido",
    invalid_type_error:
      "La descripcion del tipo de gasto debe ser una cadena de texto",
  }),

  etiqueta: zod.string({
    required_error: "La etiqueta del tipo de gasto es requerida",
    invalid_type_error:
      "La etiqueta del tipo de gasto debe ser una cadena de texto",
  }),

  importe: zod
    .number({
      required_error: "El importe del tipo de gasto es requerido",
      invalid_type_error: "El import del tipo de gasto debe ser un número",
    })
    .int(),

  porcentaje: zod
    .number({
      invalid_type_error: "El porcentaje debe ser un número",
    })
    .int()
    .optional(),

  tipoIva: zod
    .number({
      invalid_type_error: "El tipo de iva debe ser un número",
    })
    .int()
    .optional(),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),

  conHoras: zod
    .number({
      invalid_type_error: "El campo 'con horas' debe ser un número",
    })
    .int()
    .optional(),

  esHoraExtra: zod
    .number({
      invalid_type_error: "El campo 'es hora extra' debe ser un número",
    })
    .int()
    .optional(),
});

export const createTipoGastoSchema = tipoGastoSchema;
export const updateTipoGastoSchema = tipoGastoSchema.partial();
