// Regex oficial para UUID v4
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Verifica se o valor fornecido é um UUID v4 válido.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUUID(value) {
  return UUID_V4_REGEX.test(value);
}
