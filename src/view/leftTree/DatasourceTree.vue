<template>
  <div>
    <a-tree
        style="font-size: 15px"
        :tree-data="showObjStore.datasourceTreeData"
        v-model:selectedKeys="datasourceSelectedKeys"
        v-model:expandedKeys="datasourceExpandKeys"
        @select="selectTree"
        @dblclick="handleDoubleClick"
        block-node
    >
      <template #title="{data,title,key,type,children}">
        <a-dropdown :trigger="['contextmenu']">
          <div class="tree-node-title">
            <MysqlOnSmall v-if="type==0&&data.datasourceType==0&&children.length>0" class="mysql-icon-small" style="float: left;"/>
            <MysqlOffSmall v-else-if="type==0&&data.datasourceType==0&&children.length==0" class="mysql-icon-small" style="float: left;"/>
            <SqliteOnSmall v-else-if="type==0&&data.datasourceType==1&&children.length>0" class="mysql-icon-small" style="float: left;"/>
            <SqliteOffSmall v-else-if="type==0&&data.datasourceType==1&&children.length==0" class="mysql-icon-small" style="float: left;"/>
            <DatabaseOnSmall v-else-if="type==1&&children.length>0" class="mysql-icon-small" style="float: left;"/>
            <DatabaseOffSmall v-else-if="type==1&&children.length==0" class="mysql-icon-small" style="float: left;"/>
            <TableSmall v-else-if="type==2 || type ==3" class="mysql-icon-small" style="float: left;"/>
            <QuerySmall v-else-if="type==4 ||type == 5" class="mysql-icon-small" style="float: left;"/>
            <a-tooltip v-if="type==2" placement="right">
              <template #title>
                <span>{{ title }}</span>
              </template>
              <CanEditSpan :submit="(editText)=>submitEdit(editText,data)" :span-class="'tree-node-text'"
                           :style="{width:spanWidth+'px'}"
                           :text="title" :is-editing="editingKey == key"/>
            </a-tooltip>
            <CanEditSpan v-if="type!=2" :submit="(editText)=>submitEdit(editText,data)" :span-class="'tree-node-text'"
                         :text="title" :is-editing="editingKey == key"/>
          </div>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => handleMenuClick(data,key, menuKey,title,type)">
              <a-menu-item key="open" v-if="children.length ==0 && (type !=3 &&type!=4)">打开</a-menu-item>
              <a-menu-item key="close" v-if="type != 2&&children.length >0 &&(type !=3 &&type!=4)">关闭连接</a-menu-item>
              <a-menu-item key="addDatasource" v-if="type == 0">新建连接</a-menu-item>
              <a-menu-item key="editDatasource" v-if="type == 0">编辑连接</a-menu-item>
              <a-menu-item key="createDatabase" v-if="type == 1 || (type == 0&&children.length >0)">新建数据库</a-menu-item>
              <a-menu-item key="createQuery" v-if="type == 4">新建查询</a-menu-item>
              <a-sub-menu key="dumpSQL" title="转储 SQL 文件">
                <a-menu-item key="aaa">3rd menu item</a-menu-item>
                <a-menu-item>4th menu item</a-menu-item>
              </a-sub-menu>
              <a-menu-item key="openGenerate" >打开代码生成页面</a-menu-item>
              <a-menu-item key="openTerminal" v-if="type != 2 &&(type != 0 || children.length >0)">打开命令行</a-menu-item>
              <a-menu-item key="rename" v-if="type == 2 || type == 0">重命名</a-menu-item>
              <a-menu-item key="delete" v-if="type !=3 && type !=4" :disabled="type == -1"
                           :style="{color: type==-1?'lightgray':'lightcoral'}">删除</a-menu-item>
              <a-menu-item key="reload" v-if="children.length >0">刷新</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>

    <a-button type="text" @click="()=>{openAddDatasource = true}" size="large" shape="circle"
              style="margin-left: 80%">
      <PlusCircleOutlined/>
    </a-button>
    <AddOrEditDataSourceModal v-model:open="openAddDatasource" v-model:is-add="isAddDatasource"
                              :editFormData="editDatasourceFormData"
                              @reloadDataSourceList="reloadDataSourceList"
                              @editReloadDataSourceList="editReloadDataSourceList"/>
    <CreateDatabaseModal v-model:open="openAddDatabase" :ds="createDataBaseDs" @reloadDataSourceList="reloadDatabase"/>
  </div>


</template>

