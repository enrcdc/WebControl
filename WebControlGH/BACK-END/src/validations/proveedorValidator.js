import zod from "zod";

const proveedorSchema = zod.object({
  codigo: zod.string({
    required_error: "El codigo del proveedor es requerido",
    invalid_type_error: "El codigo del proveedor debe ser una cadena de texto",
  }),

  nombre: zod.string({
    required_error: "El nombre del proveedor es requerido",
    invalid_type_error: "El nombre del proveedor debe ser una cadena de texto",
  }),

  cif: zod
    .string({
      invalid_type_error: "El CIF debe ser una cadena de texto",
    })
    .optional(),

  contacto: zod
    .string({
      invalid_type_error: "El contacto debe ser una cadena de texto",
    })
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
});

export const createProveedorSchema = proveedorSchema;
export const updateProveedorSchema = proveedorSchema.partial();
