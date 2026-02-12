import zod from "zod";

const contactoSchema = zod.object({
  nombre: zod.string({
    required_error: "El nombre del contacto es requerido",
    invalid_type_error: "El nombre del contacto debe ser una cadena de texto",
  }),

  apellido1: zod
    .string({
      invalid_type_error: "El primer apellido debe ser una cadena de texto",
    })
    .optional(),

  apellido2: zod
    .string({
      invalid_type_error: "El segundo apellido debe ser una cadena de texto",
    })
    .optional(),

  dni: zod
    .string({
      invalid_type_error: "El DNI debe ser una cadena de texto",
    })
    .optional(),

  telefono: zod
    .string({
      invalid_type_error: "El teléfono debe ser una cadena de texto",
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

  email2: zod
    .string({
      invalid_type_error: "El email 2 debe ser una cadena de texto",
    })
    .email("El segundo email debe tener un formato válido")
    .optional(),

  direccion: zod
    .string({
      invalid_type_error: "La dirección debe ser una cadena de texto",
    })
    .optional(),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),

  empresa: zod.object(
    {
      id: zod
        .number({
          required_error: "El id de la empresa es requerido",
          invalid_type_error: "El id de la empresa debe ser un número",
        })
        .int()
        .positive(),
    },
    {
      required_error: "La empresa es requerida",
      invalid_type_error: "La empresa debe ser un objeto con id",
    },
  ),

  complejos: zod
    .array(
      zod.object({
        id: zod
          .number({
            invalid_type_error: "El id del complejo debe ser un número",
          })
          .int()
          .positive(),
      }),
    )
    .optional(),
});

export const createContactoSchema = contactoSchema;
export const updateContactoSchema = contactoSchema.partial();
