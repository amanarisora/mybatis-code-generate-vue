<template>
  <a-modal :open="props.open" title="模板资源库" @cancel="emit('update:open',false)" style="top: 20px; padding: 0; max-height: 100vh; width: 80% ">
    <a-card :tab-list="tabList" :active-tab-key="key" @tabChange="onTabChange" :bodyStyle="{ padding: '10px 0 0 0' }"
            style="height: calc(100vh - 150px);overflow: auto; ">
      <template #tabBarExtraContent>
        <a-space>
          <a-upload
              v-model:file-list="fileList"
              accept=".ftl"
              name="file"
              :multiple="true"
              :customRequest="tempUpload"
              :showUploadList="false"
          >
            <a-button type="primary" :loading="isUploading"><UploadOutlined/>上传模板</a-button>
          </a-upload>
          <a-button type="primary"><ReloadOutlined/></a-button>
        </a-space>
      </template>
      <a-layout style="width: 100%;height: 100%">
        <a-layout-sider width="250" style="background: #fff;position: relative;">
          <a-tree
              style="font-size: 15px"
              :tree-data="filePathTree"
              v-model:selectedKeys="filePathSelectedKeys"
              v-model:expandedKeys="filePathExpandKeys"
              @select="()=>{}"
              block-node
          >
            <template #title="{ title, key }">
              <template v-if="title==='/'">
                <FolderOpenOutlined/>
                {{ title }}
              </template>
              <template v-else>
                <a-row>
                  <a-col :span="12">
                    <FolderOutlined/>
                    {{ title }}
                  </a-col>
                </a-row>
              </template>
            </template>
          </a-tree>
        </a-layout-sider>
        <a-layout-content style="padding: 20px 10px 10px 10px;position: relative;height: 100%;width: 100%;overflow: auto">

        </a-layout-content>
      </a-layout>
    </a-card>
  </a-modal>
</template>
<script setup lang="ts">
import {tabKeyToValueMap, tabList} from "@/ts/interfaces";
import {onMounted, ref} from "vue";
import {getFolderTree, getTempFileList, uploadTempFile} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {ReloadOutlined,UploadOutlined,FolderOpenOutlined,FolderOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open']);
const key = ref('Controller')
const globalStore = useGlobalStore();

const isUploading = ref(false)
const fileList :any = ref()
const realFileList :any = ref([])

const filePathSelectedKeys = ref([])
const filePathExpandKeys = ref([])
const data = ref([
  {
    type:'1',
    fileName:'测试',
    id:''
  }
])
const filePathTree:any = ref([])

onMounted(async ()=>{
  await getTempFileList({username: globalStore.loginUser,fileType: tabKeyToValueMap.get(key.value)});
  const folderData:any = await getFolderTree({username: globalStore.loginUser})
  filePathTree.value = folderData.result
})

let count = 0
async function tempUpload(file){
  const formData = new FormData()
  count = count+1
  realFileList.value.push(file)
  if (fileList.value.length == count && count>0){
    realFileList.value.forEach(f=>{
      formData.append("files",f.file)
    })
    const fileType:any = tabKeyToValueMap.get(key.value)
    formData.append('username',globalStore.loginUser)
    formData.append('fileType',fileType)
    isUploading.value = true
    try {
      const data:any = await uploadTempFile(formData)
      if(data.code == 200){
        message.success("上传成功")
      }
      realFileList.value = []

    }finally {
      isUploading.value = false
    }
  }
}

async function onTabChange(value) {
  key.value = value
  await getTempFileList({username: globalStore.loginUser,fileType: tabKeyToValueMap.get(key.value)});
}

</script>

<style scoped>

</style>