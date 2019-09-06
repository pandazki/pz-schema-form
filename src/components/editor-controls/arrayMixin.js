import baseMixin from "./baseMixin";
import merge from "lodash/merge";

const mixin = {
  props: ["schema", "json", "itemKey", "required", "path"],
  data() {
    return {
      form: []
    };
  },
  watch: {
    json: {
      handler: function(val) {
        if (Array.isArray(val)) {
          this.form = val;
        } else {
          this.form = [];
        }
      },
      immediate: true
    }
  },
  computed: {
    controls() {
      return this.$refs["controls"] || [];
    }
  },
  methods: {
    addItem() {
      let array = this.form.slice();
      array.push(undefined);
      this.form = array;
    },
    removeItem(key) {
      this.refresh();
      let array = this.form.slice();
      array.splice(key, 1);
      this.form = array;
    },
    refresh() {
      const r = [];
      for (let i = 0; i < this.form.length; i++) {
        r.push(this.controls[i].getJSON());
      }
      this.form = r;
    },
    async validate() {
      for (const c of this.$refs["controls"] || []) {
        await c.validate();
      }
      await this.schemaValidate(this.getJSON(), this.itemKey);
    },
    getJSON() {
      let v = [];
      let controls = this.controls.sort((a, b) => a.itemKey - b.itemKey);
      for (const c of controls) {
        const value = c.getJSON();
        if (value) v.push(c.getJSON());
      }
      return v;
    }
  },
  isSuitable(schema) {
    return schema.type === "array";
  }
};

const merged = merge({}, baseMixin, mixin);
export default merged;
