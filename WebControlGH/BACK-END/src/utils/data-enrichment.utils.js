/**
 * Utilidades para enriquecimiento de datos
 */

/**
 * Calcular días entre dos fechas
 */
export function calculateDaysBetween(date1, date2 = new Date()) {
  if (!date1) return null;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Verificar si una fecha está vencida
 */
export function isDateExpired(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  return date < now;
}

/**
 * Calcular porcentaje
 */
export function calculatePercentage(partial, total, decimals = 2) {
  if (!total || total === 0) return 0;

  const percentage = (partial / total) * 100;
  return Number(percentage.toFixed(decimals));
}

/**
 * Calcular desviación porcentual
 */
export function calculateDeviation(expected, actual, decimals = 2) {
  if (!expected || expected === 0) return null;

  const deviation = ((actual - expected) / expected) * 100;
  return Number(deviation.toFixed(decimals));
}

/**
 * Agrupar array por campo
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Contar ocurrencias en array por campo
 */
export function countBy(array, key) {
  return array.reduce((result, item) => {
    const countKey = item[key] || 'Sin valor';
    result[countKey] = (result[countKey] || 0) + 1;
    return result;
  }, {});
}

/**
 * Sumar valores de un campo en array
 */
export function sumBy(array, key) {
  return array.reduce((sum, item) => {
    return sum + (Number(item[key]) || 0);
  }, 0);
}

/**
 * Calcular promedio de un campo en array
 */
export function averageBy(array, key) {
  if (!array || array.length === 0) return 0;

  const sum = sumBy(array, key);
  return sum / array.length;
}
