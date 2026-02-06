/**
 * Error 400 - Datos inválidos
 *
 * Uso:
 *   throw new InvalidDataError('El email no es válido', { field: 'email', value: 'abc' });
 *   throw new InvalidDataError('La fecha de fin debe ser posterior a la de inicio');
 */

import { AppError } from './AppError.js';

export class InvalidDataError extends AppError {
  constructor(message, details = null) {
    super(message, 400, true, details);
    this.name = 'InvalidDataError';
  }
}
