import * as Ajv from "ajv";
import localizeZH from "ajv-i18n/localize/zh";

// 返回可复用的 validate
export function compile(schema) {
  let ajv = new Ajv({ allErrors: true });

  let v = ajv.compile(schema);
  return function(data, itemKey) {
    v["zhErrors"] = function(dataVar = "") {
      localizeZH(v.errors);
      return ajv.errorsText(v.errors, {
        dataVar
      });
    };
    if (!v(data)) {
      throw new Error(v.zhErrors(itemKey));
    }
  };
}

//  可以直接使用的 validate
export function schemaValidate(schema, data, itemKey = "$") {
  let ajv = new Ajv({ allErrors: true });

  ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
  ajv["zhErrors"] = function(dataVar = "") {
    localizeZH(ajv.errors);
    return ajv.errorsText(undefined, {
      dataVar
    });
  };
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.zhErrors(itemKey));
  }
}
