<template>
  <a-modal :open="props.open" title="修改数据源" @ok="editDataSourceModel" @cancel="cancel" cancelText="取消">
    <a-form
        style="margin-left: -30px"
        ref="form"
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
    >
      <a-form-item
          label="名称"
          name="name"
          :rules="[{ required: true, message: '需要名称!',trigger: 'blur' }]"
      >
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <a-form-item
          label="url"
          name="url"
          :rules="[{ required: true, message: '需要url!',trigger: 'blur' }]"
      >
        <a-input v-model:value="formState.url"/>
      </a-form-item>
      <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '需要用户名!',trigger: 'blur' }]"
      >
        <a-input v-model:value="formState.username"/>
      </a-form-item>
      <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '需要密码',trigger: 'blur' }]"
      >
        <a-input-password v-model:value="formState.password"/>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 19, span: 6 }">
        <a-button type="primary" :loading="testLoading" @click="testConnection">测试连接</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">

import {reactive, ref, watch} from "vue";

import {message} from "ant-design-vue";
import {FormState} from "@/ts/interfaces";
import {editDataSource, testDataSourceConnection} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";


const props = defineProps<{
  open: Boolean;
  formData: FormState;
}>();
const emit = defineEmits(['update:open','reloadDataSourceList']);
const testLoading = ref(false)
const form = ref()
const formState = reactive<FormState>({
  id:'',
  name: '',
  url: '',
  username: '',
  password: '',
  user:''
});
watch(props.formData,(value)=>{
  formState.id = value.id
  formState.name = value.name
  formState.url = value.url
  formState.username = value.username
  formState.password = value.password
})

function testConnection() {
  form.value.validate()
      .then(async () => {
        testLoading.value = true
        var data:any = await testDataSourceConnection(formState);
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

async function editDataSourceModel() {
  if (formState.name != props.formData.name ||
      formState.url != props.formData.url ||
      formState.username != props.formData.username ||
      formState.password != props.formData.password)
  {
    let param :any = formState
    param.oldName = props.formData.name
    param.user=useGlobalStore().loginUser
    await editDataSource(param)
    form.value.resetFields();
    emit('reloadDataSourceList')
  }
  emit('update:open', false)

}

function cancel(){
  emit('update:open', false)
  form.value.resetFields();
}


</script>

<style scoped>

</style>