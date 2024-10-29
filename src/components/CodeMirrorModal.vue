<template>
  <a-modal :open="props.open" title="模板编辑" @ok="()=>{console.log('ok')}"
           @cancel="()=>{emit('update:open', false)}" cancelText="取消"
           :style="{ top: '20px', padding: 0, height: '100vh', width: '80%' }">
    <a-card :tab-list="tabList" :active-tab-key="key" @tabChange="onTabChange" :bodyStyle="{ padding: '10px 0 0 0' }"
            style="height: calc(100vh - 150px);overflow: auto; ">
      <codemirror
          v-model="templateContent"
          :extensions="extensions"
          class="codemirror-container"
      />
    </a-card>
  </a-modal>
</template>

<script setup lang="ts">

import {Codemirror} from "vue-codemirror";
import {oneDark} from '@codemirror/theme-one-dark'
import {EditorView} from '@codemirror/view';

import { basicSetup } from "codemirror";
import {autocompletion, completeFromList} from '@codemirror/autocomplete';
import { foldGutter, foldKeymap } from '@codemirror/fold';
import { searchKeymap, search } from '@codemirror/search';
import {java} from '@codemirror/lang-java';
import {ref} from "vue";

const tabList = [
  {
    key: 'Controller',
    tab: 'Controller',
  },
  {
    key: 'Entity',
    tab: 'Entity',
  },
  {
    key: 'Mapper',
    tab: 'Mapper',
  },
  {
    key: 'Xml',
    tab: 'Xml',
  },
  {
    key: 'Service',
    tab: 'Service',
  },
  {
    key: 'ServiceImpl',
    tab: 'ServiceImpl',
  },
];
const key = ref('Controller')

const emit = defineEmits(['update:open']);
const props = defineProps<{
  open: Boolean;
}>();

const templateContent = ref('import from');

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
  EditorView.theme({
    '&': {
      fontSize: '20px', // 修改字体大小
      fontFamily: 'Microsoft YaHei',
    },
  }),
];

function onTabChange(value) {
  key.value = value
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