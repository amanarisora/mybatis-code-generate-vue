<template>
  <a-table :columns="columns" :data-source="tableData" :pagination="pagination" bordered
           :scroll="{x: '100%',y:tableHeight}" :style="{minHeight: tableHeight+'px'}"
           :row-selection="rowSelection" row-key="id" :virtual="true" @resizeColumn="handleResizeColumn"
           >

    <template #bodyCell="{text, column, record,index }">
      <span v-if="column.key =='index'">{{ ((pagination.current - 1) * pagination.pageSize) + index + 1 }}</span>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {getTableColumnVueList, queryTableDateByPage, test} from "@/view/table/tableAboutApi";
import {useGlobalStore} from "@/store/globalStore";

//region 表基础相关
const columns = ref([])
const tableData = ref([])
const tableHeight = ref(0);
const selectedRowKeys = ref([])
const selectedRow = ref([])

const rowSelection = ref({
  checkStrictly: false,
  columnWidth: 50,
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

async function onPageChange(page) {
  pagination.current = page
  const data:any = await queryTableDateByPage({databaseName: props.databaseName, tableName: props.tableName,
    user:useGlobalStore().loginUser,ds:props.datasourceName})
  tableData.value = data.result.records
  pagination.total = data.result.total
}

function sizeChange(current, size) {
  pagination.pageSize = size
  rowSelection.value.selectedRowKeys = []
  rowSelection.value.selectedRow = []
}
//endregion

const props = defineProps({
  datasourceName: String,
  databaseName: String,
  tableName: String,
})

onMounted(async ()=>{
  await test({user:useGlobalStore().loginUser,ds:props.datasourceName})
  const table = document.querySelector('.ant-tabs-content-holder')
  if(table){
    const parentHeight = table.parentElement?.clientHeight;
    tableHeight.value = (parentHeight?parentHeight:1000) * 0.8;
  }
  let data:any = await getTableColumnVueList({databaseName: props.databaseName, tableName: props.tableName,
    user:useGlobalStore().loginUser,ds:props.datasourceName})
  columns.value = data.result
  data = await queryTableDateByPage({databaseName: props.databaseName, tableName: props.tableName,
    user:useGlobalStore().loginUser,ds:props.datasourceName})
  tableData.value = data.result.records
  pagination.total = data.result.total
})


function handleResizeColumn(w, col) {
  col.width = w;
}

</script>

<style scoped>
:deep(.ant-table-cell){
  padding: 5px !important;
  font-size: 12px;
}
</style>