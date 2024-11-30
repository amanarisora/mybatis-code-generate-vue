<template>
  <a-modal :open="props.open" title="模板资源库" @cancel="emit('update:open',false)"
           style="top: 20px; padding: 0; max-height: 100vh; width: 80% " @ok="submit">
    <a-card :tab-list="tabList" :active-tab-key="tabActiveKey" @tabChange="onTabChange"
            :bodyStyle="{ padding: '10px 0 0 0' ,height: 'calc(100vh - 208px)' }"
            style="height: calc(100vh - 150px);overflow: auto;background: rgba(0,0,0,0); ">
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
          <a-button type="primary" @click="reloadChildrenFolderAndFileList(filePathSelectedKeys[0])">
            <ReloadOutlined/>
          </a-button>
        </a-space>
      </template>
      <a-layout style="width: 100%;height: 100%;background-color: rgba(24,24,24,0);">
        <a-layout-header style="background: rgb(0,0,0,0);">
          <a-row>
            <a-button :disabled="backStack.size()==0" type="ghost"
                      style="display: flex;align-items: center;justify-content: center" size="small"
                      @click="historyBack">
              <arrow-left-small :style="{color: backStack.size()==0?'darkgray':'white'}"/>
            </a-button>
            <a-button :disabled="forwardStack.size()==0" @click="historyForward"
                      type="ghost" style="display: flex;align-items: center;justify-content: center" size="small">
              <arrow-right-small :style="{color: forwardStack.size()==0?'darkgray':'white'}"/>
            </a-button>
            <a-button :disabled="filePathSelectedRow.parentId==null" type="ghost"
                      style="display: flex;align-items: center;justify-content: center" size="small"
                      @click="goToParentFolder">
              <arrow-top-small :style="{color: filePathSelectedRow.parentId==null?'darkgray':'white'}"/>
            </a-button>
          </a-row>
        </a-layout-header>


        <a-layout style="width: 100%;height: 100%;background: rgba(0,0,0,0);">
          <a-layout-sider width="250" style="background-color: rgba(24,24,24,0);position: relative;overflow: hidden">
            <a-tree
                style="background-color: rgba(24,24,24,0);font-size: 15px;height: 100%;"
                :tree-data="folderTree"
                v-model:selectedKeys="filePathSelectedKeys"
                v-model:expandedKeys="filePathExpandKeys"
                @select="selectTree"
                @dblclick="handleDoubleClick"
                block-node
            >
              <template #title="{ title, key: treeKey,type,data }">
                <a-dropdown :trigger="['contextmenu']">
                  <div>
                    <a-space>
                      <FolderTree style="margin-top: 7px"/>
                      <CanEditSpan :submit="(editText)=>submitFolderEdit(editText,data)"
                                   :text="title" :is-editing="folderTreeEditingKey == treeKey"/>
                    </a-space>
                  </div>
                  <template #overlay>
                    <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey,data)">
                      <a-menu-item key="addChildrenFolder">新建子文件</a-menu-item>
                      <a-menu-item v-if="data.parentId" key="rename">重命名</a-menu-item>
                      <a-menu-item v-if="data.parentId" key="delete" style="color: lightcoral">
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>

              </template>
            </a-tree>
          </a-layout-sider>
          <a-layout-content
              style="padding: 20px 10px 10px 10px;position: relative;height: 100%;width: 100%;overflow: auto;background-color: rgba(24,24,24,0)"
              @click="cleanFileSelect">
            <a-list ref="list" :grid="{ gutter: 20, xs: 1, sm: 1, md: 1, lg: 2, xl: 4, xxl: xxlNum }"
                    :data-source="fileAndFolderDataList" >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <a-dropdown :trigger="['contextmenu']">
                        <div class="file-item" :style="{ backgroundColor: selectedRowKeys.includes(item.id) ? '#749ec2' : 'inherit',
                        border: selectedRowKeys.includes(item.id) ? '1px solid #1890ff' : '0px solid #e8e8e8',borderRadius: '7px',
                        margin: selectedRowKeys.includes(item.id) ? '-1px':'0'}"
                             @click.stop="clickFileList(item,$event)" @dblclick="dbClickFileList(item)"
                             @contextmenu="fileListRightClick(item)"
                        >
                          <a-col>
                            <a-row class="icon-row">
                              <Idea v-if="item.isFile"/>
                              <Folder v-else-if="item.isEmpty"/>
                              <FolderWithFiles v-else/>
                            </a-row>
                            <a-row class="text-row">
                              <CanEditSpan :submit="(editText)=>submitFileListEdit(editText,item)"
                                           style="width: 100%;height: 100%" :is-text-area="true"
                                           :text="item.title" :is-editing="fileListEditingKey == item.id"/>
                            </a-row>
                          </a-col>
                        </div>
                        <template #overlay>
                          <a-menu @click="({key:menuKey}) => handleFileListMenuClick(menuKey,item)">
                            <a-menu-item key="copy">复制</a-menu-item>