<script setup lang="ts">
import {h, nextTick, onMounted, reactive, ref, watch} from "vue";
import {
  deleteDatabase, deleteDataSource,
  getAllDataSource,
  getAllTableList,
  renameDataSource
} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {ExclamationCircleOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import AddOrEditDataSourceModal from "@/view/leftTree/AddOrEditDataSourceModal.vue";
import MysqlOffSmall from '@/assets/mysql-off-small.svg'
import MysqlOnSmall from '@/assets/mysql-on-small.svg'
import SqliteOnSmall from '@/assets/sqlite-on-small.svg'
import SqliteOffSmall from '@/assets/sqlite-off-small.svg'
import DatabaseOffSmall from '@/assets/database-off-small.svg'
import DatabaseOnSmall from '@/assets/database-on-small.svg'
import TableSmall from '@/assets/table-small.svg'
import QuerySmall from "@/assets/query-small.svg"
import {message, Modal} from "ant-design-vue";
import CreateDatabaseModal from "@/view/leftTree/CreateDatabaseModal.vue";

import throttle from 'lodash/throttle';
import {useShowObjStore} from "@/store/showObjStore";
import {generateUUID} from "@/ts/interfaces";
import {deleteQuery} from "@/view/table/tableAboutApi";
import {getDatasourceObj, getDatasourceTypeByName, reloadDatabase, reloadQuery} from "@/view/leftTree/leftTree";
import {openGenerate, openQuery, openTableData} from "@/view/common/commonFunc";
import CanEditSpan from "@/view/common/CanEditSpan.vue";


onMounted(async () => {
  await reloadDataSourceList()
})
const globalStore = useGlobalStore()
const spanWidth = ref(globalStore.indexWidth - 114)

watch(
    () => globalStore.indexWidth,
    (value) => {
      spanWidth.value = value - 114
    }
);

const openAddDatasource = ref(false)
const isAddDatasource = ref(true)
const editDatasourceFormData: any = reactive({})
const openAddDatabase = ref(false)
const createDataBaseDs = ref("")
const datasourceSelectedKeys: any = ref([])
const datasourceExpandKeys: any = ref([])


const editInput = ref()
const editingKey = ref<string | null>(null);

const showObjStore = useShowObjStore()
const emit = defineEmits(["openTerminal", "openNewQuery", "updateTabListWhenDatasourceClosed", "updateTabListWhenDatabaseClosed"])

let clickTimeout: number | null = null;

function selectTree(keys, e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  datasourceSelectedKeys.value = [e.node.key]
  switch (e.node.type) {
    case 0:
      showObjStore.currentSelectedDatabase = ''
      showObjStore.currentSelectedDatasource = e.node.title
      showObjStore.isTableObjDataChanged += 1
      /*if (e.node.children.length == 0) {
        clickTimeout = window.setTimeout(async () => {
          console.log('单击触发')
          await reloadDatabase(e.node.datasourceName)
          console.log(e.node)
        }, 300);
      }*/

      break
    case 1:
      showObjStore.currentSelectedDatabase = e.node.title
      showObjStore.currentSelectedDatasource = e.node.parentId
      showObjStore.isTableObjDataChanged += 1
      /*if (e.node.children.length == 0) {
        clickTimeout = window.setTimeout(async () => {
          console.log('单击触发')
          await reloadTableList(e.node.parentId,e.node.title)
          console.log(e.node)
        }, 300);
      }*/
      break
    case 2:
    case 3:
      if (showObjStore.currentSelectedDatabase !== e.node.parentId || showObjStore.currentObjType !== 2) {
        showObjStore.currentSelectedDatabase = e.node.parentId
        showObjStore.currentSelectedDatasource = e.node.datasourceName
        showObjStore.currentObjType = 2
        showObjStore.isTableObjDataChanged += 1
      }
      break
    case 4:
    case 5:
      if (showObjStore.currentSelectedDatabase !== e.node.parentId || showObjStore.currentObjType !== 5) {
        showObjStore.currentSelectedDatabase = e.node.parentId
        showObjStore.currentSelectedDatasource = e.node.datasourceName
        showObjStore.currentObjType = 5
        showObjStore.isTableObjDataChanged += 1
      }
      break
  }
}

async function handleDoubleClick(e, node) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log("双击")
  switch (node.type) {
    case 0:
      if (node.children.length == 0) {
        await reloadDatabase(node.datasourceName,node.datasourceType)
        if (!datasourceExpandKeys.value.includes(node.key)) {
          datasourceExpandKeys.value = [...datasourceExpandKeys.value,node.key]
        }
        return
      }
      break
    case 1:
      if (node.children.length == 0) {
        await reloadTableList(node.parentId, node.title,getDatasourceTypeByName(node.parentId))
        if (!datasourceExpandKeys.value.includes(node.key)) {
          datasourceExpandKeys.value = [...datasourceExpandKeys.value,node.key]
        }
        return
      }
      break
    case 2:
      openTableData(node.datasourceName, node.parentId, node.title)
      break
    case 5:
      openQuery(node.datasourceName, node.parentId, node.title, node.queryText)
      break
  }
  if (!datasourceExpandKeys.value.includes(node.key)) {
    datasourceExpandKeys.value = [...datasourceExpandKeys.value,node.key]
  } else {
    datasourceExpandKeys.value = datasourceExpandKeys.value.filter(v => v !== node.key)
  }
}

