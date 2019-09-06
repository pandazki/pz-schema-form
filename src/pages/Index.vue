<template>
  <q-page class="row flex-stretch full-height" style="overflow:hidden">
    <div class="q-pa-md column col full-height">
      <div class="col column no-wrap">
        <div class="text-h4 q-mb-md col-auto">Data</div>
        <MonacoEditor
          class="col-grow"
          v-model="dataCode"
          language="json"
          theme="vs-dark"
          @change="originChange"
        />
      </div>
      <div class="col column no-wrap">
        <div class="text-h4 q-ma-md col-auto">Schema</div>
        <MonacoEditor
          class="col-grow"
          v-model="schemaCode"
          language="json"
          theme="vs-dark"
          @change="schemaChange"
        />
      </div>
    </div>

    <div class="q-pa-md col full-height column no-wrap" style="overflow:scroll">
      <div class=" col-auto row justify-between">
        <div class="text-h4 q-mb-md">Form</div>
        <div class="q-mb-md">
          <q-btn class="q-ml-xs" color="primary" label="重载" @click="reload" />
          <q-btn
            class="q-ml-xs"
            color="primary"
            label="检查"
            @click="validate"
          />
          <q-btn class="q-ml-xs" color="primary" label="保存" @click="save" />
        </div>
      </div>
      <div class="col-grow">
        <editor-control
          :key="uniqKey"
          ref="control"
          :schema="parsed.schema"
          :json="parsed.data"
          :itemKey="parsed ? parsed.path[parsed.path.length - 1] : undefined"
          :forceRaw="false"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" scoped></style>

<script>
import MonacoEditor from "vue-monaco";
import EditorControl from "../components/editor-controls/index";
import { parse } from "../libs/parser";
import { defaultDetect } from "../libs/detect";

export default {
  name: "PageIndex",
  data() {
    return {
      option: {
        automaticLayout: true
      },
      schema: {
        definitions: {},
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "http://example.com/root.json",
        type: "object",
        title: "The Root Schema",
        required: ["ss"],
        properties: {
          ss: {
            $id: "#/properties/ss",
            type: "array",
            title: "The Ss Schema",
            items: {
              $id: "#/properties/ss/items",
              type: "object",
              title: "The Items Schema",
              required: [
                "basePieces",
                "baseThickness",
                "piecesStep",
                "thicknessStep"
              ],
              properties: {
                isChecked: {
                  $id: "#/properties/ss/items/properties/isChecked",
                  type: "boolean",
                  title: "检查",
                  description: "是否已经检查",
                  default: false
                },
                color: {
                  $id: "#/properties/ss/items/properties/color",
                  type: "string",
                  title: "颜色",
                  default: "#ffffff",
                  controlName: "editor-control-color"
                },
                basePieces: {
                  $id: "#/properties/ss/items/properties/basePieces",
                  type: "integer",
                  title: "The Basepieces Schema",
                  default: 0,
                  examples: [28]
                },
                baseThickness: {
                  $id: "#/properties/ss/items/properties/baseThickness",
                  type: "integer",
                  title: "The Basethickness Schema",
                  default: 0,
                  examples: [9]
                },
                piecesStep: {
                  $id: "#/properties/ss/items/properties/piecesStep",
                  type: "integer",
                  title: "The Piecesstep Schema",
                  default: 0,
                  examples: [4]
                },
                thicknessStep: {
                  $id: "#/properties/ss/items/properties/thicknessStep",
                  type: "number",
                  title: "The Thicknessstep Schema",
                  default: 0,
                  examples: [0.5]
                }
              }
            }
          }
        }
      },
      schemaCode: "",
      data: {
        ss: [
          {
            basePieces: 28,
            baseThickness: 9,
            piecesStep: 4,
            thicknessStep: 0.5,
            color: "#123123"
          },
          {
            basePieces: 28,
            baseThickness: 9,
            piecesStep: 4,
            specifiedValue: "asd"
          }
        ]
      },
      dataCode: "",
      parsed: {},
      uniqKey: 1
    };
  },
  watch: {
    schema: {
      handler: function(val) {
        this.schemaCode = JSON.stringify(val, null, 2);
        this.parsed = parse(this.data, [], defaultDetect, val);
      },
      immediate: true
    },
    data: {
      handler: function(val) {
        this.dataCode = JSON.stringify(val, null, 2);
        this.parsed = parse(val, [], defaultDetect, this.schema);
      },
      immediate: true
    }
  },
  methods: {
    async validate() {
      try {
        await this.$refs.control.validate();
        this.$q.notify({
          message: "ok",
          position: "top",
          timeout: 8000
        });
        return true;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          color: "red",
          message: error.message,
          position: "top",
          timeout: 8000
        });
      }
    },
    reload() {
      this.uniqKey++;
    },
    async save() {
      let v = await this.validate();
      if (v) {
        this.data = this.$refs.control.getJSON();
        this.dataCode = JSON.stringify(this.data);
      }
    },
    originChange(v) {
      try {
        this.data = JSON.parse(v);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    schemaChange(v) {
      try {
        this.schema = JSON.parse(v);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  },
  components: {
    MonacoEditor,
    EditorControl
  }
};
</script>
