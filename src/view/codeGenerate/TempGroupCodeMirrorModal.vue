<template>
  <a-modal :open="props.open" title="模板编辑" @ok="submit" ok-text="保存"
           @cancel="()=>{emit('update:open', false)}" cancelText="关闭"
           :style="{ top: '20px', padding: 0, width: '80%' }">
    <a-card :tab-list="tabList" :active-tab-key="tabActiveKey" @tabChange="onTabChange" :bodyStyle="{ padding: '10px 0 0 0' }">
      <div style="height: calc(100vh - 230px);;width: 100%;">
        <codemirror
            style="height: 100%;overflow: auto"
            v-model="templateContent"
            :extensions="extensions"
        />
      </div>
    </a-card>
  </a-modal>
</template>

<script setup lang="ts">

import {Codemirror} from "vue-codemirror";
import {oneDark} from '@codemirror/theme-one-dark'
import {EditorView, keymap} from '@codemirror/view';

import { basicSetup } from "codemirror";
import {
  acceptCompletion,
  autocompletion,
  completeFromList, completionKeymap
} from '@codemirror/autocomplete';
import { searchKeymap, search } from '@codemirror/search';
import {java} from '@codemirror/lang-java';
import {computed, ref, watch} from "vue";
import {tabList, ValueToTabKeyMap} from "@/ts/interfaces";
import {TemplateIds} from "@/view/codeGenerate/codeGenerate";
import {editTempFileContent, showTempFile} from "@/Api";
import {EditorState} from "@codemirror/state";
import {defaultKeymap} from "@codemirror/commands";
import {message} from "ant-design-vue";


const tabActiveKey = ref('Controller')
const canEdit = ref(true)

const emit = defineEmits(['update:open']);
const props = defineProps({
  open: {
    type:Boolean,
    required: true
  },
  fileType:{
    type: Number,
    required: true
  },
  formData:{
    type: Object as () => TemplateIds,
    required: true,
  }
});

const templateContent = ref('');

const customCompletions = completeFromList([
  { label: 'System', type: 'keyword' },
  { label: 'out', type: 'property' },
  { label: 'println', type: 'function' },
]);

const extensions = computed(() => {
  return [
    // foldGutter(),
    basicSetup,
    search({ top: true }),
    autocompletion({ override: [customCompletions] }),
    java(),
    oneDark,
    EditorView.editable.of(canEdit.value),
    EditorState.readOnly.of(!canEdit.value),
    EditorView.theme({
      '&': {
        fontSize: '16px', // 修改字体大小
        fontFamily: 'Microsoft YaHei',
      },
    }),
    keymap.of([
      ...defaultKeymap.filter(key => key.key !== 'Tab'), // 移除默认的 Tab 行为
      ...completionKeymap, // 添加自动补全的快捷键
      {key: 'Tab', run: acceptCompletion}, // 将 Tab 键绑定到自动补全
    ]),
  ]
});

watch(()=>props.open,(value)=>{
  if (value){
    const typeStr = ValueToTabKeyMap.get(props.fileType)
    if (typeStr){
      onTabChange(typeStr)
    }else {
      message.error("类型错误")
    }

  }
})

function onTabChange(value) {
  tabActiveKey.value = value
  let id = getIdByType(value)
  if (!id || id == ''){
    templateContent.value = '模板未设置或者模板文件有误'
    canEdit.value = false
  }else {
    showTempFile({id:id}).then((result:any) => {
      templateContent.value = result
    });
    canEdit.value = true
  }
}

async function submit(){
  let id = getIdByType(tabActiveKey.value)
  const data:any = await editTempFileContent({id:id,fileContent:templateContent.value})
  if(data.code == 200){
    message.success("保存成功")
  }
}

function getIdByType(value:string):string{
  let id = ''
  switch (value){
    case 'Controller':
      id = props.formData.controllerTempId
      break
    case 'Entity':
      id = props.formData?.entityTempId
      break
    case 'Mapper':
      id = props.formData?.mapperTempId
      break
    case 'Xml':
      id = props.formData?.xmlTempId
      break
    case 'Service':
      id = props.formData?.serviceTempId
      break
    case 'ServiceImpl':
      id = props.formData?.serviceImplTempId
      break
  }
  return id
}

</script>

<style scoped>
:deep(.ͼ1 .cm-content) {
  font-family: monospace;
}

</style>