//region -----重载数据-----
async function reloadDataSourceList() {
  let data: any = await getAllDataSource({user: useGlobalStore().loginUser});
  const dataMap = new Map(data.result.map(item => [item.datasourceName, item]));

  showObjStore.datasourceTreeData.forEach((item, index) => {
    if (!dataMap.has(item.datasourceName)) {
      showObjStore.datasourceTreeData.splice(index, 1);
    }
  });
  data.result.forEach(item => {
    if (!showObjStore.datasourceTreeData.some(ds => ds.datasourceName === item.datasourceName)) {
      showObjStore.datasourceTreeData.push(item);
    }
  });
  let tempMap = new Map()
  showObjStore.datasourceTreeData.forEach((item: any) => {
    if (showObjStore.treeDataMap.has(item.title)) {
      tempMap.set(item.title, showObjStore.treeDataMap.get(item.title))
    } else {
      tempMap.set(item.title, {data: item, childMap: new Map()})
    }
  })
  showObjStore.treeDataMap = tempMap
}

async function editReloadDataSourceList(title: string) {
  showObjStore.datasourceTreeData = showObjStore.datasourceTreeData.filter((item: any) => item.title != title)
  await reloadDataSourceList()
}

async function reloadTableList(datasourceName: string, databaseName: string, datasourceType:number) {
  const data: any = await getAllTableList({
    user: useGlobalStore().loginUser,
    ds: datasourceName,
    databaseName: databaseName,
    datasourceType: datasourceType
  });

  if (data.code === 200) {
    const item = getDatabaseObj(datasourceName, databaseName)
    item.children = []
    const table: any = {
      key: generateUUID(),
      title: '表',
      type: 3,
      parentId: databaseName,
      datasourceName: datasourceName,
      children: []
    }
    const query: any = {
      key: generateUUID(),
      title: '查询',
      type: 4,
      parentId: databaseName,
      datasourceName: datasourceName,
      children: []
    }
    item.children.push(table)
    item.children.push(query)
    const tableTree = data.result.tableTree;
    const tableColumn = data.result.tableColumn;
    const queryTree = data.result.queryTree;
    const queryColumn = data.result.queryColumn;

    // 加载 tableTree
    table.children.push(...tableTree)
    // 更新 tableColumn 和其他状态
    if (showObjStore.tableObjData.has(datasourceName)) {
      showObjStore.tableObjData.get(datasourceName).set(databaseName, tableColumn);
    } else {
      showObjStore.tableObjData.set(datasourceName, new Map())
      showObjStore.tableObjData.get(datasourceName).set(databaseName, tableColumn)
    }
    //加载查询
    query.children.push(...queryTree)
    if (showObjStore.queryObjData.has(datasourceName)) {
      showObjStore.queryObjData.get(datasourceName).set(databaseName, queryColumn);
    } else {
      showObjStore.queryObjData.set(datasourceName, new Map())
      showObjStore.queryObjData.get(datasourceName).set(databaseName, queryColumn)
    }
    //刷新
    showObjStore.datasourceTreeData.push({})
    showObjStore.datasourceTreeData.pop()
    showObjStore.isTableObjDataChanged += 1;
  }
}

//endregion----

const handleMenuClick = throttle((data: any, key: string, menuKey: string, title: string, type: number) => {
  dropdown(data, key, menuKey, title, type);
}, 300);

