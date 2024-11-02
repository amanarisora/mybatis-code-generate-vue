<template>
  <div style="background-color: white;position: relative;padding-top: 10px">
    <a-tree
        style="font-size: 15px"
        :tree-data="datasourceTreeData"
        v-model:selectedKeys="datasourceSelectedKeys"
        v-model:expandedKeys="datasourceExpandKeys"
        @select="selectTree"
        @dblclick="handleDoubleClick"
        block-node
    >
      <template #title="{title,key,type,children}">
        <div style="overflow: hidden">
          <MysqlOnSmall v-show="children.length>0&&type==0" class="mysql-icon-small" style="float: left;"/>
          <MysqlOffSmall v-show="children.length==0&&type==0" class="mysql-icon-small" style="float: left;"/>
          <DatabaseOnSmall v-show="children.length>0&&type==1" class="mysql-icon-small" style="float: left;"/>
          <DatabaseOffSmall v-show="children.length==0&&type==1" class="mysql-icon-small" style="float: left;"/>
          <span style="float: left;padding: 0 5px 0 5px;line-height: 20px;">{{title}}</span>
        </div>
      </template>
    </a-tree>

    <a-button type="text" @click="()=>{openAddDatasource = true}" size="large" shape="circle"
              style="margin-left: 80%">
      <PlusCircleOutlined/>
    </a-button>
  </div>
  <AddDataSourceModal v-model:open="openAddDatasource" @reloadDataSourceList="reloadDataSourceList"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getAllDataBases, getAllDataSource, getAllTableList} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import AddDataSourceModal from "@/view/leftTree/AddDataSourceModal.vue";
import MysqlOffSmall from '@/assets/mysql-off-small.svg'
import MysqlOnSmall from '@/assets/mysql-on-small.svg'
import DatabaseOffSmall from '@/assets/database-off-small.svg'
import DatabaseOnSmall from '@/assets/database-on-small.svg'

onMounted(async () => {
  await reloadDataSourceList()
})

const openAddDatasource = ref(false)
const datasourceSelectedKeys: any = ref([])
const datasourceExpandKeys: any = ref([])
const datasourceTreeData: any = ref([])
const treeDataMap = new Map()


let clickTimeout: number | null = null;
function selectTree(keys, e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log(e)
  datasourceSelectedKeys.value = [e.node.key]
  switch (e.node.type){
    case 0:
      // 设置一个新的定时器
      clickTimeout = window.setTimeout(async () => {
        console.log('单击触发')
        await reloadDatabase(e.node.datasourceName,e.node.key)
        console.log(e.node)
      }, 300);
      break
    case 1:
      clickTimeout = window.setTimeout(async () => {
        console.log('单击触发')
        await reloadTableList(e.node.datasourceName,e.node.key)
        console.log(e.node)
      }, 300);
      break
  }


}

async function handleDoubleClick(e, node) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log("双击")
  switch (node.type){
    case 0:
      if (node.children.length==0) {
        await reloadDatabase(node.datasourceName,node.key)
      }
      break
  }
  if (!datasourceExpandKeys.value.includes(node.key)) {
    datasourceExpandKeys.value.push(node.key)
  } else {
    datasourceExpandKeys.value = datasourceExpandKeys.value.filter(v => v !== node.key)
  }
}

async function reloadDataSourceList() {
  let data: any = await getAllDataSource({user: useGlobalStore().loginUser});
  datasourceTreeData.value = data.result
  datasourceTreeData.value.forEach((item: any) => {
    treeDataMap.set(item.title,{data:item,map:new Map()})
  })
}

async function reloadDatabase(datasourceName:string,key:string){
  const data:any = await getAllDataBases({user: useGlobalStore().loginUser, ds: datasourceName})
  if (data.code == 200){
    datasourceTreeData.value.forEach((item) => {
      if(item.key == key){
        item.children = data.result
      }
    })
  }
}

async function reloadTableList(datasourceName:string,key:string){
  const data:any = await getAllTableList({user: useGlobalStore().loginUser, ds: datasourceName})
  if (data.code == 200){
    datasourceTreeData.value.forEach((item) => {
      if(item.key == key){
        item.children = data.result
      }
    })
  }
}

</script>

<style scoped>
:deep(.anticon) {
  transform: translateY(-2px);
}
</style>