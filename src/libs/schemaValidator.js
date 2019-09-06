import * as Ajv from "ajv";
import localizeZH from "ajv-i18n/localize/zh";

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
