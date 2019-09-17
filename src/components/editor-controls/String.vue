<template>
  <q-input
    filled
    v-model="val"
    :label="schema.title"
    :hint="desc"
    @input="validate"
    :error-message="errorMsg"
    :error="errorMsg !== undefined"
  />
</template>

<script>
import valueMixin from "./valueMixin";
import formItemMixin from "./formItemMixin";

export default {
  name: "editor-control-string",
  displayName: "String Input",
  mixins: [valueMixin, formItemMixin],
  data() {
    return {};
  },
  isSuitable(schema) {
    if (schema.type === "string") {
      return true;
    }
  }
};
</script>
