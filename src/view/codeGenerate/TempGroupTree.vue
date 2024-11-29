<template>
  <div style="padding-top: 10px;width: 100%;">
    <a-tree
        style="font-size: 15px"
        :tree-data="tempGroupTreeData"
        v-model:selectedKeys="tempGroupSelectedKeys"
        @select="selectTree"
        @dblclick="handleDoubleClick"
        :fieldNames="{key:'id',title:'groupName'}"
        block-node
    >
      <template #title="{data,id,groupName}">
        <a-dropdown :trigger="['contextmenu']">
          <div>
            <div class="tree-node-title">
              <ViGridSmall style="float: left;padding-right: 5px"/>
              <CanEditSpan :submit="(editText)=>submitEdit(editText,data)"
                           :text="groupName" :is-editing="editingKey == id"/>
            </div>
            <div v-if="groupName == '当前设置'" style="height: 2px;width: 100%;background: gray"/>
          </div>
          <template #overlay>
            <a-menu @click="({key}) => handleMenuClick(data,id, key,groupName)">
              <a-menu-item v-if="groupName != '当前设置'" key="rename" >重命名</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import ViGridSmall from "@/assets/visualization-grid-small.svg";
import {onMounted, ref} from "vue";
import {listTempGroup, renameTempGroup} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import CanEditSpan from "@/view/common/CanEditSpan.vue";
import {message} from "ant-design-vue";
import throttle from "lodash/throttle";

const tempGroupTreeData:any = defineModel("tempGroupTreeData")
const tempGroupSelectedKeys:any = defineModel("tempGroupSelectedKeys")

const emit = defineEmits(['reload'])



const globalStore = useGlobalStore();

onMounted(async ()=>{
  const data:any = await listTempGroup({username:globalStore.loginUser});
  tempGroupTreeData.value = data.result
  tempGroupSelectedKeys.value = [data.result[0].id]
})

let clickTimeout: number | null = null;

function selectTree(keys, e){
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  clickTimeout = window.setTimeout(async () => {
    console.log('单击触发')
    tempGroupSelectedKeys.value = [e.node.id]
    emit('reload',e.node.groupName)
  }, 300);
}

function handleDoubleClick(e, node){
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  if (node.groupName != '当前设置'){
    editingKey.value = node.id
  }
}

const handleMenuClick = throttle((data: any, id: string, key: string, groupName: string) => {
  dropdown(data, id,key,groupName);
}, 300);

async function dropdown(data: any, id: string, key: string, groupName: string) {
  switch (key){
    case 'rename':
      editingKey.value = id
      break
  }
}

const editingKey = ref<string|null>(null)

async function submitEdit(editText,data){
  if (data.groupName == editText || editText == '') {
    editingKey.value = null;
    return
  }
  const result = await renameTempGroup({id: data.id, groupName: editText})
  if (result.code == 200) {
    await reloadTree()
    message.success("重命名成功！")
  }
  editingKey.value = null;
}

async function reloadTree(){
  const data:any = await listTempGroup({username:globalStore.loginUser});
  tempGroupTreeData.value = data.result
  if (!data.result.find(i=> i.id == tempGroupSelectedKeys.value[0])){
    tempGroupSelectedKeys.value = [data.result[0].id]
    emit("reload",data.result[0].groupName)
  }
}

defineExpose({
  reloadTree
})
</script>

<style scoped>
:deep(.ant-tree-node-content-wrapper-normal) {
  margin-left: -24px;
}
</style>