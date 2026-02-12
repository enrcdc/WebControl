import zod from "zod";

const facturaObraSchema = zod.object({
  idPedido: zod
    .number({
      required_error: "El id del pedido es requerido",
      invalid_type_error: "El id del pedido debe ser un número",
    })
    .int()
    .positive(),

  fechaFactura: zod
    .string({
      required_error: "La fecha de la factura es requerida",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de la factura debe tener un formato válido",
    }),

  codigo: zod.string({
    required_error: "El código de factura es requerido",
    invalid_type_error: "El código de factura debe ser una cadena de texto",
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

  conceptoLinea: zod
    .string({
      invalid_type_error: "El concepto de línea debe ser una cadena de texto",
    })
    .optional(),

  conceptoFactura: zod
    .string({
      invalid_type_error: "El concepto de factura debe ser una cadena de texto",
    })
    .optional(),

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

  cobrado: zod
    .boolean({
      invalid_type_error: "El campo cobrado debe ser un booleano",
    })
    .optional(),

  fechaCobro: zod
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullish()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      {
        message: "La fecha de cobro debe tener un formato válido",
      },
    ),
});

export const createFacturaObraSchema = facturaObraSchema;
export const updateFacturaObraSchema = facturaObraSchema.omit({ idObra: true }).partial();
