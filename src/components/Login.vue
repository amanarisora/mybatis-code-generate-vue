<template>
  <a-config-provider
      :theme="{
      algorithm: theme.defaultAlgorithm
    }">
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <!--        <img src="/path/to/logo.png" alt="Logo" class="logo">-->
          <h1>欢迎登录</h1>
        </div>
        <a-form
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 20 }"
            autocomplete="off"
        >
          <a-form-item
              label="用户名" name="username"
              :rules="[{validator: check,trigger: 'blur'}]"
          >
            <a-input v-model:value="loginForm.username" placeholder="用户名" />
          </a-form-item>
          <a-form-item
              label="密码" name="password"
              :rules="[{validator: check,trigger: 'blur'}]"
          >
            <a-input-password
                v-model:value="loginForm.password"
                placeholder="密码"
            />
          </a-form-item>
        </a-form>
        <a-button style="left: 10%" @click="openSignUpModel">
          注册
        </a-button>
        <a-button type="primary" style="left: 40%" @click="loginSubmit">
          登录
        </a-button>
      </div>
    </div>
    <SignUpModel v-model:open="open"></SignUpModel>
  </a-config-provider>

</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {Rule} from "ant-design-vue/es/form";
import {login} from "@/Api";
import {router} from "@/router/router";
import {message, theme} from "ant-design-vue";
import {useGlobalStore} from "@/store/globalStore";
import SignUpModel from "@/components/SignUpModal.vue";

const open = ref<boolean>(false)

function openSignUpModel(){
  open.value = true
}

const loginForm = reactive({
  username: '',
  password: ''
});
const globalStore = useGlobalStore();

const check = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入用户名或密码!');
  }
};

async function loginSubmit() {
  await login({username:loginForm.username,password:loginForm.password})
  message.success('登录成功！')
  globalStore.setUser(loginForm.username)
  console.log(globalStore.loginUser)
  await router.push('/app/')
}
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/back.png');
  background-size: cover;
  background-position: center;
}

.login-content {
  width: 300px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: auto;
}
</style>