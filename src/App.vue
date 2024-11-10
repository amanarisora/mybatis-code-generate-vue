<template>
<!--  <a-config-provider-->
<!--      :theme="{-->
<!--      algorithm: theme.darkAlgorithm,-->
<!--    }"-->
<!--  >-->

<!--  </a-config-provider>-->
  <a-config-provider :locale="locale" :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#5978a7',
        colorPrimaryBg: '#30477b',
        colorBgContainer: 'rgba(24,24,24,0.5)'
      }
    }">
    <router-view />
  </a-config-provider>

</template>

<script setup lang="ts">

// import {theme} from "ant-design-vue";
import {ref} from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {theme} from "ant-design-vue";
const locale = ref(zhCN);
// const theme = {
//   "token": {
//     "colorPrimary": "#1d8df5"
//   }
// }
</script>

<style scoped>

</style>

<style>
.ant-table-thead > tr > th {
  background-color: rgba(24,24,24,0.5) !important; /* 青色 */
}
</style>
