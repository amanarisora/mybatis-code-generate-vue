<template>
  <a-modal :open="props.open" title="设置模板" @cancel="emit('update:open',false)"
           ok-text="保存" @ok="saveCurrentSetting"
           style="top: 20px; padding: 0; max-height: 100vh; width: 1000px ">
    <a-layout style="background: transparent;width: 100%;height: 100%">
      <a-layout-sider style="background: transparent;border-right: 1px solid #494949;">
        <TempGroupTree ref="tempGroupTree" style="padding-right: 10px"
                       v-model:temp-group-tree-data="tempGroupTreeData" v-model:tempGroupSelectedKeys="tempGroupSelectedKeys"
                       @reload="reloadTempGroup"/>
      </a-layout-sider>
      <a-layout-content style="display: flex;align-items: center;justify-content: center;">
        <a-form ref="form"
                :model="formData"
                name="basic"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 18 }"
                autocomplete="off"
        >
          <a-form-item
              label="Controller"
              name="controllerTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.controllerTempName" style="width: 300px;"/>
              <a-button @click="selectTemp(1)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(1)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>

          <a-form-item
              label="Entity"
              name="entityTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.entityTempName" style="width: 300px;"/>
              <a-button @click="selectTemp(2)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(2)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>

          <a-form-item
              label="Mapper"
              name="mapperTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.mapperTempName" style="width: 300px;"/>
              <a-button @click="selectTemp(3)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(3)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>

          <a-form-item
              label="XML"
              name="xmlTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.xmlTempName"  style="width: 300px;"/>
              <a-button @click="selectTemp(4)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(4)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>

          <a-form-item
              label="Service"
              name="serviceTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.serviceTempName" style="width: 300px;"/>
              <a-button @click="selectTemp(5)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(5)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>

          <a-form-item
              label="ServiceImpl"
              name="serviceImplTempId"
          >
            <a-space class="file-list-button">
              <a-input v-model:value="formDataForShow.serviceImplTempName" style="width: 300px;"/>
              <a-button @click="selectTemp(6)"><FileListLine/></a-button>
              <a-button @click="showCodeMirrorModal(6)"><EyeOutlined /></a-button>
            </a-space>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 15, span: 6 }">
            <a-space>
              <a-button type="primary" @click="saveToCurrentSelected">保存到当前组</a-button>
              <a-button type="primary" @click="openSaveParam=true">另存为新组</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-layout-content>
    </a-layout>
    <TempRepositoryModal v-model:open="openTempRep" :fileType="fileType" @submit="selectTempCallBack"/>
    <TempGroupCodeMirrorModal v-model:open="openCodeMirrorModal" :fileType="fileType" :formData="formData"/>
    <a-modal centered v-model:open="openSaveParam" @cancel="openSaveParam=false" ok-text="保存" @ok="saveAsNewTempGroup">
      <a-form :model="saveFromData" ref="saveFrom"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              autocomplete="off">
        <a-form-item label="模板组名"
                     name="groupName"
                     :rules="[{ required: true, message: '需要模板组名!',trigger: 'blur' }]"
        >
          <a-input v-model:value="saveFromData.groupName" style="width: 300px;">
            <template #prefix>
              <ViGridSmall />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import TempGroupTree from "@/view/codeGenerate/TempGroupTree.vue";
import FileListLine from "@/assets/file-list-line.svg";
import {reactive, ref, watch} from "vue";
import TempRepositoryModal from "@/view/codeGenerate/TempRepositoryModal.vue";
import {addNewTempGroup, getTempGroupSetting, updateTempGroup} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import { EyeOutlined } from "@ant-design/icons-vue";
import TempGroupCodeMirrorModal from "@/view/codeGenerate/TempGroupCodeMirrorModal.vue";
import {TemplateIds} from "@/view/codeGenerate/codeGenerate";
import ViGridSmall from "@/assets/visualization-grid-small.svg";
import {message} from "ant-design-vue";