<!--                            <a-menu-item :disabled="copyItems.length == 0" key="paste">粘贴</a-menu-item>-->
                            <a-menu-item v-if="item.isFile" key="download">下载</a-menu-item>
                            <a-menu-item key="rename">重命名</a-menu-item>
                            <a-menu-item key="delete" style="color: lightcoral">
                              删除
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>

                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-card>

    <CodeMirrorModal v-model:open="openCodeMirror" :temp-id="currentTempId"/>

    <a-modal centered v-model:open="openAddChildrenFolder" title="新建文件夹"
             @cancel="openAddChildrenFolder=false" ok-text="新建" @ok="addChildrenFolderSubmit">
      <a-form :model="folderNameFormData" ref="folderNameForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              autocomplete="off">
        <a-form-item label="文件夹名"
                     name="folderName"
                     :rules="[{ required: true, message: '需要文件夹名!',trigger: 'blur' }]"
        >
          <a-input v-model:value="folderNameFormData.folderName" style="width: 300px;">
            <template #prefix>
              <FolderTree/>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>
<script setup lang="ts">
import {tabKeyToValueMap, tabList, ValueToTabKeyMap} from "@/ts/interfaces";
import {
  onMounted,
  ref,
  h,
  nextTick,
  watch,
  reactive,
  getCurrentInstance, onBeforeUnmount
} from "vue";
import {
  addFolder,
  deleteFolder, deleteTempFileBatch, downloadTempFile,
  editFolderName, getAllFolderTree,
  getChildrenFolderAndFileList, pasteFolderAndTempFile, reloadFolderTree, renameTempFile,
  uploadTempFile
} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {ReloadOutlined, UploadOutlined, ExclamationCircleOutlined, ArrowLeftOutlined} from "@ant-design/icons-vue";
import {message, Modal} from "ant-design-vue";
import FolderTree from "@/assets/folder_tree.svg"
import Idea from "@/assets/idea.svg"
import FolderWithFiles from "@/assets/folder_with_files.svg"
import Folder from "@/assets/folder.svg"
import ArrowLeftSmall from "@/assets/arrow-left-small.svg"
import ArrowRightSmall from "@/assets/arrow-right-small.svg"
import ArrowTopSmall from "@/assets/arrow-top-small.svg"
import {FileStack} from "@/view/common/FileStack";
import {historyObj} from "@/view/codeGenerate/codeGenerate";
import {DualIndexMap} from "@/view/common/DualIndexMap";
import CodeMirrorModal from "@/view/codeGenerate/CodeMirrorModal.vue";
import CanEditSpan from "@/view/common/CanEditSpan.vue";
import throttle from "lodash/throttle";

const props = defineProps({open: Boolean, fileType: Number});
const emit = defineEmits(['update:open', 'submit']);
const instance: any = getCurrentInstance();
const tabActiveKey = ref('Controller')
let currentFileType: number = 1
const globalStore = useGlobalStore();

const openCodeMirror = ref(false)

const isUploading = ref(false)
const fileList: any = ref()
const realFileList: any = ref([])

const folderTree: any = ref([])
const filePathSelectedKeys: any = ref([])
const filePathSelectedRow: any = ref({id: null, type: null, parentId: null})
const filePathExpandKeys: any = ref([])
const fileAndFolderDataList: any = ref([])
const fileAndFolderDataMap = new DualIndexMap<string, any>('id', 'parentId')
const list = ref()
const xxlNum = ref(6)

