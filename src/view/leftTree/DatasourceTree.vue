<template>
  <div style="background-color: white;padding-top: 10px;width: 100%;">
    <a-tree
        style="font-size: 15px"
        :tree-data="datasourceTreeData"
        v-model:selectedKeys="datasourceSelectedKeys"
        v-model:expandedKeys="datasourceExpandKeys"
        @select="selectTree"
        @dblclick="handleDoubleClick"
        block-node
    >
      <template #title="{data,title,key,type,children}">
        <a-dropdown :trigger="['contextmenu']">
          <div class="tree-node-title">
            <MysqlOnSmall v-if="type==0&&children.length>0" class="mysql-icon-small" style="float: left;"/>
            <MysqlOffSmall v-else-if="type==0&&children.length==0" class="mysql-icon-small" style="float: left;"/>
            <DatabaseOnSmall v-else-if="type==1&&children.length>0" class="mysql-icon-small" style="float: left;"/>
            <DatabaseOffSmall v-else-if="type==1&&children.length==0" class="mysql-icon-small" style="float: left;"/>
            <TableSmall v-else-if="type==2" class="mysql-icon-small" style="float: left;"/>
            <a-tooltip v-if="type==2" placement="right" >
              <template #title>
                <span>{{ title }}</span>
              </template>
              <span v-if="!editingKey || editingKey !== key" class="tree-node-text" :style="{maxWidth:maxWidth+'px'}">{{title}}</span>
              <a-input ref="editInput" v-else type="text" v-model:value="editTitle" @blur="submitEdit(data)"
                       @keyup.enter="submitEdit(data)"/>
            </a-tooltip>
            <span v-if="type!=2 && (!editingKey || editingKey !== key)" class="tree-node-text">{{ title }}</span>
            <a-input ref="editInput" v-else-if="type!=2" type="text" v-model:value="editTitle" @blur="submitEdit(data)"
                     @keyup.enter="submitEdit(data)"/>
          </div>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => dropdown(data,key, menuKey,title,type)">
              <a-menu-item key="open" v-if="children.length ==0" >打开</a-menu-item>
              <a-menu-item key="close" v-if="type != 2&&children.length >0">关闭连接</a-menu-item>
              <a-menu-item key="addDatasource" v-if="type != 2">新建连接</a-menu-item>
              <a-menu-item key="editDatasource" v-if="type != 2">编辑连接</a-menu-item>
              <a-menu-item key="createDatabase" v-if="type == 1 || (type == 0&&children.length >0)">新建数据库</a-menu-item>
              <a-menu-item key="openTerminal" >打开命令行</a-menu-item>
              <a-menu-item key="rename" v-if="type != 1">重命名</a-menu-item>
              <a-menu-item key="delete" :disabled="type == -1" :style="{color: type==-1?'lightgray':'lightcoral'}">删除</a-menu-item>
              <a-menu-item key="reload" v-if="children.length >0" >刷新</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>

    <a-button type="text" @click="()=>{openAddDatasource = true}" size="large" shape="circle"
              style="margin-left: 80%">
      <PlusCircleOutlined/>
    </a-button>
  </div>
  <AddOrEditDataSourceModal v-model:open="openAddDatasource" v-model:is-add="isAddDatasource" :editFormData="editDatasourceFormData"
                            @reloadDataSourceList="reloadDataSourceList" @editReloadDataSourceList="editReloadDataSourceList"/>
  <CreateDatabaseModal v-model:open="openAddDatabase" :ds="createDataBaseDs" @reloadDataSourceList="reloadDatabase"/>
</template>

