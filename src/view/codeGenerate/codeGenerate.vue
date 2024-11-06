<template>
  <a-row style="margin: 15px 0 15px 0;" type="flex" justify="space-between">
    <a-col>
      <a-space>
        <a-button type="primary" @click="selectAll">全选</a-button>
        <a-button type="primary" @click="()=>{openTempRep = true}">模板库</a-button>
        <a-button type="primary" @click="()=>{openEditTemp = true}">编辑模板</a-button>
      </a-space>
    </a-col>
    <a-col>
      <a-space>
        <a-form layout="inline" autocomplete="off">
          <a-space>
            <a-form-item label="表名" name="tableName">
              <a-input style="width: 140px;" v-model:value="searchForm.tableName" :allowClear="true"/>
            </a-form-item>
            <a-form-item label="备注" name="des">
              <a-input style="width: 140px;" v-model:value="searchForm.des" :allowClear="true"/>
            </a-form-item>
          </a-space>
        </a-form>
        <a-button type="primary" @click="search">
          <SearchOutlined/>
          搜索
        </a-button>
        <a-button type="primary" @click="reload">
          <ReloadOutlined/>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-table :columns="columns" :data-source="tableData" :pagination="pagination"
           :row-selection="rowSelection" style="min-height: 500px">
    <template #bodyCell="{ column, record,index }">
      <span v-if="column.key =='cs121sn801n'">{{ ((pagination.current - 1) * pagination.pageSize) + index + 1 }}</span>
    </template>
  </a-table>


  <a-input :value="selectedRowKeys.join(' , ')"/>
  <a-form
      style="margin-left: 0px;padding-top: 20px"
      ref="form"
      :model="generateForm"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 40 }"
      autocomplete="off"
  >
    <a-row class="bold-text">
      <a-col>
        <a-form-item label="model" name="model"
                     :rules="[{ required: true, message: '需要model!',trigger: 'blur' }]"
        >
          <a-input v-model:value="generateForm.model"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item label="package" name="packageName"
                     :rules="[{ required: true, message: '需要package!',trigger: 'blur' }]"
        >
          <a-input v-model:value="generateForm.packageName"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item label="作者" name="author"
                     :rules="[{ required: true, message: '需要author!',trigger: 'blur' }]"
        >
          <a-input v-model:value="generateForm.author"></a-input>
        </a-form-item>
      </a-col>
      <a-col style="padding-left: 30px">
        <a-form-item label="去除表前缀" name="tablePrefix">
          <a-input v-model:value="generateForm.tablePrefix"></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="bold-text">
      <a-col>
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needEntity">Entity</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-input class="generate-input" v-model:value="generateForm.entityFilePathName"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needMapper">Mapper</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-input class="generate-input" v-model:value="generateForm.mapperFilePathName"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needController">Controller</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-input class="generate-input" v-model:value="generateForm.controllerFilePathName"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needService">Service</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-input class="generate-input" v-model:value="generateForm.serviceFilePathName"></a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needServiceImpl">ServiceImpl</a-checkbox>
          <a-input class="generate-input" v-model:value="generateForm.serviceImplFilePathName"></a-input>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <!--                <a-form-item>

                        </a-form-item>-->
      </a-col>
    </a-row>
    <a-row class="bold-text">
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needLombok">Lombok</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needChainModel">
            <a-tooltip>
              <template #title>实体类set方法返回自身</template>
              ChainModel
            </a-tooltip>
          </a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needRestController">RestController</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needMapperAnno">@Mapper</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needSwagger">Swagger</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col">
        <a-form-item>
          <a-checkbox v-model:checked="generateForm.needSpringDoc">SpringDoc</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col class="generate-col" style="position: absolute;right: 5%">
        <a-form-item>
          <a-button type="primary" @click="generateSubmit">生成</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <CodeMirrorModal v-model:open="openEditTemp"/>
  <TempRepositoryModal v-model:open="openTempRep"/>
</template>

<script setup lang="ts">
import {columns, createRowSelection, generateFormData, isNotBlank} from "@/ts/interfaces";
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {reactive, ref, watch} from "vue";
import {generate, getAllDataSource, getAllTableList} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {message} from "ant-design-vue";
import CodeMirrorModal from "@/components/CodeMirrorModal.vue";
import TempRepositoryModal from "@/components/TempRepositoryModal.vue";

