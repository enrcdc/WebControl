import zod from "zod";

const pedidoObraSchema = zod.object({
  fecha: zod
    .string({
      required_error: "La fecha del pedido es requerida",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha del pedido debe tener un formato válido",
    }),

  codigoPedido: zod.string({
    required_error: "El código de pedido es requerido",
    invalid_type_error: "El código de pedido debe ser una cadena de texto",
  }),

  posicion: zod
    .string({
      invalid_type_error: "La posición debe ser una cadena de texto",
    })
    .optional(),

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

  idObra: zod
    .number({
      required_error: "El id de la obra es requerido",
      invalid_type_error: "El id de la obra debe ser un número",
    })
    .int()
    .positive(),
});

export const createPedidoObraSchema = pedidoObraSchema;
export const updatePedidoObraSchema = pedidoObraSchema.omit({ idObra: true }).partial();
