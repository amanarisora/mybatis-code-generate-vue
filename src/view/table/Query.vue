<template>
  <div style="height: 100%">
    <a-space style="padding: 5px 0 5px 0">

      <customSelect v-model:value="datasourceName" :options="datasourceData">
        <template #prefixIcon>
          <MysqlOnSmall class="mysql-icon-small" />
        </template>
        <template #itemIcon>
          <MysqlOnSmall class="mysql-icon-small" />
        </template>
      </customSelect>
      <customSelect v-model:value="databaseName" :options="databaseData">
        <template #prefixIcon>
          <DatabaseOnSmall class="mysql-icon-small"/>
        </template>
        <template #itemIcon>
          <DatabaseOnSmall class="mysql-icon-small"/>
        </template>
      </customSelect>

      <a-button class="green" @click="console.log(templateContent)">
        <SaveOutlined/>
        保存
      </a-button>
      <a-button type="primary">
        <PlayCircleOutlined/>
        运行
      </a-button>
    </a-space>
    <SplitPanes horizontal style="height: calc(100% - 42px)">
      <Pane :min-size="10" style="overflow: auto;">
        <codemirror
            style="height: 100%"
            v-model="templateContent"
            :extensions="computedExtensions"
            class="codemirror-container"
        />
      </Pane>
      <pane :min-size="10" style="overflow: auto;">
        <codemirror style="height: 100%"
            v-model="templateContent"
            :extensions="extensions"
            class="codemirror-container"
        />
      </pane>
    </SplitPanes>

  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {PlayCircleOutlined, SaveOutlined} from "@ant-design/icons-vue";
import {Codemirror} from "vue-codemirror";
import {basicSetup} from "codemirror";
import {search} from "@codemirror/search";
import {acceptCompletion, autocompletion, CompletionContext, completionKeymap} from "@codemirror/autocomplete";
import {oneDark} from "@codemirror/theme-one-dark";
import {EditorView, keymap} from "@codemirror/view";
import {defaultKeymap} from '@codemirror/commands';
import {sql} from '@codemirror/lang-sql';
import {useShowObjStore} from "@/store/showObjStore";
import MysqlOnSmall from "@/assets/mysql-on-small.svg";
import customSelect from "@/view/common/customSelect.vue";
import DatabaseOnSmall from '@/assets/database-on-small.svg'
import {BasicAutoCompletion} from "@/view/table/query";

const showObjStore = useShowObjStore()

const isNewQuery = false
const datasourceName: any = ref('')
const databaseName: any = ref('')
const datasourceData: any = ref([])
const databaseData: any = ref([])

const templateContent = ref('import from');

const props = defineProps({
  datasourceName: String,
  databaseName: String
})
const options:any = ref([])
onMounted(() => {
  showObjStore.treeDataMap.forEach((value, key) => {
    options.value.push({ label: key, type: 'text' })
    datasourceData.value.push({
      value: key,
      label: key
    });
  });
  const childMap = showObjStore.treeDataMap.get(props.datasourceName)?.childMap;
  if (childMap) {
    childMap.forEach((value, key) => {
      options.value.push({ label: key, type: 'text' })
      databaseData.value.push({
        value: key,
        label: key
      });
    });
  }
  databaseName.value = props.databaseName;
  datasourceName.value = props.datasourceName;
});


let customCompletion = autocompletion({
  override: [
    (context: CompletionContext) => {
      let word = context.matchBefore(/\w*/);
      if (!word || word.from == word.to) return null;
      if (context.explicit || word) {
        return {
          from: word.from,
          options: BasicAutoCompletion
        };
      }
      return null;
    }
  ]
});

const computedExtensions = computed(() => {
  return [
    basicSetup,
    search({top: true}),
    autocompletion({
      override: [
        (context: CompletionContext) => {
          let word = context.matchBefore(/\w*/);
          if (!word || word.from == word.to) return null;
          if (context.explicit || word) {
            return {
              from: word.from,
              options: [...options.value,...BasicAutoCompletion]
            };
          }
          return null;
        }
      ]
    }),
    sql(),
    oneDark,
    EditorView.theme({
      '&': {
        fontSize: '20px', // 修改字体大小
        fontFamily: 'Microsoft YaHei',
      },
    }),
    keymap.of([
      ...defaultKeymap.filter(key => key.key !== 'Tab'), // 移除默认的 Tab 行为
      ...completionKeymap, // 添加自动补全的快捷键
      {key: 'Tab', run: acceptCompletion}, // 将 Tab 键绑定到自动补全
    ]),
  ];
});

const extensions = [
  basicSetup,
  search({top: true}),
  customCompletion,
  sql(),
  oneDark,
  EditorView.theme({
    '&': {
      fontSize: '20px', // 修改字体大小
      fontFamily: 'Microsoft YaHei',
    },
  }),
  keymap.of([
    ...defaultKeymap.filter(key => key.key !== 'Tab'), // 移除默认的 Tab 行为
    ...completionKeymap, // 添加自动补全的快捷键
    {key: 'Tab', run: acceptCompletion}, // 将 Tab 键绑定到自动补全
  ]),
];
</script>

<style scoped>
:deep(.splitpanes__splitter) {
  background-color: black; /* 分隔条的颜色 */
  min-height: 5px !important; /* 分隔条的宽度 */

}

</style>