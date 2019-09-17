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
      <div class="col-auto row justify-between">
        <div class="text-h4 q-mb-md">Form</div>
        <div class="q-mb-md">
          <q-btn
            class="q-ml-xs"
            color="primary"
            label="切换 JSON"
            @click="forceRaw = !forceRaw"
          />
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
          :forceRaw="forceRaw"
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
        title: "台历配置",
        required: ["editorType", "printConfig"],
        properties: {
          editorType: {
            $id: "#/properties/editorType",
            type: "string",
            title: "编辑器类型",
            default: "CALENDAR",
            enum: ["CALENDAR", "PHOTO_BOOK"],
            pattern: "^(.*)$"
          },
          printConfig: {
            $id: "#/properties/printConfig",
            type: "object",
            title: "印刷生产配置",
            required: ["targets"],
            properties: {
              targets: {
                $id: "#/properties/printConfig/properties/targets",
                type: "array",
                title: "工件列表",
                description: "所有打印工件列表",
                items: {
                  $id: "#/properties/printConfig/properties/targets/items",
                  type: "object",
                  title: "工件",
                  description: "打印工件，原则上每一项应该对应一个打印步骤",
                  required: ["name"],
                  properties: {
                    name: {
                      $id:
                        "#/properties/printConfig/properties/targets/items/properties/name",
                      type: "string",
                      title: "工件文件名",
                      description: "导出工件的文件名",
                      default: "日历-相片",
                      pattern: "^(.*)$"
                    },
                    renderPath: {
                      $id:
                        "#/properties/printConfig/properties/targets/items/properties/renderPath",
                      type: "string",
                      title: "渲染路径",
                      description: "使用 snapshot-render 时的路径",
                      default: "/calendar/photo",
                      pattern: "^(.*)$"
                    },
                    fileType: {
                      $id:
                        "#/properties/printConfig/properties/targets/items/properties/fileType",
                      type: "string",
                      title: "工件格式",
                      description: "导出打印产出物的文件格式",
                      default: "pdf",
                      enum: ["pdf", "zip"]
                    },
                    bleed: {
                      $id:
                        "#/properties/printConfig/properties/targets/items/properties/bleed",
                      type: "object",
                      title: "血线定义",
                      default: null,
                      required: ["total", "layoutBleed", "useLayoutBleed"],
                      properties: {
                        total: {
                          $id:
                            "#/properties/printConfig/properties/targets/items/properties/bleed/properties/total",
                          type: "integer",
                          title: " 总血线宽度",
                          description: "单位：毫米",
                          default: 3
                        },
                        layoutBleed: {
                          $id:
                            "#/properties/printConfig/properties/targets/items/properties/bleed/properties/layoutBleed",
                          type: "integer",
                          title: "设计稿血线宽度",
                          description: "单位：毫米",
                          default: 3,
                          minimum: 0.0,
                          maximum: 10.0
                        },
                        useLayoutBleed: {
                          $id:
                            "#/properties/printConfig/properties/targets/items/properties/bleed/properties/useLayoutBleed",
                          type: "boolean",
                          title: "使用设计稿血线",
                          description:
                            "是否使用设计稿血线 如果不使用则会吃掉使用空白填充",
                          default: false
                        }
                      }
                    },
                    url: {
                      $id:
                        "#/properties/printConfig/properties/targets/items/properties/bleed/properties/url",
                      type: "string",
                      title: "下载路径",
                      format: "uri"
                    }
                  }
                }
              }
            }
          }
        }
      },
      schemaCode: "",
      data: {
        editorType: "CALENDAR",
        printConfig: {
          targets: [
            {
              name: "日历-相片",
              renderPath: "/calendar/photo",
              fileType: "pdf",
              bleed: {
                total: 0,
                layoutBleed: 3,
                useLayoutBleed: false
              }
            },
            {
              name: "日历-功能页",
              url:
                "https://app-cdn.niepce.cloud/static/%E6%97%A5%E5%8E%86-21%2A15-%E5%8A%9F%E8%83%BD%E9%A1%B5.pdf"
            }
          ]
        }
      },
      dataCode: "",
      parsed: {},
      uniqKey: 1,
      forceRaw: false
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
        console.error(error);
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
