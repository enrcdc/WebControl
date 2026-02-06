import zod from "zod";

const facturaObraSchema = zod.object({
  idObra: zod
    .number({
      required_error: "El idObra es requerido",
      invalid_type_error: "El idObra debe ser un número",
    })
    .int()
    .positive(),

  idFacturasCompras: zod
    .number({
      required_error: "El idFacturasCompras es requerido",
      invalid_type_error: "El idFacturasCompras debe ser un número",
    })
    .int()
    .positive(),
  importe: zod
    .number({
      required_error: "El importe es requerido",
      invalid_type_error: "El importe debe ser un número",
    })
    .refine((value) => Number.isInteger(value * 100), {
      message: "El importe debe tener como máximo 2 decimales",
    })
    .positive(),

  fechaAlta: zod
    .string({
      required_error: "La fechaAlta es requerida",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fechaAlta debe tener un formato válido",
    }),

  codigoUsuarioAlta: zod
    .number({
      required_error: "El codigoUsuarioAlta es requerido",
      invalid_type_error: "El codigoUsuarioAlta debe ser un número",
    })
    .int()
    .positive(),

  fechaActualizacion: zod
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fechaActualizacion debe tener un formato válido",
    }),

  fechaBaja: zod
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fechaBaja debe tener un formato válido",
    }),

  codigoUsuarioBaja: zod
    .number({
      invalid_type_error: "El codigoUsuarioBaja debe ser un número",
    })
    .int()
    .positive()
    .optional(),

  observaciones: zod
    .string({
      required_error: "Las observaciones son requeridas",
    })
    .min(1, "Las observaciones no pueden estar vacías"),

  version: zod
    .number({
      required_error: "La versión es requerida",
      invalid_type_error: "La versión debe ser un número",
    })
    .int()
    .positive()
    .optional(),
});

export function validateFactura(object) {
  return facturaObraSchema.safeParse(object);
}

export function validatePartialFactura(object) {
  return facturaObraSchema.partial().safeParse(object);
}
