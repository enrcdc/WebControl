import zod from "zod";

const productoSchema = zod.object({
  cod: zod.string({
    required_error: "El código del producto es requerido",
    invalid_type_error:
      "El código del producto debe ser un cadena de caracteres",
  }),
  descripcion: zod.string({
    required_error: "La descripción del producto es requerida",
    invalid_type_error:
      "La descripción del producto debe ser una cadena de texto",
  }),
  etiqueta: zod
    .string({
      invalid_type_error:
        "La etiqueta del producto debe ser una cadena de texto",
    })
    .optional(),
  proveedor: zod
    .number({
      invalid_type_error: "El id del proveedor debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  familia: zod
    .number({
      invalid_type_error: "El id de la familia debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  tipoUnidad: zod
    .number({
      invalid_type_error: "El id del tipo de unidad debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  fechaAlta: zod
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha del alta debe tener un formato válido",
    })
    .optional(),
  usuarioAlta: zod
    .number({
      invalid_type_error: "El id del usuario de alta debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  stock: zod
    .number({
      invalid_type_error: "El stock debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  stockMin: zod
    .number({
      invalid_type_error: "El stock minimo debe ser un número",
    })
    .int()
    .optional(),
  stockMax: zod
    .number({
      invalid_type_error: "El stock maximo debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  marca: zod
    .number({
      invalid_type_error: "El id del tipo de marca debe ser un número",
    })
    .int()
    .positive()
    .optional(),
  precioUnitario: zod
    .number({
      invalid_type_error: "El precio unitario debe ser un número",
    })
    .refine((value) => Number.isInteger(value * 100), {
      message: "El precio unitario debe tener como máximo 2 decimales",
    })
    .positive()
    .optional(),
  precioTotal: zod
    .number({
      invalid_type_error: "El precio total debe ser un número",
    })
    .refine((value) => Number.isInteger(value * 100), {
      message: "El precio unitario debe tener como máximo 2 decimales",
    })
    .positive()
    .optional(),
  observaciones: zod.string().optional(),
});

export function validateProducto(object) {
  return productoSchema.safeParse(object);
}

export function validatePartialProducto(object) {
  return productoSchema.partial().safeParse(object);
}