const backStack = reactive(new FileStack<historyObj>(10));
const forwardStack = reactive(new FileStack<historyObj>(10));


const selectedRowKeys: any = ref([])
const selectedRowKeysSet: any = ref(new Set())
const selectedRows: any = ref([])



const currentTempId = ref('')


let listClickTimeOut: number | null = null
let lastItemIndex
function clickFileList(item,event) {
  if (listClickTimeOut) {
    clearTimeout(listClickTimeOut)
  }
  if (selectedRowKeys.value.length > 0 && event.shiftKey) {
    const itemIndex = fileAndFolderDataList.value.findIndex(i=> i.id == item.id);


    const startIndex = Math.min(lastItemIndex, itemIndex);
    const endIndex = Math.max(lastItemIndex, itemIndex);
    cleanFileSelect()
    // 遍历 fileAndFolderDataList 中的元素
    for (let i = startIndex; i <= endIndex; i++) {

      const currentItem = fileAndFolderDataList.value[i];

      // 检查当前项是否已经在 selectedRowKeys 中
      if (!selectedRowKeys.value.includes(currentItem.id)) {
        // 如果不在，添加它
        selectedRowKeys.value.push(currentItem.id);
        selectedRowKeysSet.value.add(currentItem.id);
        selectedRows.value.push(currentItem);
      }
    }
  }else if(event.ctrlKey){
    // 检查 item 是否已经在 selectedRowKeys 中
    const itemIndex = selectedRowKeys.value.indexOf(item.id);

    if (itemIndex === -1) {
      // 如果 item 不在 selectedRowKeys 中，添加它
      selectedRowKeys.value.push(item.id);
      selectedRowKeysSet.value.add(item.id);
      selectedRows.value.push(item);
      lastItemIndex = fileAndFolderDataList.value.findIndex(i=> i.id == item.id)
    } else {
      // 如果 item 已经在 selectedRowKeys 中，移除它
      selectedRowKeys.value.splice(itemIndex, 1);
      selectedRowKeysSet.value.delete(item.id);
      selectedRows.value = selectedRows.value.filter(row => row.id !== item.id);
    }
  }else {
    selectOneFile(item)
    listClickTimeOut = window.setTimeout(() => {
      console.log("单击文件触发")
    }, 300)
  }
}

async function dbClickFileList(item) {
  if (listClickTimeOut) {
    clearTimeout(listClickTimeOut)
  }
  console.log("双击触发")
  console.log("文件", item)
  if (!item.isFile) {
    await reloadChildrenFolderAndFileList(item.id);
    filePathSelectedKeys.value = [item.id]
    filePathExpandKeys.value.push(item.id)
    backStack.push(filePathSelectedRow.value)
    filePathSelectedRow.value = {type: item.type, id: item.id, parentId: item.parentId}
    forwardStack.clear()
  } else {
    currentTempId.value = item.id
    openCodeMirror.value = true
  }
}

function fileListRightClick(item) {
  if (selectedRows.value.length <= 1) {
    selectOneFile(item)
  }
}

const handleFileListMenuClick = throttle((menuKey, item) => {
  onFileListContextMenuClick(menuKey, item);
}, 300);

function onFileListContextMenuClick(menuKey, item) {
  switch (menuKey) {
    case "download":
      downloadTempFile({id: item.id},{responseType: 'blob',
        headers: {
          'Accept': 'text/plain'
        }}).then((response:any) =>{
        const downloadUrl = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = item.title; // 设置下载文件的名称
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl); // 释放 Blob URL
        document.body.removeChild(a); // 移除链接元素
      })
      break
    case "rename":
      fileListEditingKey.value = item.id;
      break
    case "delete":
      Modal.confirm({
        title: item.isFile?'删除模板':'删除文件夹',
        icon: h(ExclamationCircleOutlined),
        content: item.isFile?'是否删除模板':'删除文件夹将删除其下所有子文件夹和文件，是否继续?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let result:any
          console.log(item)

          if (item.isFile){
            result = await deleteTempFileBatch([item.id])
          }else {
            result = await deleteFolder({id: item.id})
          }
          if (result.code == 200) {
            message.success("删除成功")
          }
          await reloadChildrenFolderAndFileList(item.parentId)
        },
        onCancel() {
        },
      });
      break
  }
}

