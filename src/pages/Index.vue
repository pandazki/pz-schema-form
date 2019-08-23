<template>
  <q-page class="row flex-stretch">
    <q-splitter v-model="sp1">
      <template v-slot:before>
        <q-splitter v-model="sp2" horizontal>
          <template v-slot:before>
            <div class="row editor-container">
              <MonacoEditor
                class="editor"
                v-model="schemaCode"
                language="json"
                theme="vs-dark"
              />
            </div>
          </template>
          <template v-slot:after>
            <div class="row editor-container">
              <MonacoEditor
                class="editor"
                v-model="dataCode"
                language="json"
                theme="vs-dark"
              />
            </div>
          </template>
        </q-splitter>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.
          </div>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<style lang="stylus" scoped>
.editor-container {
  width: 100%;
  height: 100%;
  background-color: gray;
}

.editor {
  flex: 1;
  height: 100%;
}
</style>

<script>
import MonacoEditor from "vue-monaco";

export default {
  name: "PageIndex",
  data() {
    return {
      sp1: 50,
      sp2: 50,

      schema: {
        title: "A registration form",
        description: "A simple form example.",
        type: "object",
        required: ["firstName", "lastName"],
        properties: {
          firstName: {
            type: "string",
            title: "First name",
            default: "Chuck"
          },
          lastName: {
            type: "string",
            title: "Last name"
          },
          age: {
            type: "integer",
            title: "Age"
          },
          bio: {
            type: "string",
            title: "Bio"
          },
          password: {
            type: "string",
            title: "Password",
            minLength: 3
          },
          telephone: {
            type: "string",
            title: "Telephone",
            minLength: 10
          }
        }
      },
      schemaCode: "",
      data: null,
      dataCode: ""
    };
  },
  watch: {
    schema: {
      handler: function(val) {
        this.schemaCode = JSON.stringify(val, null, 2);
      },
      immediate: true
    }
  },
  components: {
    MonacoEditor
  }
};
</script>
