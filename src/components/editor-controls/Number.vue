<template>
  <q-input
    filled
    v-model.number="val"
    type="number"
    :label="schema.title"
    @input="validate"
    :hint="desc"
    :error-message="errorMsg"
    :error="errorMsg !== undefined"
  />
</template>

<script>
import valueMixin from "./valueMixin";
import formItemMixin from "./formItemMixin";

export default {
  name: "editor-control-number",
  displayName: "Number Input",
  mixins: [valueMixin, formItemMixin],
  data() {
    return {};
  },
  isSuitable(schema) {
    if (schema.type === "number" || schema.type === "integer") {
      return true;
    }
  }
};
</script>