const fileListEditingKey = ref<string | null>(null);

async function submitFileListEdit(editText, data) {
  if (data.title == editText || editText == '') {
    fileListEditingKey.value = null;
    return
  }
  if (data.isFile) {
    await renameTempFile({id: data.id, fileName: editText})
  } else {
    await editFolderName({id: data.id, folderName: editText})
  }
  data.name = editText
  data.title = editText
  fileListEditingKey.value = null;

}

function selectOneFile(item) {
  selectedRowKeys.value = []
  selectedRowKeys.value.push(item.id)
  selectedRows.value = [item]
  selectedRowKeysSet.value = new Set(selectedRowKeys.value)
  lastItemIndex = fileAndFolderDataList.value.findIndex(i=> i.id == item.id)
}

function cleanFileSelect() {
  selectedRowKeys.value = []
  selectedRows.value = []
  selectedRowKeysSet.value.clear()
}

const copyItems: any = ref([])
const copyOldFolderId = ref('')

async function handleHotKey(event){
  if (event.ctrlKey && event.key === 'c'){
    if (selectedRowKeys.value.length == 0) {
      return
    }
    copyItems.value = []
    copyItems.value = selectedRows.value
    copyOldFolderId.value = filePathSelectedKeys.value[0]
    message.success("复制成功")
  }else if (event.ctrlKey && event.key === 'v'){
    if (copyItems.value.length == 0) {
      return;
    }
    let folderIdList:any = []
    let tempFileIdList:any = []
    copyItems.value.forEach((item) => {
      if (item.isFile){
        tempFileIdList.push(item.id)
      }else {
        folderIdList.push(item.id)
      }
    })
    await pasteFolderAndTempFile({oldParentId:copyOldFolderId.value,targetFolderId:filePathSelectedKeys.value[0],folderIdList:folderIdList,tempFileIdList:tempFileIdList})
    message.success("粘贴成功")
    await reloadChildrenFolderAndFileList(filePathSelectedKeys.value[0])
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleHotKey);
});


async function historyBack() {
  const item = backStack.pop()
  if (item) {
    try {
      await reloadChildrenFolderAndFileList(item.id);
      forwardStack.push(filePathSelectedRow.value)
      filePathSelectedKeys.value = [item.id]
      filePathSelectedRow.value = item
    } catch (e) {
      backStack.push(item)
    }
  }
}

async function historyForward() {
  const item = forwardStack.pop()
  if (item) {
    try {
      await reloadChildrenFolderAndFileList(item.id);
      backStack.push(filePathSelectedRow.value)
      filePathSelectedKeys.value = [item.id]
      filePathSelectedRow.value = item
    } catch (e) {
      forwardStack.push(item)
    }
  }
}

async function goToParentFolder() {
  backStack.push(filePathSelectedRow.value)
  await reloadChildrenFolderAndFileList(filePathSelectedRow.value.parentId);
  const parentItem = fileAndFolderDataMap.getById(filePathSelectedRow.value.parentId)
  filePathSelectedRow.value = {id: parentItem.id, type: parentItem.type, parentId: parentItem.parentId}
  filePathSelectedKeys.value = [parentItem.id]
  forwardStack.clear()
}


onMounted(async () => {
  const data: any = await getAllFolderTree({username: globalStore.loginUser})
  folderTree.value = data.result
  folderTree.value.forEach(item => {
    fileAndFolderDataMap.set(item.id, item)
  })
  await reloadChildrenFolderAndFileList('Controller')
  filePathSelectedRow.value = folderTree.value[0]
  filePathExpandKeys.value = [folderTree.value[0].key]
  filePathSelectedKeys.value = [folderTree.value[0].key]

  window.addEventListener('keydown', handleHotKey);
})

