<template>
  <q-expansion-item
    expand-separator
    :label="schema.title"
    :caption="desc"
    :default-opened="true"
  >
    <div class="row">
      <div class="col-auto q-mr-sm">
        <q-separator vertical />
      </div>
      <div class="col-grow column q-ml-md no-wrap">
        <editor-control
          class="col col-auto"
          ref="controls"
          v-for="(value, index) in form"
          :itemKey="index"
          :key="index"
          :required="false"
          :schema="schema.items"
          :json="
            value !== undefined ? JSON.parse(JSON.stringify(value)) : undefined
          "
          :path="path.concat(index)"
          @remove="removeItem(index)"
        />
        <template v-if="!schema.maxItems || this.form.length < schema.maxItems">
          <q-btn class="q-my-xs" @click="addItem" label="添加元素"></q-btn>
        </template>
      </div>
    </div>
  </q-expansion-item>
</template>

<script>
import arrayMixin from "./arrayMixin";

export default {
  name: "editor-control-array",
  displayName: "List",
  mixins: [arrayMixin],
  data() {
    return {};
  },
  methods: {},
  isSuitable(schema) {
    if (schema.type === "array" && schema.items) {
      return true;
    }
  }
};
</script>
