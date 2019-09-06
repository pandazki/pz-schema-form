<template>
  <q-field :label="schema.title" stack-label :hint="desc">
    <template v-slot:control>
      <q-toggle class="full-width" v-model="val" color="primary" />
    </template>
  </q-field>
</template>

<script>
import valueMixin from "./valueMixin";

export default {
  name: "editor-control-boolean",
  mixins: [valueMixin],
  data() {
    return {};
  },
  isSuitable(schema) {
    if (schema.type === "boolean") {
      return true;
    }
  }
};
</script>
