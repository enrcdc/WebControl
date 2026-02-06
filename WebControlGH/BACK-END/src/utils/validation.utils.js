/**
 * Utilidades de validación reutilizables
 */

import { InvalidDataError } from '../errors/index.js';

/**
 * Validar que un ID sea válido
 */
export function validateId(id, fieldName = 'id') {
  if (!id || isNaN(Number(id))) {
    throw new InvalidDataError(
      `${fieldName} inválido`,
      { field: fieldName, value: id, message: 'Debe ser un número válido' }
    );
  }
  return Number(id);
}

/**
 * Validar que no esté vacío
 */
export function validateNotEmpty(data, fieldName = 'datos') {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    throw new InvalidDataError(
      `No se proporcionaron ${fieldName}`,
      { field: fieldName, value: data }
    );
  }
  return data;
}

/**
 * Validar y sanitizar string
 */
export function validateAndSanitizeString(value, fieldName = 'campo', options = {}) {
  const { minLength = 0, maxLength = null, allowEmpty = false } = options;

  if (!value || typeof value !== 'string') {
    if (allowEmpty) return null;
    throw new InvalidDataError(
      `${fieldName} debe ser una cadena de texto`,
      { field: fieldName, value }
    );
  }

  const sanitized = value.trim();

  if (!allowEmpty && sanitized === '') {
    throw new InvalidDataError(
      `${fieldName} no puede estar vacío`,
      { field: fieldName, value }
    );
  }

  if (minLength > 0 && sanitized.length < minLength) {
    throw new InvalidDataError(
      `${fieldName} debe tener al menos ${minLength} caracteres`,
      { field: fieldName, value: sanitized, length: sanitized.length }
    );
  }

  if (maxLength && sanitized.length > maxLength) {
    throw new InvalidDataError(
      `${fieldName} no puede exceder ${maxLength} caracteres`,
      { field: fieldName, value: sanitized, length: sanitized.length }
    );
  }

  return sanitized;
}

/**
 * Validar que una fecha no sea futura
 */
export function validateDateNotFuture(dateString, fieldName = 'fecha') {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();

  if (date > now) {
    throw new InvalidDataError(
      `${fieldName} no puede ser futura`,
      { field: fieldName, value: dateString }
    );
  }

  return dateString;
}

/**
 * Validar que fecha2 > fecha1
 */
export function validateDateRange(date1String, date2String, date1Name = 'fecha inicial', date2Name = 'fecha final') {
  if (!date1String || !date2String) return true;

  const date1 = new Date(date1String);
  const date2 = new Date(date2String);

  if (date2 <= date1) {
    throw new InvalidDataError(
      `${date2Name} debe ser posterior a ${date1Name}`,
      {
        field: date2Name,
        value: date2String,
        comparedWith: date1String
      }
    );
  }

  return true;
}

/**
 * Validar rango numérico
 */
export function validateNumberRange(value, fieldName, min = null, max = null) {
  if (value === null || value === undefined) return true;

  const num = Number(value);

  if (isNaN(num)) {
    throw new InvalidDataError(
      `${fieldName} debe ser un número`,
      { field: fieldName, value }
    );
  }

  if (min !== null && num < min) {
    throw new InvalidDataError(
      `${fieldName} debe ser mayor o igual a ${min}`,
      { field: fieldName, value: num, min }
    );
  }

  if (max !== null && num > max) {
    throw new InvalidDataError(
      `${fieldName} debe ser menor o igual a ${max}`,
      { field: fieldName, value: num, max }
    );
  }

  return true;
}