async function dropdown(data: any, key: string, menuKey: string, title: string, type: number) {
  console.log(data)
  switch (menuKey) {
    case 'aaa':
      console.log('aaaaa')
          break
    case 'open':
      await handleDoubleClick(null, data)
      break
    case 'close':
      if (type == 1) {
        resetDatabaseChildren(data.parentId, title)
        emit('updateTabListWhenDatabaseClosed', title)
      } else if (type == 0) {
        resetDatasourceChildren(title)
        emit('updateTabListWhenDatasourceClosed', title)
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
      if (type == 0) {
        createDataBaseDs.value = title
      } else if (type == 1) {
        createDataBaseDs.value = data.parentId
      }
      break
    case 'createQuery':
      emit('openNewQuery', data.datasourceName, data.parentId)
      break
    case 'openGenerate':
      openGenerate()
      break
    case 'openTerminal':
      if (type == 0) {
        emit('openTerminal', title)
      } else if (type == 1) {
        emit('openTerminal', data.parentId)
      }
      break
    case 'delete':
      deleteTreeNode(data, key, menuKey, title, type)
      break
    case 'rename':
      editingKey.value = key;
      break
    case 'reload':
      switch (type) {
        case 0:
          await reloadDatabase(title,data.datasourceType)
          break
        case 1:
          await reloadTableList(data.parentId, title,getDatasourceTypeByName(data.parentId))
          break
        case 4:
          await reloadQuery(data.datasourceName, data.parentId)
          break

      }
      break
  }
}

async function submitEdit(editText,data) {
  if (data.title == editText || editText == '') {
    editingKey.value = null;
    return
  }
  console.log(data)
  if (data.type == 0) {
    const result = await renameDataSource({id: data.id, datasourceName: editText})
    if (result.code == 200) {
      const item = showObjStore.treeDataMap.get(data.title)
      showObjStore.treeDataMap.delete(data.title)
      item.data.title = editText
      showObjStore.treeDataMap.set(editText, item)
      item.childMap.forEach((value, key) => {
        value.parentId = editText
      })
      message.success("重命名成功！")
    }
  } else if (data.type == 1) {

  }
  editingKey.value = null
}

function deleteTreeNode(data: any, key: string, menuKey: string, title: string, type: number) {
  switch (type) {
    case 0:
      Modal.confirm({
        title: h('div', [

          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '删除数据连接')
        ]),
        icon: h(ExclamationCircleOutlined),
        content: h('div', [
          '删除数据连接将',
          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '无法恢复'),
          '，是否继续?'
        ]),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result: any = await deleteDataSource({
            user: globalStore.loginUser,
            name: title
          })
          if (result.code == 200) {
            message.success("删除成功")
          }
          await reloadDataSourceList()
        },
        onCancel() {
        },
      });
      break
    case 1:
      Modal.confirm({
        title: h('div', [

          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '删除数据库')
        ]),
        icon: h(ExclamationCircleOutlined),
        content: h('div', [
          '删除数据库将会删除其下', h('span', {style: {color: 'red', fontWeight: 'bold'}}, '所有数据'), '且',
          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '后果不可逆'),
          '，是否继续?'
        ]),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result: any = await deleteDatabase({
            databaseName: title,
            user: globalStore.loginUser,
            ds: data.parentId
          })
          if (result.code == 200) {
            message.success("删除成功")
          }
          await reloadDatabase(data.parentId,getDatasourceObj(data.parentId).datasourceType)
        },
        onCancel() {
        },
      });
      break
    case 5:
      Modal.confirm({
        title: h('div', [

          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '删除查询')
        ]),
        icon: h(ExclamationCircleOutlined),
        content: h('div', [
          '删除查询将',
          h('span', {style: {color: 'red', fontWeight: 'bold'}}, '无法恢复'),
          '，是否继续?'
        ]),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result: any = await deleteQuery({
            id: key
          })
          if (result.code == 200) {
            message.success("删除成功")
          }
          await reloadTableList(data.datasourceName, data.parentId,getDatasourceTypeByName(data.datasourceName))
        },
        onCancel() {
        },
      });
  }
}

//region -----重载数据方法-----


function getDatabaseObj(parentTitle: string, title: string) {
  return showObjStore.treeDataMap.get(parentTitle).childMap.get(title)
}

function setDatabaseChildren(parentTitle: string, title: string, data: any) {
  getDatabaseObj(parentTitle, title).children = data
  showObjStore.datasourceTreeData.push({})
  showObjStore.datasourceTreeData.pop()
}

function resetDatasourceChildren(title: string) {
  getDatasourceObj(title).data.children = []
  getDatasourceObj(title).childMap = new Map()
  showObjStore.tableObjData.set(title, new Map())
  if (showObjStore.currentSelectedDatasource == title) {
    showObjStore.isTableObjDataChanged += 1
  }
}

function resetDatabaseChildren(parentTitle: string, title: string) {
  getDatabaseObj(parentTitle, title).children = []
  if (showObjStore.tableObjData.has(parentTitle)) {
    showObjStore.tableObjData.get(parentTitle).set(title, [])
  }
  if (showObjStore.currentSelectedDatabase == title) {
    showObjStore.isTableObjDataChanged += 1
  }
  showObjStore.datasourceTreeData.push({})
  showObjStore.datasourceTreeData.pop()
}

//endregion
</script>

<style scoped>
:deep(.anticon) {
  transform: translateY(-2px);
}

</style>