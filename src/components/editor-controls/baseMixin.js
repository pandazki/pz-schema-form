import EditorControl from "./index";
import { schemaValidate } from "../../libs/schemaValidator";

export default {
  data() {
    return {};
  },
  props: ["schema", "json", "itemKey", "required", "path"],
  computed: {
    desc() {
      if (!this.schema.description) return;

      return this.schema.description;
    }
  },
  watch: {
    schema: {
      handler: function(val) {
        if (!val) {
          console.error(`invalid schema: ${val} with data ${this.json}`);
        }
      },
      immediate: true
    }
  },
  methods: {
    async validate() {
      throw new Error("继承 Base 的组件必须实现 validate");
    },
    getJSON() {
      throw new Error("继承 Base 的组件必须实现 getJSON");
    },
    async schemaValidate(json, itemKey = "$") {
      console.log(this.schema, json, itemKey);
      schemaValidate(this.schema, json, itemKey);
    }
  },
  components: {
    EditorControl
  },
  // eslint-disable-next-line no-unused-vars
  isSuitable(schema) {
    throw new Error("继承 Base 的组件必须实现 isSuitable");
  }
};
