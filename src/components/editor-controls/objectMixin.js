import baseMixin from "./baseMixin";
import merge from "lodash/merge";

const mixin = {
  props: ["schema", "json", "itemKey", "required", "path"],
  data() {
    return {
      form: {},
      addedFields: []
    };
  },
  watch: {
    json: {
      handler: function(val) {
        if (typeof val === "object" && val !== null) {
          this.form = val;
        } else {
          this.form = {};
        }
        this.addedFields = [];
      },
      immediate: true
    }
  },
  computed: {
    subtitle() {
      return this.itemKey;
    },
    fields() {
      return Object.keys(this.schema.properties);
    },
    unusedFields() {
      // 需要重命名，含义应该是可添加的字段
      const keys = this.fields;
      return keys.filter(
        key => this.form[key] === undefined && this.showFields.indexOf(key) < 0
      );
    },
    usedFields() {
      const keys = this.fields;
      return keys.filter(key => this.form[key] !== undefined);
    },
    showFields() {
      // 所有已经有值或者被添加的字段
      let fields = this.usedFields.concat(this.addedFields);
      // 全部必填字段
      let required = this.schema.required || [];

      required = required.filter(item => fields.indexOf(item) < 0);
      return required.concat(fields);
    },
    requireKeys() {
      return this.schema.required || [];
    }
  },
  methods: {
    mapKeyToKeyText(keys) {
      if (!Array.isArray(keys)) return [];
      return keys.map(key => {
        return {
          key,
          text:
            key +
            ": " +
            (this.schema.properties[key]
              ? this.schema.properties[key].title
              : "")
        };
      });
    },
    addField(key) {
      if (this.unusedFields.indexOf(key) >= 0) {
        this.addedFields = this.addedFields.concat(key);
      }
    },
    removeField(key) {
      let index = this.addedFields.indexOf(key);

      if (index >= 0) {
        this.addedFields.splice(index, 1);
        this.addedFields = this.addedFields.slice();
        return;
      }

      this.$delete(this.form, key);
    },
    async validate() {
      for (const c of this.$refs["controls"] || []) {
        await c.validate();
      }
      await this.schemaValidate(this.getJSON(), this.itemKey);
    },
    getJSON() {
      let v = {};
      for (const c of this.$refs["controls"] || []) {
        const j = c.getJSON();
        if (j !== undefined) v[c.itemKey] = j;
      }
      return v;
    }
  },
  isSuitable() {
    throw new Error("继承 ObjectBase 的组件必须实现 isSuitable");
  }
};

const merged = merge({}, baseMixin, mixin);
export default merged;