//刷新页面文件
async function reloadChildrenFolderAndFileList(parentId?: string) {
  cleanFileSelect()
  const folderAndFileList: any = await getChildrenFolderAndFileList({
    username: globalStore.loginUser,
    parentId: parentId
  })
  const folderList: any = folderAndFileList.result.folderList ? folderAndFileList.result.folderList : []
  const fileList: any = folderAndFileList.result.fileList
  fileAndFolderDataList.value = [...folderList, ...fileList]
  fileAndFolderDataMap.replaceAllBySecIndex(parentId, fileAndFolderDataList.value)
  if (!parentId) {
    folderTree.value = folderList
  } else {
    //保留节点的children
    let tempMap = new Map()
    folderList.forEach(item => {
      tempMap.set(item.id, item)
    })
    fileAndFolderDataMap.getById(parentId).children.forEach(item => {
      let temp = tempMap.get(item.id)
      if (temp) {
        temp.children = item.children
      }
    })
    fileAndFolderDataMap.getById(parentId).children = folderList
  }
  folderTree.value.push({})
  folderTree.value.pop()
}

async function reloadFolderTreeOnly(id: string) {
  const data: any = await reloadFolderTree({id: id, username: globalStore.loginUser})
  const folderList = data.result
  let tempMap = new Map()
  folderList.forEach(item => {
    tempMap.set(item.id, item)
  })
  fileAndFolderDataMap.getById(id).children.forEach(item => {
    let temp = tempMap.get(item.id)
    if (temp) {
      temp.children = item.children
    }
  })
  fileAndFolderDataMap.getById(id).children = folderList
  folderTree.value.push({})
  folderTree.value.pop()
}

let resizeObserver: ResizeObserver | null

watch(() => props.open, async (value) => {
  //等待list加载完成
  await nextTick(()=>{
  })
  if (!value) {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null
    }
  } else {
    if (list.value) {
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          xxlNum.value = Math.floor(entry.contentRect.width / 140)
        }
      });
      resizeObserver.observe(list.value.$el);
    }
    if (props.fileType) {
      const typeStr = ValueToTabKeyMap.get(props.fileType)
      if (typeStr) {
        await onTabChange(typeStr)
      } else {
        message.warn('参数异常,参数为：', props.fileType)
      }


    }
  }
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
    formData.append('username', globalStore.loginUser)
    formData.append('fileType', filePathSelectedRow.value.type)
    formData.append('folderId', filePathSelectedRow.value.id)
    isUploading.value = true
    try {
      const data: any = await uploadTempFile(formData)
      if (data.code == 200) {
        message.success("上传成功")
      }
      await reloadChildrenFolderAndFileList(filePathSelectedRow.value.id)
      data.result.forEach(id => {
        selectedRows.value.push(fileAndFolderDataMap.getById(id))
      })
      selectedRowKeysSet.value = new Set(selectedRowKeys.value)
      selectedRowKeys.value = data.result
    } finally {
      realFileList.value = []
      isUploading.value = false
    }
  }
}

async function onTabChange(value: string) {
  tabActiveKey.value = value
  const type = tabKeyToValueMap.get(value)
  if (type) {
    currentFileType = type
    await reloadChildrenFolderAndFileList(value);
    const index = type - 1
    filePathSelectedRow.value = folderTree.value[index]
    filePathExpandKeys.value = [folderTree.value[index].key]
    filePathSelectedKeys.value = [folderTree.value[index].key]
  }

}

let clickTimeout: number | null = null;

function selectTree(keys, e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  filePathSelectedKeys.value = [e.node.key]
  // 设置一个新的定时器
  clickTimeout = window.setTimeout(async () => {
    const id = e.node.type == -1 ? '' : e.node.key
    if (filePathSelectedRow.value.id != id || filePathSelectedRow.value.type != e.node.type) {
      backStack.push(filePathSelectedRow.value)
      forwardStack.clear()
    }
    filePathSelectedRow.value = {id: id, type: e.node.type, parentId: e.node.parentId}
    await reloadChildrenFolderAndFileList(e.node.id);
  }, 300);

}

