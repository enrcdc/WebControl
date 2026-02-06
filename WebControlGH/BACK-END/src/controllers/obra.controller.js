/**
 * Controlador de Obras - VERSIÓN REFACTORIZADA
 *
 * El controlador SOLO maneja:
 * - Extracción de datos del request (params, query, body)
 * - Llamadas al servicio
 * - Formateo de respuestas HTTP
 * - Delegación de errores al middleware
 *
 * NO contiene lógica de negocio.
 */

import { success } from "zod";
import { ObraService } from "../services/obra.service.js";

export class ObraController {
  /**
   * GET /api/obra
   * Obtener todas las obras
   */
  static async getAll(req, res, next) {
    try {
      const obras = await ObraService.getAll();

      res.json({
        success: true,
        data: obras,
        count: obras.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/obra/:idObra
   * Obtener obra por ID
   */
  static async getById(req, res, next) {
    try {
      const { idObra } = req.params;

      const obra = await ObraService.getById(idObra);

      res.json({
        success: true,
        data: obra,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/obra/search?descripcion=xxx
   * Buscar obras por descripción
   */
  static async getByDescripcion(req, res, next) {
    try {
      const { descripcionObra } = req.query;

      const obras = await ObraService.getByDescripcion(descripcionObra);

      res.json({
        success: true,
        data: obras,
        count: obras.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/obra
   * Crear nueva obra
   */
  static async create(req, res, next) {
    try {
      const obraData = req.body;

      const nuevaObra = await ObraService.create(obraData);

      res.status(201).json({
        success: true,
        message: "Obra creada exitosamente",
        data: nuevaObra,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/obra/:idObra
   * Actualizar obra existente
   */
  static async update(req, res, next) {
    try {
      const { idObra } = req.params;
      const updateData = req.body;

      const obraActualizada = await ObraService.update(idObra, updateData);

      res.json({
        success: true,
        message: "Obra actualizada exitosamente",
        data: obraActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/obra/:idObra
   * Eliminar obra (soft delete)
   */
  static async delete(req, res, next) {
    try {
      const { idObra } = req.params;
      const { codigoUsuarioBaja } = req.body;

      const obraEliminada = await ObraService.delete(idObra, codigoUsuarioBaja);

      res.json({
        success: true,
        message: "Obra eliminada exitosamente",
        data: obraEliminada,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/obra/estadisticas
   * Obtener estadísticas de obras
   */
  static async getEstadisticas(req, res, next) {
    try {
      const stats = await ObraService.getEstadisticas();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/obra/filtrar?empresa=1&estado=2
   * Buscar obras con filtros avanzados
   */
  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.query;

      const obras = await ObraService.buscarConFiltros(filtros);

      res.json({
        success: true,
        data: obras,
        count: obras.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}
