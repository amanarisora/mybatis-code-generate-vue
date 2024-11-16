<template>
  <div ref="parentElement" style="height: 100%">
    <a-tabs v-model:activeKey="activeKey" size="small" hide-add type="editable-card" style="height: 100%"
            :tabBarStyle="{margin:'0',color:'black'}" @edit="()=>{}">
      <a-tab-pane v-for="(pane, index) in panes" :key="pane.key" :tab="pane.title" :closable="false"
                  style="height: 100%;">
        <div style="height: 100%">
          <a-col style="padding: 10px 0 0 10px">
            <a-row>
              <span>执行sql：{{ pane.sql }} , 执行成功！</span>
            </a-row>
            <a-row>
              <span v-if="pane.affectedNum">共影响 {{ pane.affectedNum }} 行</span>
            </a-row>
            <a-row>
              <span v-if="!pane.affectedNum && pane.data.length==0">没有查到数据</span>
            </a-row>
          </a-col>
          <a-table v-if="pane.columns" :columns="pane.columns" :data-source="pane.data"
                   :pagination="pagination" @resizeColumn="handleResizeColumn"
                   :scroll="{x:'100%',y:(tableScrollHeight)+'px'}" >
            <template #bodyCell="{text, column, record,index }">
                <span v-if="column.key =='cs121sn801n'">{{
                    ((pagination.current - 1) * pagination.pageSize) + index + 1
                  }}</span>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, PropType, reactive, ref, watch} from "vue";
import {theme} from "ant-design-vue";
import {QueryResultPaneObj} from "@/view/table/query";


const props = defineProps({
  panes: {
    type: Array as PropType<QueryResultPaneObj[]>,
    required: true
  },
  isChanged: {
    type: Number,
    required: true
  }
})
const activeKey = ref('')
const panes:any = ref([])
const tableScrollHeight = ref(0)
const parentElement = ref(null);
let resizeObserver;

onMounted(() => {
  if (parentElement.value) {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        tableScrollHeight.value = height-170
        console.log(tableScrollHeight.value)
      }
    });

    resizeObserver.observe(parentElement.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(() => props.isChanged, (value) => {
  panes.value = props.panes
  activeKey.value = panes.value[0].key
}, {deep: true})



/*function onEdit(targetKey: string | MouseEvent, action: string){
  if (action !== 'add') {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
  }
}*/

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
}

function sizeChange(current, size) {
  pagination.pageSize = size
}

function handleResizeColumn(w, col) {
  col.width = w;
}
</script>

<style scoped>
:deep(.ant-table-cell){
  padding: 5px !important;
  font-size: 12px;
}
:deep(.ant-tabs-tab){
  font-size: 12px !important;
}

:deep(.ant-pagination){
  font-size: 12px !important;
  margin: 5px 5px;
}
:deep(.ant-pagination-options-size-changer){
  font-size: 12px !important;
}

</style>