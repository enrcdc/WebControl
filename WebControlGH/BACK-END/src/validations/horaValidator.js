import zod from "zod";

const horaSchema = zod.object({
  diaTrabajado: zod
    .string({
      required_error: "El día trabajado es requerido",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "El día trabajado debe tener un formato de fecha válido",
    }),

  usuarioAsignado: zod
    .number({
      required_error: "El usuario asignado es requerido",
      invalid_type_error: "El código de usuario debe ser un número",
    })
    .int()
    .positive(),

  obraAsignada: zod
    .number({
      required_error: "La obra asignada es requerida",
      invalid_type_error: "El id de la obra debe ser un número",
    })
    .int()
    .positive(),

  tareaAsignada: zod
    .number({
      required_error: "La tarea asignada es requerida",
      invalid_type_error: "El id de la tarea debe ser un número",
    })
    .int()
    .positive(),

  horasAsignadas: zod
    .number({
      required_error: "Las horas asignadas son requeridas",
      invalid_type_error: "Las horas asignadas deben ser un número",
    })
    .positive("Las horas asignadas deben ser mayores a 0"),

  observaciones: zod
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .optional(),
});

export const createHoraSchema = horaSchema;
