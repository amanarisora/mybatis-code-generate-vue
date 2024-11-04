<template>
  <a-layout style="height: 100%;">
    <a-layout-header style="background-image: url('/top.png');background-size: cover;">
      <div style="background-image: url('/back.png');opacity: 0.7"></div>
      <a-button type="text" style="color: aqua;left: 90%">{{ '当前登录用户：' + useGlobalStore().loginUser }}</a-button>
      <a-button shape="circle" style="color: red;background: white;left: 90%" @click="logOut">
        <PoweroffOutlined/>
      </a-button>

    </a-layout-header>

    <a-layout style="height:100%;background-image: url('/main.png');background-size: cover;">
      <a-layout-sider :width="siderWidth" style="height: 100%;overflow: auto;overflow-x: hidden">

        <DatasourceTree @openTerminal="openTerminal" @openTableData="openTableData"/>
        <div class="resizer" @mousedown="startResize"></div>

      </a-layout-sider>

      <a-layout-content style="padding: 5px 12px 15px 12px; margin: 0; min-height: 280px;position:relative;overflow: auto">

        <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card" style="height: 100%" :tabBarStyle="{margin:'0'}" @edit="onEdit">
          <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable" style="height: 100%">
            <component :is="pane.component" v-bind="pane.props" style="height: 100%;"/>
          </a-tab-pane>
        </a-tabs>

      </a-layout-content>
    </a-layout>
  </a-layout>
  <MySqlTerminalModal v-if="open1" v-model:open="open1"/>
</template>
<script lang="ts" setup>
import {markRaw, onMounted, ref} from 'vue';
import {PoweroffOutlined} from '@ant-design/icons-vue'
import {useGlobalStore} from "@/store/globalStore";
import {router} from "@/router/router";
import DatasourceTree from "@/view/leftTree/DatasourceTree.vue";
import throttle from 'lodash/throttle';
import MySqlTerminalModal from "@/view/leftTree/MySqlTerminalModal.vue";
import CodeGenerate from "@/view/codeGenerate/codeGenerate.vue";
import TableData from "@/view/table/TableData.vue";
import ShowObject from "@/view/common/ShowObject.vue";


const globalStore =  useGlobalStore()
const open1 = ref(false)

onMounted(async () => {

})

const panes = ref<{ title: string; key: string; component:any; closable?: boolean; props?:object}[]>([
  { title: '对象', key: 'ShowObjectKey',component:markRaw(ShowObject),closable:false },
  { title: 'Tab 1', key: '1',component:markRaw(CodeGenerate) },
]);
const activeKey = ref(panes.value[0].key)

function onEdit(targetKey: string | MouseEvent, action: string){
  if (action !== 'add') {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
  }
}

function openTerminal(terminalTab:string){
  panes.value.push({title: terminalTab, key: terminalTab,component:markRaw(MySqlTerminalModal)})
  activeKey.value = terminalTab
}

function openTableData(datasourceName:string,databaseName:string,tableName:string){
  const key = tableName+' - '+databaseName
  if(!panes.value.some(obj => obj.key === key)){
    panes.value.push({title: key, key: key,component:markRaw(TableData),
      props:{datasourceName:datasourceName,databaseName:databaseName,tableName:tableName}})
  }
  activeKey.value = key
}

//region 拖拽改变宽度
const siderWidth = ref(300); // 初始宽度

function startResize(event) {
  const startX = event.clientX;
  const startWidth = siderWidth.value;

  // 禁用选择
  document.body.style.userSelect = 'none';
  const onMouseMove = throttle((e) => {
    const newWidth = startWidth + (e.clientX - startX);
    siderWidth.value = Math.min(Math.max(250, newWidth), 500); // 设置最小宽度为200px，最大宽度为400px
    globalStore.indexWidth = siderWidth.value
  }, 80); // 每16ms执行一次，约等于60fps

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // 恢复选择
    document.body.style.userSelect = '';
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
//endregion

function logOut() {
  useGlobalStore().setUser('')
  router.push('/app/login')
}


</script>
<style scoped>



.resizer {
  width: 5px;
  cursor: ew-resize;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10; /* 确保 resizer 在滚动条之上 */
}

:deep(.ant-menu-item) {
  padding-left: 20px !important; /* 自定义 padding-left */
}

:deep(.ant-menu-submenu-title) {
  padding-left: 10px !important; /* 自定义 padding-left */
}

:deep(.ant-tabs-content) {
  height: 100%;
}
</style>
