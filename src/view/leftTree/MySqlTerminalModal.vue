<template>
  <terminal name="my-terminal"
            @exec-cmd="onExecCmd"
            :drag-conf="dragConf"
            theme="dark"/>
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
</script>

<style scoped>

</style>