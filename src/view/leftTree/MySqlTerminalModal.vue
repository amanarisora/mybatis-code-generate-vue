<template>
  <terminal name="my-terminal"
            @exec-cmd="onExecCmd"
            :show-header="false"
            :drag-conf="dragConf"
            theme="dark" style="height: 100%;border-radius: 5px"/>
<!--  <div v-if="props.open" class="modal-overlay" @click="()=>{emit('update:open',false)}"></div>-->
</template>

<script setup lang="ts">
import Terminal, {DragConfig} from "vue-web-terminal";
const dragConf:DragConfig = {
  width: "50%",
  height: "70%",
  zIndex: '100',
  init: {
    x: 200,
    y: 200
  },
  pinned: false
}

function onExecCmd(key, command, success, failed) {
  if (key === 'fail') {
    failed('Something wrong!!!')
  } else {
    let allClass = ['success', 'error', 'system', 'info', 'warning'];

    let clazz = allClass[Math.floor(Math.random() * allClass.length)];
    success({
      type: 'normal',
      class: clazz,
      tag: clazz,
      content: `Your command is '${command}'`
    })
  }
}
</script>

<style scoped>
/* 遮罩层样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  z-index: 1000; /* 确保在模态框下方 */
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* 确保在遮罩层上方 */
}
:deep(.t-window){
  border-radius: 5px;
}
</style>