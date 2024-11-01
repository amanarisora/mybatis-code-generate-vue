<template>
  <a-modal :open="props.open" title="模板资源库" @cancel="emit('update:open',false)"
           style="top: 20px; padding: 0; max-height: 100vh; width: 80% ">
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
            <a-button type="primary" :loading="isUploading">
              <UploadOutlined/>
              上传模板
            </a-button>
          </a-upload>
          <a-button type="primary">
            <ReloadOutlined/>
          </a-button>
        </a-space>
      </template>
      <a-layout style="width: 100%;height: 100%">
        <a-layout-sider width="250" style="background: #fff;position: relative;">
          <a-tree
              style="font-size: 15px"
              :tree-data="filePathTree"
              v-model:selectedKeys="filePathSelectedKeys"
              v-model:expandedKeys="filePathExpandKeys"
              @select="selectTree"
              @dblclick="handleDoubleClick"
              class="custom-tree"
              block-node
          >
            <template #title="{ title, key: treeKey,type,data }">
              <a-dropdown :trigger="['contextmenu']">
                <a-space>
                  <FolderTree style="margin-top: 7px"/>
                  <span v-if="!editingKey || editingKey !== treeKey">{{ title }}</span>
                  <a-input ref="editInput" v-else type="text" v-model:value="editTitle" @blur="submitEdit(data)"
                         @keyup.enter="submitEdit(data)"/>
                </a-space>
                <template #overlay>
                  <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey,title,type)">
                    <a-menu-item key="1" :disabled="type == 2" >新建子文件</a-menu-item>
                    <a-menu-item key="2" :disabled="type == -1">重命名</a-menu-item>
                    <a-menu-item key="3" :disabled="type == -1" :style="{color: type==-1?'lightgray':'lightcoral'}">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

            </template>
          </a-tree>
        </a-layout-sider>
        <a-layout-content
            style="padding: 20px 10px 10px 10px;position: relative;height: 100%;width: 100%;overflow: auto">
          <a-list :grid="{ gutter: 2, xs: 1, sm: 2, md: 4, lg: 4, xl: 10, xxl: 10 }" :data-source="data">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <div class="file-item">
                      <a-col>
                        <a-row class="icon-row">
                          <Idea v-if="item.type == '1'"/>
                          <FolderWithFiles v-else-if="item.type == '0'"/>

                        </a-row>
                        <a-row class="text-row">
                          <span>{{ item.title }}</span>
                        </a-row>
                      </a-col>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-layout-content>
      </a-layout>
    </a-card>
  </a-modal>
</template>
<script setup lang="ts">
import {tabKeyToValueMap, tabList} from "@/ts/interfaces";
import {onMounted, ref, h, nextTick} from "vue";
import {deleteFolder, editFolderName, getFolderTree, getTempFileList, uploadTempFile} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import Icon, {ReloadOutlined, UploadOutlined, ExclamationCircleOutlined, FolderOutlined} from "@ant-design/icons-vue";
import {message, Modal} from "ant-design-vue";
import FolderTree from "@/assets/folder_tree.svg"
import Idea from "@/assets/idea.svg"
import FolderWithFiles from "@/assets/folder_with_files.svg"
import Folder from "@/assets/folder.svg"

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open']);
const key = ref('Controller')
const globalStore = useGlobalStore();

const isUploading = ref(false)
const fileList: any = ref()
const realFileList: any = ref([])
const filePathSelectedKeys: any = ref([])
const filePathExpandKeys: any = ref([])
const data = ref([
  {
    type: '0',
    fileName: '测试',
    id: '',
    title: '这是一'
  },
  {
    type: '1',
    fileName: '测试',
    id: '',
    title: '这是一'
  }
])
const filePathTree: any = ref([])

onMounted(async () => {
  await getTempFileList({username: globalStore.loginUser, fileType: tabKeyToValueMap.get(key.value)});
  const folderData: any = await getFolderTree({username: globalStore.loginUser})
  filePathTree.value = folderData.result
})

let count = 0

async function tempUpload(file) {
  const formData = new FormData()
  count = count + 1
  realFileList.value.push(file)
  if (fileList.value.length == count && count > 0) {
    realFileList.value.forEach(f => {
      formData.append("files", f.file)
    })
    const fileType: any = tabKeyToValueMap.get(key.value)
    formData.append('username', globalStore.loginUser)
    formData.append('fileType', fileType)
    isUploading.value = true
    try {
      const data: any = await uploadTempFile(formData)
      if (data.code == 200) {
        message.success("上传成功")
      }
      realFileList.value = []

    } finally {
      isUploading.value = false
    }
  }
}

async function onTabChange(value) {
  key.value = value
  await getTempFileList({username: globalStore.loginUser, fileType: tabKeyToValueMap.get(key.value)});
}

let clickTimeout: number | null = null;

function selectTree(keys, e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  filePathSelectedKeys.value = [e.node.key]
  // 设置一个新的定时器
  clickTimeout = window.setTimeout(() => {
    filePathSelectedKeys.value = [e.node.key]
    console.log(filePathSelectedKeys.value)
  }, 300);

}

function handleDoubleClick(e, node) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log("双击")
  if (!filePathExpandKeys.value.includes(node.key)) {
    filePathExpandKeys.value.push(node.key)
  } else {
    filePathExpandKeys.value = filePathExpandKeys.value.filter(v => v !== node.key)
  }
}


function onContextMenuClick(treeKey, menuKey, title,type) {
  console.log(treeKey)
  console.log(data)
  switch (menuKey) {
    case "1":
      break
    case "2":
      editingKey.value = treeKey;
      editTitle.value = title;
      nextTick(() => {
        if (editInput.value) {
          editInput.value.focus();
        }
      });
      break
    case "3":
      Modal.confirm({
        title: '删除文件夹',
        icon: h(ExclamationCircleOutlined),
        content: '删除文件夹将删除其下所有子文件夹和文件，是否继续?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await deleteFolder({id:treeKey})
          deleteTreeDataNode(treeKey,filePathTree.value)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      break
  }
}

function deleteTreeDataNode(treeKey,treeData){
  if(treeData == undefined){
    return
  }
  let index = -1
  for (let i = 0; i < treeData.length; i++) {
    if(treeData[i].key == treeKey){
      index = i
      break
    }
  }

  if (index !== -1) {
    treeData.splice(index, 1);
  }
  treeData.forEach(item => {
    console.log(item)
    deleteTreeDataNode(treeKey,item.children)
  })
}

const editInput = ref()
const editingKey = ref<string | null>(null);
const editTitle = ref('');

async function submitEdit(data) {
  if (data.title == editTitle.value || editTitle.value == '') {
    editingKey.value = null;
    editTitle.value = '';
    return
  }
  await editFolderName({id: data.key, folderName: editTitle.value})
  data.fileName = editTitle.value
  data.title = editTitle.value
  editingKey.value = null;
  editTitle.value = '';
}

</script>

<style scoped>
:deep(.anticon) {
  transform: translateY(4px);
}
.file-item {
  width: 140px; /* 设置合适的宽度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* 设置图标容器的高度 */
  margin-bottom: 8px; /* 图标和文字之间的间距 */
}

.text-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px; /* 设置文字容器的高度 */
}

.text-row span {
  font-size: 12px;
  display: -webkit-box;
  text-align: center;
  -webkit-line-clamp: 4; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word; /* 允许单词在行尾断开 */
}
</style>