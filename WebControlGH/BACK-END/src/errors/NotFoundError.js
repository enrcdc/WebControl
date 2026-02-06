/**
 * Error 404 - Recurso no encontrado
 *
 * Uso:
 *   throw new NotFoundError('Obra', id);
 *   throw new NotFoundError('Usuario', email);
 */

import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(entityName, identifier = null, details = null) {
    const message = identifier
      ? `${entityName} con identificador "${identifier}" no encontrado(a)`
      : `${entityName} no encontrado(a)`;

    super(message, 404, true, details);
    this.name = 'NotFoundError';
    this.entityName = entityName;
    this.identifier = identifier;
  }
}
