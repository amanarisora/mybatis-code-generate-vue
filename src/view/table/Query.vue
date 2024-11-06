<template>
  <div style="height: 100%">
    <a-config-provider
        :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimaryBg: '#30477b',
        colorBgBase: '#1d1d1d'
      }
    }"
    >
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

        <a-button class="green" @click="save">
          <SaveOutlined/>
          保存
        </a-button>
        <a-button type="primary" @click="runSql">
          <PlayCircleOutlined/>
          运行
        </a-button>
      </a-space>
    </a-config-provider>
    <SplitPanes horizontal style="height: calc(100% - 42px)">
      <Pane :min-size="10" style="overflow: auto;">
        <codemirror
            style="height: 100%"
            v-model="templateContent"
            :extensions="computedExtensions"
            class="codemirror-container"
        />
      </Pane>
      <pane :min-size="10" >
        <QueryResult :panes="panes" :isChanged="isChanged" style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.8)"/>
      </pane>
    </SplitPanes>
  </div>
  <SaveQueryMadal v-model:open="openSaveQueryModal" @saveQuerySubmit="saveQuerySubmit"/>
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
import {BasicAutoCompletion, QueryResultPaneObj} from "@/view/table/query";
import {runQuerySql, saveQuery} from "@/view/table/tableAboutApi";
import {useGlobalStore} from "@/store/globalStore";
import {message, theme} from "ant-design-vue";
import QueryResult from "@/view/table/QueryResult.vue";
import SaveQueryMadal from "@/view/table/SaveQueryMadal.vue";

const showObjStore = useShowObjStore()

let isNewQuery = true
const openSaveQueryModal = ref(false)
const datasourceName: any = ref('')
const databaseName: any = ref('')
const datasourceData: any = ref([])
const databaseData: any = ref([])
let queryName

const templateContent = ref('');

const props = defineProps({
  datasourceName: {
    type: String,
    required: true,
  },
  databaseName: {
    type: String,
    required: true,
  },
  queryName:{
    type:String,
    required: true
  },
  queryText:{
    type:String,
    required: true
  },
  isNewQuery:{
    type:Boolean,
    required:true
  },
  id:{
    type:String,
    required: true
  },
})
const options:any = ref([])
const optionsSet:any = new Set()
onMounted(() => {
  showObjStore.treeDataMap.forEach((value, key) => {
    optionsSet.add({ label: key, type: 'text' })
    datasourceData.value.push({
      value: key,
      label: key
    });
  });
  const childMap = showObjStore.treeDataMap.get(props.datasourceName)?.childMap;
  if (childMap) {
    childMap.forEach((value, key) => {
      optionsSet.add({ label: key, type: 'text' })
      databaseData.value.push({
        value: key,
        label: key
      });
    });
  }
  showObjStore.tableObjData.forEach((value, key) => {
    value.forEach((v,k) => {
      v.forEach(item=>{
        optionsSet.add({ label: item.tableName, type: 'text' })
      })
    })
  })
  options.value = Array.from(optionsSet)
  databaseName.value = props.databaseName;
  datasourceName.value = props.datasourceName;
  isNewQuery = props.isNewQuery
  queryName = props.queryName
  templateContent.value = props.queryText
});

//region codemirror配置
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
        fontSize: '14px', // 修改字体大小
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
//endregion

async function save(){
  if(isNewQuery){
    openSaveQueryModal.value = true
  }else {
    await saveQuerySubmit(queryName)
  }
}
async function saveQuerySubmit(name:string){
  const data:any = await saveQuery({queryName: name,queryText:templateContent.value,databaseName:props.databaseName,datasourceName:props.datasourceName,
    isNewQuery:isNewQuery,user:useGlobalStore().loginUser})
  if (data.code ==200){
    message.success("保存成功")
    isNewQuery = false
    queryName = name
    showObjStore.panes.forEach(item=>{
      if (item.key == props.id){
        item.title = `${queryName} @${databaseName.value}(${datasourceName.value}) - 查询`
      }
    })
    const a:any = {}
    showObjStore.panes.push(a)
    showObjStore.panes.pop()
  }
}

const panes = ref<QueryResultPaneObj[]>([])
const isChanged = ref(0)
//运行sql
async function runSql(){

  const data:any = await runQuerySql({databaseName: databaseName.value,sql:templateContent.value,
    user:useGlobalStore().loginUser,ds:props.datasourceName});
  if(data.code == 200){
    message.success("运行成功")
    panes.value = []
    data.result.forEach((value,i)=>{
      if(value.sqlType !== 'select'){
        panes.value.push({
          title:'结果'+(i+1),
          key:'结果'+(i+1),
          closable:true,
          sql:value.sql,
          affectedNum: value.affectedRowNumber,
        })
      }else{
        panes.value.push({
          title:'结果'+ (i+1),
          key:'结果'+(i+1),
          closable:true,
          sql:value.sql,
          columns: ref(value.columnVueList),
          data: value.selectResultList
        })
      }
    })
    isChanged.value +=1
  }

}

</script>

<style scoped>
:deep(.splitpanes__splitter) {
  background-color: black; /* 分隔条的颜色 */
  min-height: 5px !important; /* 分隔条的宽度 */

}
:deep(.cm-editor){
  background: rgba(0, 0, 0, 0.8);
}


/* 选中标签的颜色 */
:deep(.ant-tabs-tab-active) {
  color: white !important; /* 选中时的颜色 */
  background: #3c4348 !important;
}
:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: white !important; /* 选中时的颜色 */
}
:deep(.ant-tabs .ant-tabs-tab):hover{
  color: white !important;
}
</style>