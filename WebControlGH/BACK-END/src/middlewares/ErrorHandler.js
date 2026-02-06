export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            errors: err.details ?? ["Error de validación desconocido"]
        });
    }

    if (err.name === "EmptyUpdateError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.name === "NotFoundError") {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: "Error interno al procesar el recurso"
    });
}