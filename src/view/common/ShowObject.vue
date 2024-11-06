<template>
  <div style="height: 100%">
    <a-table :columns="column" :data-source="tableData" :pagination="pagination"
             :scroll="{x: '100%',y:tableHeight}" :style="{minHeight: tableHeight+'px'}"
             :row-selection="rowSelection" row-key="id" :virtual="true" @resizeColumn="handleResizeColumn"
    >
      <template #bodyCell="{text, column, record,index }">
        <a-dropdown :trigger="['contextmenu']">
          <div>
            <span v-if="column.key =='cs121sn801n'">{{ ((pagination.current - 1) * pagination.pageSize) + index + 1 }}</span>
            <span v-else>{{text}}</span>
          </div>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => console.log(menuKey)">
              <a-menu-item key="open" >打开</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>

</template>

<script setup lang="ts">

import {QueryObjectColumns, TableObjectColumn} from "@/view/common/ShowObject";
import {onMounted, onUpdated, reactive, ref, watch} from "vue";
import {useShowObjStore} from "@/store/showObjStore";

const showObjStore = useShowObjStore()
onMounted(() => {
  const table = document.querySelector('.ant-tabs-content-holder')
  if(table){
    const parentHeight = table.parentElement?.clientHeight;
    tableHeight.value = (parentHeight?parentHeight:1000) * 0.8;
  }
});
// region 表相关
const tableHeight = ref(0);
const column = ref(TableObjectColumn)
const selectedRowKeys = ref([])
const selectedRow = ref([])
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
//endregion


watch(()=>showObjStore.isTableObjDataChanged,()=>{
  pagination.current = 1
  if (showObjStore.currentObjType == 2){
    if (showObjStore.tableObjData.has(showObjStore.currentSelectedDatasource)){
      column.value = TableObjectColumn
      tableData.value = showObjStore.tableObjData.get(showObjStore.currentSelectedDatasource).get(showObjStore.currentSelectedDatabase)
    }
  }else if (showObjStore.currentObjType == 5){
    if (showObjStore.queryObjData.has(showObjStore.currentSelectedDatasource)){
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

</style>