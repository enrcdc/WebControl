import zod from "zod";

const edificioSchema = zod.object({
  nombre: zod.string({
    required_error: "El nombre del complejo es requerido",
    invalid_type_error: "El nombre del complejo debe ser una cadena de texto",
  }),

  direccion: zod
    .string({
      invalid_type_error: "La dirección debe ser una cadena de texto",
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

  email: zod
    .string({
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email("El email debe tener un formato válido")
    .optional(),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
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

export const createEdificioSchema = edificioSchema;
export const updateEdificioSchema = edificioSchema.partial();
