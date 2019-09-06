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
          class="col col-auto q-my-xs"
          ref="controls"
          v-for="fieldName in showFields"
          :itemKey="fieldName"
          :key="fieldName"
          :required="requireKeys.indexOf(fieldName) >= 0"
          :schema="schema.properties[fieldName]"
          :json="
            form && form[fieldName] !== undefined
              ? JSON.parse(JSON.stringify(form[fieldName]))
              : undefined
          "
          :path="path.concat(fieldName)"
          @remove="removeField(fieldName)"
        />
        <q-btn
          v-if="unusedFields.length > 0"
          class="q-my-xs"
          label="添加其他属性"
        >
          <q-menu fit auto-close>
            <template v-for="keyText in mapKeyToKeyText(unusedFields)">
              <q-item
                :key="keyText.key"
                clickable
                @click="addField(keyText.key)"
              >
                <q-item-section>{{ keyText.text }}</q-item-section>
              </q-item>
            </template>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-expansion-item>
</template>

<script>
import objectMixin from "./objectMixin";

export default {
  name: "editor-control-object",
  mixins: [objectMixin],
  data() {
    return {};
  },
  methods: {},
  isSuitable(schema) {
    if (
      schema.type === "object" &&
      schema.properties &&
      Object.keys(schema.properties).length > 0
    ) {
      return true;
    }
  }
};
</script>
