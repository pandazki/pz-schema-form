<template>
  <q-input :label="schema.title" v-model="val" :hint="desc">
    <template v-slot:prepend>
      <q-icon
        name="crop_free"
        color="grey-11"
        class="cursor-pointer"
        :style="{ 'background-color': val }"
      >
        <q-popup-proxy>
          <q-color v-model="color" @change="colorChanged" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import valueMixin from "./valueMixin";

export default {
  name: "editor-control-color",
  displayName: "Color Picker",
  mixins: [valueMixin],
  data() {
    return {
      color: "",
      showHint: false
    };
  },
  watch: {
    val: {
      handler: function(newValue) {
        this.color = newValue;
      },
      immediate: true
    }
  },
  isSuitable(schema) {
    // 特殊的处理器尽可能的严格，减少错误的自动适配，如果有需要可以在 schema 中指定 controlName 强制使用
    if (schema.type === "string" && schema.pattern === "^(#[0-9a-fA-f]{6})$") {
      return true;
    }
  },
  methods: {
    colorChanged(v) {
      this.val = v;
    }
  }
};
</script>
