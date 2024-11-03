<template>
  <a-layout style="height: 100%;">
    <a-layout-header style="background-image: url('/top.png');background-size: cover;">
      <div style="background-image: url('/back.png');opacity: 0.7"></div>
      <a-button type="text" style="color: aqua;left: 90%">{{ '当前登录用户：' + useGlobalStore().loginUser }}</a-button>
      <a-button shape="circle" style="color: red;background: white;left: 90%" @click="logOut">
        <PoweroffOutlined/>
      </a-button>

    </a-layout-header>

    <a-layout style="height:100%;background-image: url('/main.png');background-size: cover;">
      <a-layout-sider :width="siderWidth" style="height: 100%;overflow: auto;overflow-x: hidden">
        <DatasourceTree/>
        <div class="resizer" @mousedown="startResize"></div>
      </a-layout-sider>

      <a-layout-content
          style="padding: 0 24px 0 24px; margin: 0; min-height: 280px;position:relative;overflow: auto"
      >

        <a-row style="margin: 15px 0 15px 0;" type="flex" justify="space-between">
          <a-col>
            <a-space>
              <a-button type="primary" @click="selectAll">全选</a-button>
              <a-button type="primary" @click="()=>{openTempRep = true}">模板库</a-button>
              <a-button type="primary" @click="()=>{openEditTemp = true}">编辑模板</a-button>
              <a-button type="primary" @click="()=>{open1 = true}">测试</a-button>
            </a-space>
          </a-col>
          <a-col>
            <a-space >
              <a-form layout="inline"  autocomplete="off">
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
            <span v-if="column.key =='index'">{{ ((pagination.current - 1) * pagination.pageSize) + index + 1 }}</span>
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
      </a-layout-content>
    </a-layout>
  </a-layout>
  <AddModel v-model:open="openAdd" @reloadDataSourceList="reloadDataSourceList"></AddModel>
  <EditModel v-model:open="openEdit" :formData="editFormData" @reloadDataSourceList="reloadDataSourceList"></EditModel>
  <CodeMirrorModal v-model:open="openEditTemp"/>
  <TempRepositoryModal v-model:open="openTempRep"/>
  <MySqlTerminalModal v-model:open="open1"/>
</template>
<script lang="ts" setup>
import {defineAsyncComponent, h, onMounted, reactive, ref, watch} from 'vue';
import {UserOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {deleteDataSource, generate, getAllDataSource, getAllTableList} from "@/Api";
import AddModel from "@/components/AddModal.vue";
import {SettingFilled, DeleteFilled, PoweroffOutlined, PlusCircleOutlined} from '@ant-design/icons-vue'
import EditModel from "@/components/EditModal.vue";
import {columns, createRowSelection, FormState, generateFormData, isNotBlank, TableData} from "@/ts/interfaces";
import {useGlobalStore} from "@/store/globalStore";
import {router} from "@/router/router";
import {message} from "ant-design-vue";
import CodeMirrorModal from "@/components/CodeMirrorModal.vue";
import TempRepositoryModal from "@/components/TempRepositoryModal.vue";
import DatasourceTree from "@/view/leftTree/DatasourceTree.vue";
import throttle from 'lodash/throttle';
import MySqlTerminalModal from "@/view/leftTree/MySqlTerminalModal.vue";

const currentName = ref<string>('')
const subItems: any = ref([])
const openAdd = ref<boolean>(false);
const openEdit = ref<boolean>(false);
const openEditTemp = ref<boolean>(false);
const openTempRep = ref<boolean>(false);
const globalStore =  useGlobalStore()
const open1 = ref(false)

onMounted(async () => {
  await reloadDataSourceList()
})

const siderWidth = ref(300); // 初始宽度

function startResize(event) {
  const startX = event.clientX;
  const startWidth = siderWidth.value;

  // 禁用选择
  document.body.style.userSelect = 'none';
  const onMouseMove = throttle((e) => {
    const newWidth = startWidth + (e.clientX - startX);
    siderWidth.value = Math.min(Math.max(250, newWidth), 500); // 设置最小宽度为200px，最大宽度为400px
    globalStore.indexWidth = siderWidth.value
  }, 80); // 每16ms执行一次，约等于60fps

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // 恢复选择
    document.body.style.userSelect = '';
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}



const editFormData = reactive<FormState>({
  id: '',
  name: '',
  url: '',
  username: '',
  password: '',
  user: ''
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

const searchForm = reactive({
  tableName: '',
  des: ''
})

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

async function click(name: string) {
  rowSelection.value.selectedRowKeys = []
  rowSelection.value.selectedRow = []
  currentName.value = name
  tableData.value = (await getAllTableList({user: useGlobalStore().loginUser, ds: name})).result
  tableData.value.forEach(i => {
    i.key = i.TABLE_NAME
  })
  allTableData.value = tableData.value
}

function add() {
  openAdd.value = true
}

async function reloadDataSourceList() {
  let a: any = await getAllDataSource({user: useGlobalStore().loginUser});
  subItems.value = a.result
}

function edit(name: string) {
  subItems.value.find(item => {
    if (item.name === name) {
      editFormData.id = item.id
      editFormData.name = item.name
      editFormData.url = item.url
      editFormData.username = item.username
      editFormData.password = item.password
    }
  })
  openEdit.value = true
}

async function remove(name: string) {
  await deleteDataSource({user: useGlobalStore().loginUser, name: name})
  await reloadDataSourceList()

}

function selectAll() {
  if (selectedRowKeys.value.length === tableData.value.length) {
    selectedRowKeys.value = []
  } else {
    selectedRowKeys.value = tableData.value.map(t => t.key)
  }
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

function logOut() {
  useGlobalStore().setUser('')
  router.push('/app/login')
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

.resizer {
  width: 5px;
  cursor: ew-resize;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10; /* 确保 resizer 在滚动条之上 */
}

:deep(.ant-menu-item) {
  padding-left: 20px !important; /* 自定义 padding-left */
}

:deep(.ant-menu-submenu-title) {
  padding-left: 10px !important; /* 自定义 padding-left */
}

:deep(.ant-table-thead) > tr > th {
  background-color: #e3eff9 !important; /* 青色 */
}

/* 设置单数行的背景颜色 */
:deep(.ant-table-tbody) > tr:nth-child(odd) {
  background-color: #f8f9fb !important; /* 青色 */
}
</style>
