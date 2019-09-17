<template>
  <q-select
    filled
    v-model="val"
    :options="schema.enum"
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
  name: "editor-control-select",
  displayName: "Select Input",
  mixins: [valueMixin, formItemMixin],
  data() {
    return {};
  },
  isSuitable(schema) {
    if (Array.isArray(schema.enum)) {
      return true;
    }
  }
};
</script>