async function handleDoubleClick(e, node) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }
  console.log("双击")
  const id = node.type == -1 ? '' : node.key
  if (filePathSelectedRow.value.id != id || filePathSelectedRow.value.type != node.type) {
    backStack.push(filePathSelectedRow.value)
    forwardStack.clear()
  }
  filePathSelectedRow.value = {id: id, type: node.type, parentId: node.parentId}
  await reloadChildrenFolderAndFileList(node.id);
  if (!filePathExpandKeys.value.includes(node.key)) {
    filePathExpandKeys.value = [...filePathExpandKeys.value, node.key]
  } else {
    filePathExpandKeys.value = filePathExpandKeys.value.filter(v => v !== node.key)
  }
}

//region 文件树右键菜单
function onContextMenuClick(treeKey, menuKey, data) {
  switch (menuKey) {
    case "addChildrenFolder":
      openAddChildrenFolder.value = true
      currentFolder = data
      break
    case "rename":
      folderTreeEditingKey.value = treeKey;
      break
    case "delete":
      Modal.confirm({
        title: '删除文件夹',
        icon: h(ExclamationCircleOutlined),
        content: '删除文件夹将删除其下所有子文件夹和文件，是否继续?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result: any = await deleteFolder({id: treeKey})
          if (result.code == 200) {
            message.success("删除成功")
          }
          if (data.parentId != filePathSelectedKeys.value[0]) {
            if (data.id == filePathSelectedKeys.value[0]) {
              selectTree(null, fileAndFolderDataMap.getById(data.parentId))
            } else {
              await reloadFolderTreeOnly(data.parentId)
            }
          } else {
            await reloadChildrenFolderAndFileList(data.parentId)
          }
        },
        onCancel() {
        },
      });
      break
  }
}

const openAddChildrenFolder = ref(false)
const folderNameForm = ref()
const folderNameFormData = reactive({
  folderName: ''
})
let currentFolder: any

function addChildrenFolderSubmit() {
  folderNameForm.value.validate().then(async () => {
    const data: any = await addFolder({
      ...folderNameFormData,
      parentId: currentFolder.id,
      type: currentFolder.type,
      username: globalStore.loginUser
    })
    if (data.code == 200) {
      message.success("新建成功")
    }
    if (currentFolder.id != filePathSelectedKeys.value[0]) {
      await reloadFolderTreeOnly(currentFolder.id)
    } else {
      await reloadChildrenFolderAndFileList(currentFolder.id)
    }
    folderNameForm.value.resetFields()
    openAddChildrenFolder.value = false
  })
}

const folderTreeEditingKey = ref<string | null>(null);

async function submitFolderEdit(editText, data) {
  if (data.title == editText || editText == '') {
    folderTreeEditingKey.value = null;
    return
  }
  await editFolderName({id: data.id, folderName: editText})
  if (data.parentId == filePathSelectedKeys.value[0]) {
    await reloadChildrenFolderAndFileList(data.parentId)
  }
  data.fileName = editText
  data.title = editText
  folderTreeEditingKey.value = null;
}

//endregion


function submit() {
  const hasSubmitListener = instance.vnode.props && instance.vnode.props.onSubmit;
  if (hasSubmitListener && props.fileType) {
    if (selectedRows.value.length > 1) {
      return message.warn("请选择单个模板")
    }
    if (selectedRows.value.length == 1 && selectedRows.value[0].type != props.fileType) {
      return message.warn(`请选择一个${ValueToTabKeyMap.get(props.fileType)}模板`)

    }
    console.log("选择的文件", selectedRows.value)
    emit("submit", props.fileType, selectedRows.value[0])
    emit('update:open', false)
  } else {
    emit('update:open', false)
  }
}


</script>

<style scoped>
:deep(.anticon) {
  transform: translateY(4px);
}

.file-item {
  width: 120px; /* 设置合适的宽度 */
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
  height: 60px; /* 设置文字容器的高度 */
}

.text-row span {
  font-size: 12px;
  display: -webkit-box;
  text-align: center;
  -webkit-line-clamp: 3; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word; /* 允许单词在行尾断开 */
}

:deep(.splitpanes__splitter) {
  background-color: black; /* 分隔条的颜色 */
  min-width: 5px !important; /* 分隔条的宽度 */

}
</style>