import zod from "zod";

const comprasSchema = zod.object({
    numero: zod.string({
        required_error: "El número es requerido"
    }),

    fechaFactura: zod.string({
        required_error: "La fecha es requerida"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "La fecha debe tener un formato válido"
    }),

    concepto: zod.string({
        required_error: "El concepto es requerido"
    }),

    proveedor: zod.string({
        required_error: "El proveedor es requerido"
    }).min(1, "El proveedor no puede estar vacío"),

    tipo: zod.string({
        required_error: "El tipo es requerido"
    }),

    baseIva: zod.number({
        required_error: "EL baseIva es requerido"
    }).refine(value => {
        return Number.isInteger(value * 100)
    }, {
        message: "El baseIva debe de tener como máximo 2 decimales"
    }).positive(),

    totalIva: zod.number({
        required_error: "El totalIva es requerido",
        invalid_type_error: "El totalIva debe ser un número"
    }).refine(value => Number.isInteger(value * 100), {
        message: "El totalIva puede tener máximo 2 decimales"
    }).positive(),

    asignado: zod.boolean({
        required_error: "El campo asignado es requerido",
        invalid_type_error: "El campo asignado debe ser booleano"
    }),

    totalAsignado: zod.number({
        required_error: "El totalAsignado es requerido"
    }).int().positive(),

    observaciones: zod.string({
        required_error: "Las observaciones son requeridas"
    }),
})

export function validateCompra(object) {
    return comprasSchema.safeParse(object);
}

export function validatePartialCompra(object) {
    return comprasSchema.partial().safeParse(object);
}