import baseMixin from "./baseMixin";
import merge from "lodash/merge";

import { isNumber, isString, isBoolean } from "../../libs/utils";

// 为基础的数据类型提供最简单的校验
const mixin = {
  data() {
    return {
      val: ""
    };
  },
  props: ["schema", "json", "itemKey", "required", "path"],
  watch: {
    json: {
      handler: function(val) {
        if (isBoolean(val) || isString(val) || isNumber(val)) {
          this.val = val;
        } else if (val !== undefined) {
          console.warn(`unsupported data: ${val}`);
        } else {
          // undefined 表示被新增的空字段，填上默认值
          switch (this.schema.type) {
            case "string":
              this.val = "";
              break;
            case "number":
            case "integer":
              this.val = 0;
              break;
            case "boolean":
              this.val = false;
              break;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    async validate() {
      // 直接使用 ajv 校验
      await this.schemaValidate(this.val);
    },
    getJSON() {
      return this.val;
    }
  },
  isSuitable(schema) {
    return (
      schema.type === "string" ||
      schema.type === "number" ||
      schema.type === "integer" ||
      schema.type === "boolean"
    );
  }
};
const merged = merge({}, baseMixin, mixin);
export default merged;
