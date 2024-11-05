<template>
  <div style="height: 100%">
    <a-space style="padding: 5px 0 5px 0">
      <a-select
          v-model:value="datasourceName"
          style="width: 120px"
          :options="datasourceData"
      ></a-select>
      <a-select
          v-model:value="databaseName"
          style="width: 120px"
          :options="databaseData"
      ></a-select>
      <a-button class="green" @click="console.log(templateContent)">
        <SaveOutlined/>
        保存
      </a-button>
      <a-button type="primary">
        <PlayCircleOutlined/>
        运行
      </a-button>
    </a-space>
    <splitpanes horizontal style="height: calc(100% - 42px)">
      <pane :min-size="10" style="overflow: auto;">
        <codemirror
            style="height: 100%"
            v-model="templateContent"
            :extensions="extensions"
            class="codemirror-container"
        />
      </pane>
      <pane :min-size="10">
        <codemirror
            v-model="templateContent"
            :extensions="extensions"
            class="codemirror-container"
        />
      </pane>
    </splitpanes>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {PlayCircleOutlined, SaveOutlined} from "@ant-design/icons-vue";
import {Codemirror} from "vue-codemirror";
import {basicSetup} from "codemirror";
import {search} from "@codemirror/search";
import {autocompletion, CompletionContext} from "@codemirror/autocomplete";
import {oneDark} from "@codemirror/theme-one-dark";
import {EditorView} from "@codemirror/view";
import { sql } from '@codemirror/lang-sql';

const datasourceName = ref('')
const databaseName = ref('')
const datasourceData = ref([])
const databaseData = ref([])

const templateContent = ref('import from');
const customCompletion = autocompletion({
  override: [
    (context: CompletionContext) => {
      let word = context.matchBefore(/\w*/);
      if (!word || word.from == word.to) return null;
      if (context.explicit || word) {
        return {
          from: word.from,
          options: [
            {label: "hello", type: "variable", info: "(World)"},
            {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"},
            { label: 'SELECT', type: 'function' },
            { label: 'my_custom_variable', type: 'variable' },
            { label: 'my_custom_keyword', type: 'keyword' },
            // 添加更多的提示词
            { label: 'additional_keyword1', type: 'keyword' },
            { label: 'additional_keyword2', type: 'keyword' },
            { label: 'additional_function', type: 'function' }
          ]
        };
      }
      return null;
    }
  ]
});
const extensions = [
  // foldGutter(),
  basicSetup,
  search({top: true}),
  // autocompletion({ override: [customCompletions] }),
  customCompletion,
  sql(),
  oneDark,
  EditorView.theme({
    '&': {
      fontSize: '20px', // 修改字体大小
      fontFamily: 'Microsoft YaHei',
    },
  }),
];
</script>

<style scoped>
:deep(.splitpanes__splitter) {
  background-color: black; /* 分隔条的颜色 */
  min-height: 5px !important; /* 分隔条的宽度 */

}
</style>