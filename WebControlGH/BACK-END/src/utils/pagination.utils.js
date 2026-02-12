const DEFAULT_LIMIT = 200;

/**
 * Aplica paginación a una query Knex y devuelve los datos con metadatos de paginación.
 *
 * - Si no se proporciona `limit`, se aplica el límite por defecto (200).
 * - Si `limit=0`, se devuelven todos los registros sin paginación.
 * - Cuando la paginación está activa, se ejecuta una query COUNT adicional
 *   para obtener el total de registros (antes de aplicar limit/offset).
 *
 * @param {import("knex").Knex.QueryBuilder} query - Query Knex construida con filtros
 * @param {Object} filters - Objeto de filtros (puede contener limit y offset)
 * @param {number|string} [filters.limit] - Número máximo de registros. 0 = sin límite
 * @param {number|string} [filters.offset] - Número de registros a saltar
 * @returns {Promise<{data: Array, pagination: {total: number, limit: number, offset: number}|null}>}
 */
export async function applyPagination(query, filters = {}) {
  const limit =
    filters.limit !== undefined ? Number(filters.limit) : DEFAULT_LIMIT;
  const offset =
    filters.offset !== undefined ? Number(filters.offset) : 0;

  // limit=0 → sin límite, devolver todo
  if (limit === 0) {
    const data = await query;
    return { data, pagination: null };
  }

  // COUNT total antes de aplicar limit/offset
  const { total } = await query
    .clone()
    .clearSelect()
    .clearOrder()
    .count("* as total")
    .first();

  const data = await query.limit(limit).offset(offset);

  return { data, pagination: { total: Number(total), limit, offset } };
}
