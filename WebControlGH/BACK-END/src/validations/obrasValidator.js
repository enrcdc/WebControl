import zod from "zod";

const obraSchema = zod.object({
  cod: zod.string({
    required_error: "El código de la obra es requerido",
    invalid_type_error: "El código de la obra debe ser un cadena de caracteres",
  }),
  desc: zod.string({
    required_error: "La descripción de la obra es requerida",
    invalid_type_error:
      "La descripción de la obra debe ser una cadena de texto",
  }),
  fechaSeg: zod
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullish()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      {
        message: "La fecha de seguimiento debe tener un formato válido",
      }
    ),

  descSeg: zod
    .string({
      invalid_type_error:
        "La descripción del seguimiento debe ser una cadena de texto",
    })
    .nullish(),
  tipoObra: zod
    .number({
      required_error: "El tipo de obra es requerido",
      invalid_type_error: "El tipo de obra debe ser un número",
    })
    .int()
    .positive(),
  facturable: zod
    .number({
      required_error: "El tipo facturable es requerido",
      invalid_type_error: "El tipo de facturación debe ser un número",
    })
    .int()
    .positive(),
  estadoObra: zod
    .number({
      required_error: "El estado de obra es requerido",
      invalid_type_error: "El tipo de estado obra debe ser un número",
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
  fechaFin: zod
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullish()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      {
        message: "La fecha prevista de fin debe tener un formato válido",
      }
    ),

  fechaOferta: zod
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullish()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      {
        message: "La fecha de oferta debe tener un formato válido",
      }
    ),
  horasPrevistas: zod
    .number({
      invalid_type_error: "Las horas previstas debe ser un número",
    })
    .int(),
  gastoPrevisto: zod
    .number({
      invalid_type_error: "El gasto debe ser un número",
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
  viabilidad: zod
    .number({
      invalid_type_error: "La viabilidad debe ser un número",
    })
    .int()
    .positive(),
  empresa: zod
    .number({
      required_error: "El id de la empresa es requerido",
      invalid_type_error: "El id de la empresa debe ser un número",
    })
    .int()
    .positive(),
  contacto: zod
    .number({
      required_error: "El id del contacto es requerido",
      invalid_type_error: "El id del contacto debe ser un número",
    })
    .int()
    .positive(),
  edificio: zod
    .number({
      required_error: "El id del edificio es requerido",
      invalid_type_error: "El id del edificio ser un número",
    })
    .int()
    .positive(),
  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),
  observacionesInternas: zod
    .string({
      invalid_type_error:
        "Las observaciones internas deben ser una cadena de texto",
    })
    .optional(),
});

export function validateObra(object) {
  return obraSchema.safeParse(object);
}

export function validatePartialObra(objetc) {
  return obraSchema.partial().safeParse(objetc);
}
