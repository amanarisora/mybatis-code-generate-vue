<template>
  <a-modal :open="props.open" title="新增数据源连接" @cancel="cancel"
           style="width: 1000px;">
    <template #footer>
      <a-button @click="cancel">取消</a-button>
      <a-button v-show="currentStep>0" @click="currentStep -= 1">上一步</a-button>
      <a-button :disabled="datasourceType == null" type="primary" @click="submit">{{ currentStep == 0 ? '下一步' : '确定' }}</a-button>

    </template>
    <a-layout style="width: 100%;height: 100%">
      <a-layout-sider width="200" style="background: #fff;position: relative;border-right: 1px solid #e8e8e8;">
        <a-steps
            direction="vertical"
            :current="currentStep"
            :items="stepItems"
        ></a-steps>
      </a-layout-sider>
      <a-layout-content
          style="padding: 10px 10px 10px 10px;position: relative;height: 500px;width: 100%;overflow: auto;
          background-color: white"
      >
        <a-list v-show="currentStep==0" :grid="{ gutter: 2, column: 4 }" :data-source="DatasourceTypeListItems">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <div
                      class="file-item"
                      :style="{ backgroundColor: datasourceType == item.type ? '#b7deff' : 'white',
                       border: datasourceType === item.type ? '1px solid #1890ff' : '0px solid #e8e8e8',
                       borderRadius: '7px'}"
                      @click="()=>{datasourceType = item.type}"
                  >
                    <a-col>
                      <a-row class="icon-row">
                        <MySqlOn class="mysql-icon" v-if="item.type == '0'"/>
                        <SqliteOn v-else-if="item.type == 1"/>
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
        <div v-show="currentStep==1" style="display: flex; justify-content: center; height: 100%;">
          <a-col>
            <a-row class="icon-form">
              <Vite style="transform: scale(0.6)"/>
              <div class="divider"></div> <!-- 添加分隔线 -->
              <my-sql-on class="mysql-icon" style="transform: scale(0.6);" v-if=" datasourceType == 0"/>
              <SqliteForm style="transform: scale(0.6);" v-else-if="datasourceType == 1"/>
            </a-row>

            <a-form v-show="currentStep==1" ref="form"
                    :model="formData"
                    name="basic"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                    autocomplete="off"
            >
              <a-form-item
                  label="连接名"
                  name="datasourceName"
                  :rules="[{ required: true, message: '需要连接名!',trigger: 'blur' }]"
              >
                <a-input v-model:value="formData.datasourceName" style="width: 300px;"/>
              </a-form-item>
              <a-form-item
                  label="主机"
                  name="ip"
                  :rules="[{ required: true, message: '需要主机!',trigger: 'blur' }]"
              >
                <a-input v-model:value="formData.ip" style="width: 300px;"/>
              </a-form-item>
              <a-form-item
                  label="端口"
                  name="port"
                  :rules="[{ required: true, message: '需要端口!',trigger: 'blur' }]"
              >
                <a-input-number v-model:value="formData.port" :controls="false" style="width: 100px;"/>
              </a-form-item>
              <a-form-item
                  label="用户名"
                  name="username"
                  :rules="[{ required: true, message: '需要用户名!',trigger: 'blur' }]"
              >
                <a-input v-model:value="formData.username" style="width: 300px;"/>
              </a-form-item>
              <a-form-item
                  label="密码"
                  name="password"
                  :rules="[{ required: true, message: '需要密码!',trigger: 'blur' }]"
              >
                <a-input-password v-model:value="formData.password" style="width: 300px;"/>
              </a-form-item>
              <a-form-item :wrapper-col="{ offset: 19, span: 6 }">
                <a-button type="primary" :loading="testLoading" @click="testConnection">测试连接</a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </div>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup lang="ts">
import {DatasourceTypeListItems, stepItems} from "@/view/leftTree/leftTree";
import {reactive, ref} from "vue";
import MySqlOn from "@/assets/mysql-on.svg"
import SqliteOn from "@/assets/sqlite-on.svg"
import SqliteForm from "@/assets/sqlite-form.svg"
import Vite from "@/assets/vite.svg"
import {addDataSource, testDataSourceConnection} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {message} from "ant-design-vue";

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open','reloadDataSourceList']);
const datasourceType = ref(null)
const testLoading = ref(false)
const form = ref()

const currentStep = ref(0)

const initialFormData = {
  datasourceName: '',
  ip: '',
  port: '',
  username: '',
  password: '',
}
const formData = reactive({...initialFormData})

function testConnection() {
  form.value.validate()
      .then(async () => {
        testLoading.value = true
        var data:any = await testDataSourceConnection({...formData,datasourceType:datasourceType.value});
        testLoading.value = false
        if (data.result){
          message.info("连接成功")
        }else {
          message.error("连接失败")
        }

      })
      .catch(error => {
        console.log('error', error);
      });

}

async function submit() {
  if (currentStep.value == 0) {
    if(datasourceType.value != null){
      currentStep.value += 1
    }
    return
  }
  const data:any = await addDataSource({
    ...formData,datasourceType:datasourceType.value,user:useGlobalStore().loginUser
  })
  if (data.code ==200){
    message.success("新增数据源成功")
  }
  emit("reloadDataSourceList")
  emit('update:open',false)

}

function cancel(){
  currentStep.value = 0
  datasourceType.value = null
  Object.assign(formData, initialFormData);
  emit('update:open',false)

}
</script>

<style scoped>
.file-item {
  width: 140px; /* 设置合适的宽度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-row {
  display: flex;
  padding: 10px; /* 添加10px的空白 */
  justify-content: center;
  align-items: center;
  height: 100px; /* 设置图标容器的高度 */
}

.text-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* 设置文字容器的高度 */
}

.text-row span {
  font-size: 18px;
  display: -webkit-box;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-form {
  display: flex;
  align-items: center;
}

.divider {
  flex-grow: 1; /* 使线条占据可用空间 */
  height: 3px; /* 设置线的高度 */
  background-color: gray;
  margin: 0 10px; /* 设置线与图标之间的间距 */
}
</style>