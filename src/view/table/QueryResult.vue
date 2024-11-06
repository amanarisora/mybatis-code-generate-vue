<template>
  <div ref="parentElement">
    <a-config-provider
        :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#82a0ca'
      }
    }"
    >
      <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card" style="height: 100%"
              :tabBarStyle="{margin:'0'}" @edit="()=>{}">
        <a-tab-pane v-for="(pane, index) in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable"
                    style="height: 100%;overflow:auto;">
          <a-col style="padding: 10px 0 0 10px">
            <a-row>
              <span>执行sql：{{ pane.sql }} , 执行成功！</span>
            </a-row>
            <a-row>
              <span v-if="pane.affectedNum">共影响 {{ pane.affectedNum }} 行</span>
            </a-row>
          </a-col>
          <div style="display:flex;width: 100%;">
            <a-table v-if="pane.columns" :columns="pane.columns" :data-source="pane.data"
                     :pagination="pagination" @resizeColumn="handleResizeColumn"
                     :scroll="{x:'100%',y:'100%'}" style="width: 100%">
              <template #bodyCell="{text, column, record,index }">
                <span v-if="column.key =='cs121sn801n'">{{
                    ((pagination.current - 1) * pagination.pageSize) + index + 1
                  }}</span>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-config-provider>

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

const panes:any = ref([])
const columnList:any = ref([])
const tableScrollWidth = ref(0)
const tableScrollHeight = ref(0)
const parentElement = ref(null);
let resizeObserver;

onMounted(() => {
  if (parentElement.value) {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        tableScrollWidth.value = width
        tableScrollHeight.value = height
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
  console.log(panes.value)
}, {deep: true})

const activeKey = ref('')

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
</style>