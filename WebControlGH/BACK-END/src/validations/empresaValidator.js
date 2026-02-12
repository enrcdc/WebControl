import zod from "zod";

const empresaSchema = zod.object({
  nombre: zod.string({
    required_error: "El nombre de la empresa es requerido",
    invalid_type_error: "El nombre de la empresa debe ser una cadena de texto",
  }),

  cif: zod
    .string({
      invalid_type_error: "El CIF debe ser una cadena de texto",
    })
    .optional(),

  tipoEmpresa: zod
    .number({
      invalid_type_error: "El tipo de empresa debe ser un número",
    })
    .int()
    .optional(),

  direccion: zod
    .string({
      invalid_type_error: "La dirección debe ser una cadena de texto",
    })
    .optional(),

  poblacion: zod
    .string({
      invalid_type_error: "La población debe ser una cadena de texto",
    })
    .optional(),

  provincia: zod
    .string({
      invalid_type_error: "La provincia debe ser una cadena de texto",
    })
    .optional(),

  cp: zod
    .string({
      invalid_type_error: "El código postal debe ser una cadena de texto",
    })
    .optional(),

  telefono1: zod
    .string({
      invalid_type_error: "El teléfono 1 debe ser una cadena de texto",
    })
    .optional(),

  telefono2: zod
    .string({
      invalid_type_error: "El teléfono 2 debe ser una cadena de texto",
    })
    .optional(),

  fax: zod
    .string({
      invalid_type_error: "El fax debe ser una cadena de texto",
    })
    .optional(),

  email: zod
    .string({
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email("El email debe tener un formato válido")
    .optional(),

  tipoFactura: zod
    .number({
      invalid_type_error: "El tipo de factura debe ser un número",
    })
    .int()
    .optional(),

  evaluacion: zod
    .number({
      invalid_type_error: "La evaluación debe ser una número",
    })
    .int()
    .optional(),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),

  mostrarSaldo: zod
    .number({
      invalid_type_error: "El campo mostrar saldo debe ser un número",
    })
    .int()
    .optional(),

  porDefecto: zod
    .number({
      invalid_type_error: "El campo por defecto debe ser un número",
    })
    .int()
    .optional(),

  contactos: zod
    .array(
      zod
        .number({
          invalid_type_error: "Cada contacto debe ser un número (ID)",
        })
        .int()
        .positive(),
    )
    .min(1, "Debe asignar al menos un contacto"),
});

export const createEmpresaSchema = empresaSchema;
export const updateEmpresaSchema = empresaSchema.partial();
