<template>
  <a-layout style="height: 100%;">
    <a-layout-header style="background-image: url('/top.png');background-size: cover;z-index: 400">
      <div style="background-image: url('/back.png');opacity: 0.7"></div>
      <a-button type="text" style="color: aqua;left: 90%">{{ '当前登录用户：' + useGlobalStore().loginUser }}</a-button>
      <a-button shape="circle" style="color: red;background: white;left: 90%" @click="logOut">
        <PoweroffOutlined/>
      </a-button>

    </a-layout-header>

    <a-layout style="height:100%;background-image: url('/main.png');background-size: cover;">
      <a-layout-sider class="sider" :width="siderWidth" style="background-color: rgba(24,24,24,0.5);height: 100%;overflow: auto;overflow-x: hidden;">

        <div style="position: relative;height: 100%;">
          <DatasourceTree @openTerminal="openTerminal" @openNewQuery="openNewQuery"
                          @updateTabListWhenDatasourceClosed="updateTabListWhenDatasourceClosed"
                          @updateTabListWhenDatabaseClosed="updateTabListWhenDatabaseClosed"/>
          <div class="resizer" @mousedown="startResize"></div>
        </div>

      </a-layout-sider>

      <div v-if="isResizing" class="resize-line sider" :style="{ transform: `translateX(${resizerPosition}px)` }"></div>
      <div v-if="isResizing" class="overlay"></div>
      <a-layout-content class="sider" style="padding: 5px 12px 15px 12px; margin: 0; min-height: 280px;position:relative;">
        <a-tabs v-model:activeKey="showObjStore.activeKey" hide-add type="editable-card" style="height: 100%" :tabBarStyle="{margin:'0'}" @edit="onEdit">
          <a-tab-pane v-for="pane in showObjStore.panes" :key="pane.key" :tab="pane.title" :closable="pane.closable" style="height: 100%;overflow: auto">
            <component :is="pane.component" v-bind="pane.props"/>
          </a-tab-pane>
        </a-tabs>

      </a-layout-content>
    </a-layout>
  </a-layout>
  <MySqlTerminalModal v-if="open1" v-model:open="open1"/>
</template>
<script lang="ts" setup>
import {markRaw, onBeforeUnmount, onMounted, ref} from 'vue';
import {PoweroffOutlined} from '@ant-design/icons-vue'
import {useGlobalStore} from "@/store/globalStore";
import {router} from "@/router/router";
import DatasourceTree from "@/view/leftTree/DatasourceTree.vue";
import MySqlTerminalModal from "@/view/leftTree/MySqlTerminalModal.vue";
import CodeGenerate from "@/view/codeGenerate/codeGenerate.vue";
import TableData from "@/view/table/TableData.vue";
import ShowObject from "@/view/common/ShowObject.vue";
import {generateUUID} from "@/ts/interfaces";
import Query from "@/view/table/Query.vue";
import {useShowObjStore} from "@/store/showObjStore";


const globalStore =  useGlobalStore()
const showObjStore =  useShowObjStore()
const open1 = ref(false)

onMounted(() => {

});


function onEdit(targetKey: string | MouseEvent, action: string){
  if (action !== 'add') {
    let lastIndex = 0;
    showObjStore.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    showObjStore.panes = showObjStore.panes.filter(pane => pane.key !== targetKey);
    if (showObjStore.panes.length && showObjStore.activeKey === targetKey) {
      if (lastIndex >= 0) {
        showObjStore.activeKey = showObjStore.panes[lastIndex].key;
      } else {
        showObjStore.activeKey = showObjStore.panes[0].key;
      }
    }
  }
}

function openTerminal(datasourceName:string){
  const terminalTab = datasourceName + ' - 命令行'
  showObjStore.panes.push({title: terminalTab, key: terminalTab,datasourceName:datasourceName,component:markRaw(MySqlTerminalModal)})
  showObjStore.activeKey = terminalTab
}

function openNewQuery(datasourceName:string,databaseName:string){
  const key = generateUUID()
  showObjStore.panes.push({title: "无标题 - 查询", key: key,component:markRaw(Query),
    databaseName:databaseName,datasourceName:datasourceName,
    props:{datasourceName:datasourceName,databaseName:databaseName,isNewQuery:true,queryName:'',queryText:"",id:key},})
  showObjStore.activeKey = key
}

function updateTabListWhenDatasourceClosed(datasourceName:string){
  let isRelated = false;
  showObjStore.panes.forEach((pane) => {
    if (pane.key === showObjStore.activeKey && pane.datasourceName === datasourceName) {
      isRelated = true;
    }
  })
  showObjStore.panes = showObjStore.panes.filter(pane => pane.datasourceName !== datasourceName);
  if (isRelated){
    showObjStore.activeKey = showObjStore.panes[0].key;
  }
}

function updateTabListWhenDatabaseClosed(databaseName:string){
  let isRelated = false;
  showObjStore.panes.forEach((pane) => {
    if (pane.key === showObjStore.activeKey && pane.databaseName === databaseName) {
      isRelated = true;
    }
  })
  showObjStore.panes = showObjStore.panes.filter(pane => pane.databaseName !== databaseName);
  if (isRelated){
    showObjStore.activeKey = showObjStore.panes[0].key;
  }
}

//region 拖拽改变宽度
const siderWidth = ref(300); // 初始宽度

const isResizing = ref(false);
const resizerPosition = ref(300);

function startResize(event) {
  resizerPosition.value = event.clientX;
  const startX = event.clientX;
  const startWidth = siderWidth.value;
  isResizing.value = true;

  let animationFrameId: number | null = null;

  const onMouseMove = (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      resizerPosition.value = Math.min(Math.max(250, startWidth + (e.clientX - startX)), 500);
    });
  };

  function onMouseUp() {
    isResizing.value = false;
    siderWidth.value = resizerPosition.value;
    globalStore.indexWidth = siderWidth.value;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.userSelect = '';
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  document.body.style.userSelect = 'none';
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

.sider {
  transition: width 0.3s ease;
}

.resizer {
  width: 5px;
  height: 100%; /* 使用父容器的高度 */
  cursor: ew-resize;
  position: absolute; /* 相对于父容器定位 */
  top: 0;
  right: 0; /* 确保在父容器的最右侧 */
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10; /* 确保 resizer 在滚动条之上 */
}

.resize-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: lightblue;
  z-index: 30; /* 确保线在最上层 */
  pointer-events: none;
  will-change: transform;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  z-index: 20; /* 确保遮罩在内容之上但在线之下 */

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
