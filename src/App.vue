<template>
<!--  <a-config-provider-->
<!--      :theme="{-->
<!--      algorithm: theme.darkAlgorithm,-->
<!--    }"-->
<!--  >-->

<!--  </a-config-provider>-->
  <a-config-provider :locale="locale" :theme="theme">
    <router-view />
  </a-config-provider>

</template>

<script setup lang="ts">

// import {theme} from "ant-design-vue";
import {ref} from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = ref(zhCN);
const theme = {
  "token": {
    "colorPrimary": "#1d8df5"
  }
}
</script>

<style scoped>

</style>
