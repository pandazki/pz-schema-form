export function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

export const isArray = Array.isArray;

export function isString(value) {
  return typeof value === "string" || value instanceof String;
}
export function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

export function isBoolean(value) {
  return typeof value === "boolean";
}
