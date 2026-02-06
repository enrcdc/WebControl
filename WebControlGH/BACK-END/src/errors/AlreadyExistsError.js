/**
 * Error 409 - Conflicto, recurso ya existe
 *
 * Uso:
 *   throw new AlreadyExistsError('Usuario', 'email', 'user@example.com');
 *   throw new AlreadyExistsError('Obra', 'código', 'OB-001');
 */

import { AppError } from './AppError.js';

export class AlreadyExistsError extends AppError {
  constructor(entityName, field, value, details = null) {
    const message = `${entityName} con ${field} "${value}" ya existe`;

    super(message, 409, true, details);
    this.name = 'AlreadyExistsError';
    this.entityName = entityName;
    this.field = field;
    this.value = value;
  }
}
