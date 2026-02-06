/**
 * Error 403 - Prohibido
 *
 * El usuario está autenticado pero no tiene permisos para esta acción.
 *
 * Uso:
 *   throw new ForbiddenError('No tienes permisos para eliminar esta obra');
 *   throw new ForbiddenError('Solo el creador puede editar este recurso');
 */

import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción', details = null) {
    super(message, 403, true, details);
    this.name = 'ForbiddenError';
  }
}
