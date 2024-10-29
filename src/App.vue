<script setup lang="ts">

// import {theme} from "ant-design-vue";
import {ref} from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = ref(zhCN);
</script>

<template>
<!--  <a-config-provider-->
<!--      :theme="{-->
<!--      algorithm: theme.darkAlgorithm,-->
<!--    }"-->
<!--  >-->

<!--  </a-config-provider>-->
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>

</template>

<style scoped>

</style>
