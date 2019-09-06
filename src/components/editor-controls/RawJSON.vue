<template>
  <div class="column full-height no-wrap">
    <div class="q-ma-sm col-auto">{{ schema.title }}</div>
    <MonacoEditor
      class="col-grow"
      style="min-height:100px"
      v-model="jsonCode"
      language="json"
      theme="vs-dark"
      :options="options"
    />
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import MonacoEditor from "vue-monaco";

export default {
  beforeMount() {},
  mixins: [baseMixin],
  name: "editor-control-raw-json",
  data() {
    return {
      jsonCode: "",
      options: {
        automaticLayout: true
      }
    };
  },
  props: ["schema", "json", "required", "path"],
  computed: {},
  watch: {
    json: {
      handler: function(val) {
        if (val === undefined) {
          this.jsonCode = "";
        } else {
          this.jsonCode = JSON.stringify(val, null, 2);
        }
      },
      immediate: true
    }
  },
  methods: {
    async validate() {
      if (!this.required && !this.jsonCode) return;

      let jsonObj;
      try {
        jsonObj = JSON.parse(this.jsonCode);
        // eslint-disable-next-line no-empty
      } catch (error) {}

      await this.schemaValidate(jsonObj, this.itemKey);
    },
    getJSON() {
      if (!this.jsonCode) return undefined;
      return JSON.parse(this.jsonCode);
    }
  },
  components: {
    MonacoEditor
  },
  isSuitable() {
    // 最基础的编辑组件，适用于所有 schema
    return true;
  }
};
</script>

<style></style>
