<template>
  <div
    class="relative-position"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @contextmenu.prevent.stop
  >
    <q-menu touch-position context-menu>
      <q-list dense style="min-width: 100px">
        <q-item v-if="itemKey !== undefined">
          <q-item-section>{{ "Key: " + itemKey }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section>指定组件</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu auto-close anchor="top right" self="top left">
            <q-list>
              <q-item v-for="c in validControls" :key="c.name" dense clickable>
                <q-item-section @click="changeControl(c.name)">
                  <div class="row no-wrap">
                    <div class="col-2" style="min-width:20px">
                      <q-icon v-if="c.name == controlName" name="check" />
                    </div>
                    <div class="col-auto">{{ c.displayName }}</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>关闭菜单</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <component
      ref="control"
      :is="control"
      :schema="schema"
      :json="editing"
      :itemKey="itemKey"
      :required="required"
      :path="path || [itemKey]"
    >
    </component>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-btn
        class="absolute-top-right q-ma-sm"
        round
        size="sm"
        color="warning"
        icon="delete_forever"
        @click="remove"
        v-if="hover && removable"
      >
      </q-btn>
    </transition>
  </div>
</template>

<script>
import { isObject, isArray } from "../../libs/utils";
import keyBy from "lodash/keyBy";

export default {
  name: "editor-control",
  props: {
    schema: {
      type: Object
    },
    json: null,
    itemKey: {
      type: [String, Number]
    },
    required: {
      type: Boolean,
      default: false
    },
    path: {
      type: Array
    },
    forceRaw: {
      type: Boolean,
      default: false
    }
  },

  beforeCreate: function() {
    // 部分组件存在循环引用，需要放在 beforecreate 中
    this.$options.components.RawJSON = require("./RawJSON.vue").default;
    // this.$options.components.TopObject = require("./TopObject.vue").default;
    // this.$options.components.TopArray = require("./TopArray.vue").default;
    // this.$options.components.TopNull = require("./TopNull.vue").default;
    // this.$options.components.GeneralInput = require("./GeneralInput.vue").default;
    this.$options.components.String = require("./String.vue").default;
    this.$options.components.Number = require("./Number.vue").default;
    this.$options.components.Boolean = require("./Boolean.vue").default;
    this.$options.components.Color = require("./Color.vue").default;
    // this.$options.components.Switch = require("./Switch.vue").default;
    // this.$options.components.Radio = require("./Radio.vue").default;
    // this.$options.components.SelectString = require("./SelectString.vue").default;
    this.$options.components.Select = require("./Select.vue").default;
    // this.$options.components.SelectNumber = require("./SelectNumber.vue").default;
    // this.$options.components.Slider = require("./Slider.vue").default;
    this.$options.components.Object = require("./Object.vue").default;
    this.$options.components.Array = require("./Array.vue").default;
    // this.$options.components.Checkbox = require("./Checkbox.vue").default;
    // this.$options.components.ExtType = require("./ExtType.vue").default;
    // this.$options.components.DynamicKeyObject = require("./DynamicKeyObject.vue").default;
    // this.$options.components.TopDynamicKeyObject = require("./TopDynamicKeyObject.vue").default;
  },
  beforeMount() {
    this.controls = [
      // 顺序表示优先级，原则上越特定的组件放在最前面
      // // 自定义类型
      // this.$options.components.ExtType,
      // this.$options.components.Checkbox,
      this.$options.components.Color,
      // // 嵌套类型
      // this.$options.components.TopDynamicKeyObject,
      // this.$options.components.DynamicKeyObject,
      // this.$options.components.TopObject,
      this.$options.components.Object,
      // this.$options.components.TopArray,
      this.$options.components.Array,
      // // 基础类型
      // this.$options.components.Radio,
      this.$options.components.Select,
      this.$options.components.String,
      // this.$options.components.SelectNumber,
      // this.$options.components.Slider,
      this.$options.components.Number,
      this.$options.components.Boolean
      // this.$options.components.Switch,
      // this.$options.components.GeneralInput,
      // this.$options.components.TopNull
    ];

    this.controlDict = keyBy(this.controls, "name");
    this.detectControl(this.schema);
  },
  data() {
    return {
      editing: undefined,
      controls: [],
      validControls: [],
      controlDict: {},
      // control: null,
      controlName: "",
      dialog: false,

      // view
      hover: false
    };
  },
  watch: {
    forceRaw() {
      // 为了保证切换时数据已经更变，修改一次数据
      let json = this.getJSON();
      if (isObject(json)) {
        this.editing = Object.assign({}, json);
      } else if (isArray(json)) {
        this.editing = json.slice();
      } else {
        this.editing = json;
      }

      this.detectControl(this.schema);
    },
    json: {
      handler: function(val) {
        if (this.editing === undefined) this.editing = val;
      },
      immediate: true
    },
    schema: {
      handler: function(val) {
        this.detectControl(val);
      },
      immediate: true
    }
  },
  computed: {
    control() {
      return (
        this.controlDict[this.controlName] || this.$options.components.RawJSON
      );
    },
    removable() {
      return (
        this.path && // 第一级元素不能删除
        this.path.length > 1 &&
        !this.required && // 必填元素不能删除
        !(this.schema && this.schema.constant) // platform 不能删除
      );
    }
  },
  methods: {
    detectControl(val) {
      this.validControls = this.controls.filter(
        c =>
          c.isSuitable(val, this.path || [this.itemKey]) ||
          c.name === val.controlName
      );
      // 优先级 0：不存在 schema 或 指定了 RawJSON 时，强制使用 RawJSON
      if (!val || this.forceRaw) {
        this.controlName = this.$options.components.RawJSON.name;
        return;
      }
      // 优先级 1：当 schema 中指定了控件，并且控件被加载，则使用
      if (val.controlName && this.controlDict[val.controlName]) {
        this.controlName = val.controlName;
        return;
      }

      if (this.validControls.length > 0) {
        this.controlName = this.validControls[0].name;
      }
      if (!this.controlName)
        this.controlName = this.$options.components.RawJSON.name;
    },
    async changeControl(controlName) {
      if (controlName === this.controlName) return;
      try {
        await this.$refs.control.validate();
        this.editing = this.$refs.control.getJSON();
        this.controlName = controlName;
      } catch (error) {
        console.warn(error);
        this.$q.notify({
          message: "该节点数据无效，切换控件将会导致数据丢失，请先填写有效数据",
          position: "top",
          timeout: 3000
        });
      }
    },
    async validate() {
      if (this.$refs.control.validate) await this.$refs.control.validate();
      return true;
    },
    getJSON() {
      return this.$refs.control.getJSON
        ? this.$refs.control.getJSON()
        : undefined;
    },
    remove() {
      if (this.removable) {
        this.$emit("remove");
      } else {
        this.$q.notify({
          message: "该节点不允许删除",
          position: "top",
          timeout: 3000
        });
      }
    }
  }
};
</script>
