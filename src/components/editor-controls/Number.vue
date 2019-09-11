<template>
  <q-input
    v-model.number="val"
    type="number"
    :label="schema.title"
    :hint="desc"
  />
</template>

<script>
import valueMixin from "./valueMixin";

export default {
  name: "editor-control-number",
  displayName: "Number Input",
  mixins: [valueMixin],
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