const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open',]);

const tempGroupTreeData:any = ref([])
const tempGroupSelectedKeys:any = ref([])
const tempGroupTree = ref()

const openTempRep = ref(false)
const fileType = ref<number>(1)

const openCodeMirrorModal = ref(false)

const formData = reactive<TemplateIds>({
  controllerTempId: '',
  entityTempId: '',
  mapperTempId: '',
  xmlTempId: '',
  serviceTempId: '',
  serviceImplTempId: ''
})

const formDataForShow = reactive({
  controllerTempName: '',
  entityTempName: '',
  mapperTempName: '',
  xmlTempName: '',
  serviceTempName: '',
  serviceImplTempName: ''
})

const openSaveParam = ref(false)
const saveFrom = ref()
const saveFromData = reactive(({
  groupName:''
}))

watch(()=>props.open,async (value)=>{
  if (value){
    await reloadTempGroup("当前设置")
  }
})

function selectTemp(type:number){
  openTempRep.value = true
  fileType.value = type
}
function selectTempCallBack(type:number,file:any){
  switch (type) {
    case 1:
      formData.controllerTempId = file?file.id:'';
      formDataForShow.controllerTempName = file?file.title:''
      break;
    case 2:
      formData.entityTempId = file?file.id:'';
      formDataForShow.entityTempName = file?file.title:''
      break;
    case 3:
      formData.mapperTempId = file?file.id:'';
      formDataForShow.mapperTempName = file?file.title:''
      break;
    case 4:
      formData.xmlTempId = file?file.id:'';
      formDataForShow.xmlTempName = file?file.title:''
      break;
    case 5:
      formData.serviceTempId = file?file.id:'';
      formDataForShow.serviceTempName = file?file.title:''
      break;
    case 6:
      formData.serviceImplTempId = file?file.id:'';
      formDataForShow.serviceImplTempName = file?file.title:''
      break;
  }
}

function showCodeMirrorModal(type:number){
  openCodeMirrorModal.value = true;
  fileType.value = type
}

async function reloadTempGroup(groupName:string){
  const data:any = await getTempGroupSetting({groupName:groupName,username:useGlobalStore().loginUser})
  formData.controllerTempId = data.result.controllerTempId;
  formData.entityTempId = data.result.entityTempId;
  formData.mapperTempId = data.result.mapperTempId;
  formData.xmlTempId = data.result.xmlTempId;
  formData.serviceTempId = data.result.serviceTempId;
  formData.serviceImplTempId = data.result.serviceImplTempId;

  formDataForShow.controllerTempName = data.result.controllerTempName;
  formDataForShow.entityTempName = data.result.entityTempName;
  formDataForShow.mapperTempName = data.result.mapperTempName;
  formDataForShow.xmlTempName = data.result.xmlTempName;
  formDataForShow.serviceTempName = data.result.serviceTempName;
  formDataForShow.serviceImplTempName = data.result.serviceImplTempName;
}

async function saveAsNewTempGroup(){
  saveFrom.value.validate().then(async ()=>{
    const data:any = await addNewTempGroup({...formData,...saveFromData,username:useGlobalStore().loginUser})
    if(data.code == 200){
      message.success("保存成功")
    }
    saveFrom.value.resetFields();
    openSaveParam.value = false
    await tempGroupTree.value.reloadTree()
  })
}

async function saveCurrentSetting(){
  const data:any = await updateTempGroup({id:tempGroupTreeData.value[0].id,...formData})
  if(data.code == 200){
    message.success("保存成功")
  }
}

async function saveToCurrentSelected(){
  const data:any = await updateTempGroup({id:tempGroupSelectedKeys.value[0],...formData})
  if(data.code == 200){
    message.success("保存成功")
  }
}

</script>

<style scoped>
:deep(.file-list-button .ant-btn) {
  padding: 4px 8px;
}
</style>