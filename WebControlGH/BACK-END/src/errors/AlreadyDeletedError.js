/**
 * Error 410 - Recurso ya eliminado (Gone)
 *
 * Para soft deletes, cuando se intenta operar sobre un recurso eliminado.
 *
 * Uso:
 *   throw new AlreadyDeletedError('Obra', id);
 */

import { AppError } from './AppError.js';

export class AlreadyDeletedError extends AppError {
  constructor(entityName, identifier = null, details = null) {
    const message = identifier
      ? `${entityName} con identificador "${identifier}" ya está eliminado(a)`
      : `${entityName} ya está eliminado(a)`;

    super(message, 410, true, details);
    this.name = 'AlreadyDeletedError';
    this.entityName = entityName;
    this.identifier = identifier;
  }
}
