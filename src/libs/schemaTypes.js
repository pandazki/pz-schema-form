// region 默认 schema 定义

export const EmptySchema = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#"
  };
})();

export const DefaultStringSchema = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "string"
  };
})();

export const DefaultNumberSchema = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "number"
  };
})();

export const DefaultBooleanSchema = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "boolean"
  };
})();

export const DefaultObjectType = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {}
  };
})();

export const DefaultArrayType = (function() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "array",
    items: EmptySchema
  };
})();

// endregion
