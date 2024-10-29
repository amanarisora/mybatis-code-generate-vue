<template>
  <a-modal :open="props.open" title="注册" @ok="signUpSubmit" @cancel="cancel" cancelText="取消"
           centered
           :maskStyle="{'opacity':'0.2','background':'#00FFFF','animation':'none'}"
           style="width: 350px">
    <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 15 }"
        :model="loginForm"
        style="margin-left: 20px"
        autocomplete="off"

    >
      <a-form-item
          label="用户名" name="username"
          :rules="[{required: true, message: '需要用户名!',trigger: 'blur'}]"
      >
        <a-input v-model:value="loginForm.username" placeholder="用户名" />
      </a-form-item>
      <a-form-item
          label="密码" name="password"
          :rules="[{required: true, message: '需要密码!!',trigger: 'blur'}]"
      >
        <a-input-password
            v-model:value="loginForm.password"
            placeholder="密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {signUp} from "@/Api";

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open']);
const form = ref()


const loginForm = reactive({
  username: '',
  password: ''
});

async function signUpSubmit() {
  try {
    await signUp(loginForm)
    emit('update:open', false)
  }catch (e){
    console.log(e)
  }

}

function cancel(){
  emit('update:open', false)
  form.value.resetFields();
}



</script>

<style scoped>

</style>