const currentName = ref<string>('')
const subItems: any = ref([])
const openEditTemp = ref<boolean>(false);
const openTempRep = ref<boolean>(false);
const globalStore =  useGlobalStore()

const generateForm = reactive<generateFormData>({
  model: '',
  packageName: 'com.',
  author: 'author',
  tablePrefix: '',
  needEntity: true,
  entityFilePathName: 'entity',
  needMapper: true,
  mapperFilePathName: 'mapper',
  needController: true,
  controllerFilePathName: 'controller',
  needService: true,
  serviceFilePathName: 'service',
  needServiceImpl: true,
  serviceImplFilePathName: 'service.impl',
  needLombok: true,
  needChainModel: true,
  needRestController: true,
  needMapperAnno: false,
  needSwagger: false,
  needSpringDoc: true,
})

const tableData: any = ref<[]>([])
const allTableData: any = ref<[]>([])

const pagination = reactive({
  current: 1,

  pageSize: 10,
  showTotal: total => `共 ${total} 条`,
  total: 0,
  showSizeChanger: true,
  onChange: onPageChange,
  onShowSizeChange: sizeChange
})

function onPageChange(page) {
  pagination.current = page
}

const selectedRowKeys: any = ref([])
const selectedRow: any = ref([])
const rowSelection: any = createRowSelection(selectedRowKeys, selectedRow)

function sizeChange(current, size) {
  pagination.pageSize = size
  rowSelection.value.selectedRowKeys = []
  rowSelection.value.selectedRow = []
}

watch(() => generateForm.needSwagger, (value) => {
  if (generateForm.needSpringDoc && value) {
    generateForm.needSpringDoc = false;
  }
})

watch(() => generateForm.needSpringDoc, (value) => {
  if (generateForm.needSwagger && value) {
    generateForm.needSwagger = false;
  }
})

const searchForm = reactive({
  tableName: '',
  des: ''
})



function selectAll() {
  if (selectedRowKeys.value.length === tableData.value.length) {
    selectedRowKeys.value = []
  } else {
    selectedRowKeys.value = tableData.value.map(t => t.key)
  }
}

async function click(name: string) {
  rowSelection.value.selectedRowKeys = []
  rowSelection.value.selectedRow = []
  currentName.value = name
  const data:any = await getAllTableList({user: useGlobalStore().loginUser, ds: name})
  tableData.value = data.result.tableTree
  tableData.value.forEach(i => {
    i.key = i.TABLE_NAME
  })
  allTableData.value = tableData.value
}

function search(){
  tableData.value = []
  allTableData.value.forEach(i=>{
    if (isNotBlank(searchForm.tableName)){
      if (!i.TABLE_NAME.includes(searchForm.tableName)){
        return
      }
    }
    if (isNotBlank(searchForm.des)){
      if (!i.TABLE_COMMENT.includes(searchForm.des)){
        return
      }
    }
    tableData.value.push(i)
  })
}

function reload() {
  click(currentName.value)
}

async function generateSubmit() {
  if (selectedRowKeys.value.length === 0) {
    message.error("未选择表！")
  }
  const param: any = generateForm
  param.user = useGlobalStore().loginUser
  param.name = currentName.value
  param.tableNameList = selectedRowKeys.value
  generate(param).then(response => {
    /*console.log(response)
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded_file.zip';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    const blob = new Blob([response.data])
    console.log(blob)
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);*/
  })


  // 创建下载链接并触发下载


}

async function reloadDataSourceList() {
  let a: any = await getAllDataSource({user: useGlobalStore().loginUser});
  subItems.value = a.result
}

</script>

<style scoped>
.generate-col {
  padding-right: 20px;
}

.generate-input {
  width: 200px;
  height: 32px;
  padding-top: 10px;
}

.bold-text {
  font-weight: bold;
}

:deep(.ant-table-thead) > tr > th {
  background-color: #e3eff9 !important; /* 青色 */
}

/* 设置单数行的背景颜色 */
:deep(.ant-table-tbody) > tr:nth-child(odd) {
  background-color: #f8f9fb !important; /* 青色 */
}
</style>