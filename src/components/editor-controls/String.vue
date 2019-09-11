<template>
  <q-input v-model="val" :label="schema.title" :hint="desc" />
</template>

<script>
import valueMixin from "./valueMixin";

export default {
  name: "editor-control-string",
  displayName: "String Input",
  mixins: [valueMixin],
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