<script setup lang="ts">
import {h, nextTick, onMounted, onUpdated, reactive, ref, watch} from "vue";
import {
  deleteDatabase,
  deleteFolder,
  getAllDataBases,
  getAllDataSource,
  getAllTableList,
  renameDataSource
} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {ExclamationCircleOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import AddOrEditDataSourceModal from "@/view/leftTree/AddOrEditDataSourceModal.vue";
import MysqlOffSmall from '@/assets/mysql-off-small.svg'
import MysqlOnSmall from '@/assets/mysql-on-small.svg'
import DatabaseOffSmall from '@/assets/database-off-small.svg'
import DatabaseOnSmall from '@/assets/database-on-small.svg'
import TableSmall from '@/assets/table-small.svg'
import {message, Modal} from "ant-design-vue";
import CreateDatabaseModal from "@/view/leftTree/CreateDatabaseModal.vue";
import MySqlTerminalModal from "@/view/leftTree/MySqlTerminalModal.vue";


onMounted(async () => {
  await reloadDataSourceList()
})

const globalStore =  useGlobalStore()
const maxWidth = ref(globalStore.indexWidth - 104)

watch(
    () => globalStore.indexWidth,
    (newValue, oldValue) => {
      maxWidth.value = newValue - 104
    }
);

const openAddDatasource = ref(false)
const isAddDatasource = ref(true)
const editDatasourceFormData:any = reactive({})
const openAddDatabase = ref(false)
const createDataBaseDs = ref("")
const datasourceSelectedKeys: any = ref([])
const datasourceExpandKeys: any = ref([])
const datasourceTreeData: any = ref([])
let treeDataMap = new Map()

const editTitle = ref('')
const editInput = ref()
const editingKey = ref<string | null>(null);

let clickTimeout: number | null = null;
function selectTree(keys, e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log(e)
  datasourceSelectedKeys.value = [e.node.key]
  switch (e.node.type){
    case 0:
      /*if (e.node.children.length == 0) {
        clickTimeout = window.setTimeout(async () => {
          console.log('单击触发')
          await reloadDatabase(e.node.datasourceName)
          console.log(e.node)
        }, 300);
      }*/

      break
    case 1:
      /*if (e.node.children.length == 0) {
        clickTimeout = window.setTimeout(async () => {
          console.log('单击触发')
          await reloadTableList(e.node.parentId,e.node.title)
          console.log(e.node)
        }, 300);
      }*/
      break
  }

}

async function handleDoubleClick(e, node) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log("双击")
  console.log(node)
  switch (node.type){
    case 0:
      if (node.children.length==0) {
        await reloadDatabase(node.datasourceName)
      }
      break
    case 1:
      if (node.children.length==0) {
        await reloadTableList(node.parentId,node.title)
      }
      break
  }
  if (!datasourceExpandKeys.value.includes(node.key)) {
    datasourceExpandKeys.value.push(node.key)
  } else {
    datasourceExpandKeys.value = datasourceExpandKeys.value.filter(v => v !== node.key)
  }
}

//region -----重载数据-----
async function reloadDataSourceList() {
  let data: any = await getAllDataSource({user: useGlobalStore().loginUser});
  datasourceTreeData.value = data.result
  let tempMap = new Map()
  datasourceTreeData.value.forEach((item: any) => {
    if (treeDataMap.has(item.title)) {
      tempMap.set(item.title,treeDataMap.get(item.title))
    }else {
      tempMap.set(item.title,{data:item,childMap:new Map()})
    }
  })
  treeDataMap = tempMap
}

async function editReloadDataSourceList(title:string){
  datasourceTreeData.value = datasourceTreeData.value.filter((item: any) => item.title != title)
  await reloadDataSourceList()
}

async function reloadDatabase(datasourceName:string){
  const data:any = await getAllDataBases({user: useGlobalStore().loginUser, ds: datasourceName})
  if (data.code == 200){
    const dataObject = treeDataMap.get(datasourceName)
    dataObject.data.children = data.result

    let tempChildMap = new Map()
    data.result.forEach((item) => {
      tempChildMap.set(item.title,item)
    })
    dataObject.childMap = tempChildMap
  }
}

async function reloadTableList(datasourceName:string,databaseName:string){
  const data:any = await getAllTableList({user: useGlobalStore().loginUser, ds: datasourceName, databaseName:databaseName})
  if (data.code == 200){
    setDatabaseChildren(datasourceName,databaseName,data.result)
  }
}
//endregion----

