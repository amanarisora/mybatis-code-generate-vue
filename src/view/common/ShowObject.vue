<template>
  <div style="height: 100%">
    <a-table :columns="column" :data-source="tableData" :pagination="pagination" :customRow="customRow"
             :scroll="{x: '100%',y:tableHeight}" :style="{minHeight: tableHeight+'px'}"
             :row-selection="rowSelection" row-key="id" :virtual="true" @resizeColumn="handleResizeColumn"
    >
      <template #bodyCell="{text, column, record,index }">
        <div>
          <span v-if="column.key =='cs121sn801n'">{{
              ((pagination.current - 1) * pagination.pageSize) + index + 1
            }}</span>
          <div v-else-if="column.key =='tableName' || column.key =='queryName' " class="tree-node-title">
            <QuerySmall v-if="column.key =='queryName'" class="mysql-icon-small" style="float: left;margin-right: 4px"/>
            <TableSmall v-else class="mysql-icon-small" style="float: left;margin-right: 4px"/>
            <span class="tree-node-text">{{ text }}</span>
          </div>
          <span v-else>{{ text }}</span>
        </div>
        <!--        <template #overlay>
                  <a-menu @click="({ key: menuKey }) => console.log(menuKey)">
                    <a-menu-item key="open" >打开</a-menu-item>
                  </a-menu>
                </template>-->
      </template>
    </a-table>
    <a-menu v-if="openContextmenu" class="menu"
            :style="{position:'fixed',left:`${contextMenuPosition.x}px`,top:`${contextMenuPosition.y}px`,zIndex: 20}">
      <a-menu-item key="">打开</a-menu-item>
    </a-menu>
  </div>

</template>

<script setup lang="ts">

import {QueryObjectColumns, TableObjectColumn} from "@/view/common/ShowObject";
import {onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch} from "vue";
import {useShowObjStore} from "@/store/showObjStore";
import TableSmall from "@/assets/table-small.svg";
import QuerySmall from "@/assets/query-small.svg";
import {openQuery, openTableData} from "@/view/common/commonFunc";

const showObjStore = useShowObjStore()
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  const table = document.querySelector('.ant-tabs-content-holder')
  if (table) {
    const parentHeight = table.parentElement?.clientHeight;
    tableHeight.value = (parentHeight ? parentHeight : 1000) * 0.8;
  }
});

onBeforeUnmount(()=>{
  document.removeEventListener('click', handleClickOutside);
})

function handleClickOutside(event) {
  // 检查点击是否发生在菜单外部
  if (!event.target.closest('.menu')) {
    openContextmenu.value = false;
  }
}

// region 表相关
const tableHeight = ref(0);
const column = ref(TableObjectColumn)
const selectedRowKeys: any = ref([])
const selectedRow: any = ref([])
const tableData = ref([])

const rowSelection = ref({
  checkStrictly: false,
  columnWidth: 30,
  fixed: true,
  selectedRowKeys: selectedRowKeys,
  selectedRow: selectedRow,
  onChange: (keys, rows?) => {
    selectedRowKeys.value = keys;
    selectedRow.value = rows;
  }
})

const pagination = reactive({
  current: 1,

  pageSize: 20,
  showTotal: total => `共 ${total} 条`,
  total: 0,
  onChange: onPageChange,
  onShowSizeChange: sizeChange
})

function onPageChange(page) {
  pagination.current = page
}

function sizeChange(current, size) {
  pagination.pageSize = size
  rowSelection.value.selectedRowKeys = []
  rowSelection.value.selectedRow = []
}

let clickTimeout: number | null = null;
const openContextmenu = ref(false);
const contextMenuPosition = ref({x: 0, y: 0});

const customRow = (record, index) => {
  return {
    onClick: (event) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }
      console.log(record)
      selectedRowKeys.value = []
      selectedRowKeys.value.push(record.id)
      selectedRow.value = []
      selectedRow.value.push(record)
      clickTimeout = window.setTimeout(async () => {
        console.log('单击触发')
      }, 300);
    },
    onDblclick: (event) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      if (showObjStore.currentObjType == 2) {
        openTableData(showObjStore.currentSelectedDatasource, showObjStore.currentSelectedDatabase, record.tableName)
      } else if (showObjStore.currentObjType == 5) {
        openQuery(showObjStore.currentSelectedDatasource, showObjStore.currentSelectedDatabase, record.queryName, record.queryText)
      }
      console.log("双击");
    },
    onContextmenu: (event) => {
      event.preventDefault()
      console.log("右键菜单")
      selectedRowKeys.value = []
      selectedRowKeys.value.push(record.id)
      selectedRow.value = []
      selectedRow.value.push(record)
      openContextmenu.value = true
      contextMenuPosition.value = { x: event.clientX, y: event.clientY };
    }
  }
}
//endregion


watch(() => showObjStore.isTableObjDataChanged, () => {
  pagination.current = 1
  if (showObjStore.currentObjType == 2) {
    if (showObjStore.tableObjData.has(showObjStore.currentSelectedDatasource)) {
      column.value = TableObjectColumn
      tableData.value = showObjStore.tableObjData.get(showObjStore.currentSelectedDatasource).get(showObjStore.currentSelectedDatabase)
    }
  } else if (showObjStore.currentObjType == 5) {
    if (showObjStore.queryObjData.has(showObjStore.currentSelectedDatasource)) {
      column.value = QueryObjectColumns
      tableData.value = showObjStore.queryObjData.get(showObjStore.currentSelectedDatasource).get(showObjStore.currentSelectedDatabase)
    }
  }

})

function handleResizeColumn(w, col) {
  col.width = w;
}

</script>

<style scoped>
:deep(.ant-table-row-selected) {
  background-color: #e6f7ff !important;
}
.menu{

}
:deep(.ant-table-cell){
  padding: 5px !important;
  font-size: 12px;
}
</style>