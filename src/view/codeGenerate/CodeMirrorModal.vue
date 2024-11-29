<template>
  <a-modal :open="props.open" title="模板编辑" @ok="submit" ok-text="保存"
           :body-style="{height: 'calc(100vh - 150px)'}"
           @cancel="()=>{emit('update:open', false)}" cancelText="关闭"
           :style="{ top: '20px', padding: 0, height: '100vh', width: '80%' }">
    <codemirror
        style="height: 100%;"
        v-model="templateContent"
        :extensions="extensions"
        class="codemirror-container"
    />
  </a-modal>
</template>

<script setup lang="ts">

import {Codemirror} from "vue-codemirror";
import {oneDark} from '@codemirror/theme-one-dark'
import {EditorView} from '@codemirror/view';

import { basicSetup } from "codemirror";
import {autocompletion, completeFromList} from '@codemirror/autocomplete';
import { searchKeymap, search } from '@codemirror/search';
import {java} from '@codemirror/lang-java';
import {ref, watch} from "vue";
import {ValueToTabKeyMap} from "@/ts/interfaces";
import {message} from "ant-design-vue";
import {editTempFileContent, showTempFile} from "@/Api";
import {EditorState} from "@codemirror/state";

const emit = defineEmits(['update:open']);
const props = defineProps({
  open: {
    type:Boolean,
    required: true
  },
  tempId:{
    type: String,
  }
});

const templateContent = ref('i');
const canEdit = ref(true)

const customCompletions = completeFromList([
  { label: 'System', type: 'keyword' },
  { label: 'out', type: 'property' },
  { label: 'println', type: 'function' },
]);

const extensions = [
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
];

watch(()=>props.open,(value)=>{
  if (value){
    if (!props.tempId || props.tempId == ''){
      templateContent.value = '模板文件不存在或者模板文件有误'
      canEdit.value = false
    }else {
      showTempFile({id:props.tempId}).then((result:any) => {
        templateContent.value = result
      });
      canEdit.value = true
    }
  }
})

async function submit(){
  const data:any = await editTempFileContent({id:props.tempId,fileContent:templateContent.value})
  if(data.code == 200){
    message.success("保存成功")
  }
}

</script>

<style scoped>
.codemirror-container {
  height: 100%;
  overflow: auto;
}
:deep(.ͼ1 .cm-content) {
  font-family: monospace;
}
</style>