async function dropdown(data:any,key:string, menuKey:string,title:string,type:number){
  console.log(data)
  switch (menuKey){
    case 'open':
      await handleDoubleClick(null, data)
      break
    case 'close':
      if (type == 1){
        resetDatabaseChildren(data.parentId,title)
      }else if (type == 0){
        resetDatasourceChildren(title)
      }
      break
    case 'addDatasource':
      openAddDatasource.value = true
      isAddDatasource.value = true
      break
    case 'editDatasource':
      openAddDatasource.value = true
      isAddDatasource.value = false
      editDatasourceFormData.id = data.id
      editDatasourceFormData.datasourceName = data.datasourceName
      editDatasourceFormData.ip = data.ip
      editDatasourceFormData.port = data.port
      editDatasourceFormData.username = data.username
      editDatasourceFormData.password = data.password
      editDatasourceFormData.datasourceType = data.datasourceType
      break
    case 'createDatabase':
      openAddDatabase.value = true
      if (type == 0){
        createDataBaseDs.value = title
      }else if (type == 1){
        createDataBaseDs.value = data.parentId
      }
      break
    case 'delete':
      if (type == 0){

      }else if (type == 1){
        Modal.confirm({
          title: h('div', [

            h('span', { style: { color: 'red', fontWeight: 'bold' } }, '删除数据库')
          ]),
          icon: h(ExclamationCircleOutlined),
          content: h('div', [
            '删除数据库将会删除其下所有数据且',
            h('span', { style: { color: 'red', fontWeight: 'bold' } }, '后果不可逆'),
            '，是否继续?'
          ]),
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            const result:any =await deleteDatabase({databaseName:title,user:globalStore.loginUser,ds:data.parentId})
            if (result.code == 200){
              message.success("删除成功")
            }
            await reloadDatabase(data.parentId)
          },
          onCancel() {
          },
        });

      }
      break
    case 'rename':
      editingKey.value = key;
      editTitle.value = title;
      await nextTick(() => {
        if (editInput.value) {
          editInput.value.focus();
        }
      });
      break

    case 'reload':
      if (type == 0){
        await reloadDatabase(title)
      }else if (type == 1){
        await reloadTableList(data.parentId, title)
      }
      break
  }
}

async function submitEdit(data){
  if (data.title == editTitle.value || editTitle.value == '') {
    editingKey.value = null;
    editTitle.value = '';
    return
  }
  console.log(data)
  if (data.type == 0){
    const result = await renameDataSource({id:data.id,datasourceName:editTitle.value})
    if (result.code == 200){
      const item = treeDataMap.get(data.title)
      treeDataMap.delete(data.title)
      item.data.title = editTitle.value
      treeDataMap.set(editTitle.value, item)
      item.childMap.forEach((value, key) => {
        value.parentId = editTitle.value
      })
      message.success("重命名成功！")
    }
  }else if(data.type == 1){

  }
  editingKey.value = null
}

//region -----重载数据方法-----
function getDatasourceObj(title:string){
  return treeDataMap.get(title).data
}
function getDatabaseObj(parentTitle:string,title:string){
  return treeDataMap.get(parentTitle).childMap.get(title)
}
function setDatasourceChildren(title:string,data:any){
  getDatasourceObj(title).children = data
}
function setDatabaseChildren(parentTitle:string,title:string,data:any){
  getDatabaseObj(parentTitle,title).children = data
  datasourceTreeData.value.push({})
  datasourceTreeData.value.pop()
}
function resetDatasourceChildren(title:string){
  getDatasourceObj(title).children = []
}
function resetDatabaseChildren(parentTitle:string,title:string){
  getDatabaseObj(parentTitle,title).children = []
  datasourceTreeData.value.push({})
  datasourceTreeData.value.pop()
}
//endregion
</script>

<style scoped>
:deep(.anticon) {
  transform: translateY(-2px);
}
.tree-node-title {
  display: flex;
  align-items: center;
}
.tree-node-text {
  flex-grow: 1;
  padding: 0 5px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
</style>