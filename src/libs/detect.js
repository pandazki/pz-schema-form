import * as type from "./schemaTypes";

/**
 * 根据 json 对象，根元素相对路径，和根前缀确认有效的 schema
 *
 * @interface SchemaDetect
 */
// export interface SchemaDetect {
//   (obj: any, path?: string[], rootPrefix?: string): type.Schema | undefined
// }

// eslint-disable-next-line no-unused-vars
export const defaultDetect = function(obj, path = [], rootPrefix = "") {
  // if (utils.isString(obj)) return type.DefaultStringSchema
  // else if (utils.isNumber(obj)) return type.DefaultNumberSchema
  // else if (utils.isBoolean(obj)) return type.DefaultBooleanSchema
  // else if (utils.isObject(obj)) return type.DefaultObjectType
  // else if (utils.isArray(obj)) return type.DefaultArrayType

  return type.EmptySchema;
};
