<template>
  <a-modal :open="props.open" title="模板资源库" @cancel="emit('update:open',false)" style="top: 20px; padding: 0; max-height: 100vh; width: 80% ">
    <a-card :tab-list="tabList" :active-tab-key="key" @tabChange="onTabChange" :bodyStyle="{ padding: '10px 0 0 0' }"
            style="height: calc(100vh - 150px);overflow: auto; ">

    </a-card>
  </a-modal>
</template>
<script setup lang="ts">
import {tabKeyToValueMap, tabList} from "@/ts/interfaces";
import {onMounted, ref} from "vue";
import {getTempFileList} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open']);
const key = ref('Controller')
const globalStore = useGlobalStore();

onMounted(async ()=>{
  await getTempFileList({username: globalStore.loginUser,fileType: tabKeyToValueMap.get(key.value)});
})

async function onTabChange(value) {
  key.value = value
  await getTempFileList({username: globalStore.loginUser,fileType: tabKeyToValueMap.get(key.value)});
}
</script>

<style scoped>

</style>