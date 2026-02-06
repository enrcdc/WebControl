/**
 * Barrel export para errores personalizados
 *
 * Uso:
 *   import { NotFoundError, InvalidDataError } from '../errors/index.js';
 */

export { AppError } from './AppError.js';
export { NotFoundError } from './NotFoundError.js';
export { InvalidDataError } from './InvalidDataError.js';
export { AlreadyExistsError } from './AlreadyExistsError.js';
export { AlreadyDeletedError } from './AlreadyDeletedError.js';
export { ForbiddenError } from './ForbiddenError.js';
export { UnauthorizedError } from './UnauthorizedError.js';
