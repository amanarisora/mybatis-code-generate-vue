import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router/router";
import 'ant-design-vue/dist/reset.css';
import antd from 'ant-design-vue'
import '@/css/CommonCss.css'
import {createPinia} from "pinia";


createApp(App).use(createPinia()).use(antd).use(router).mount('#app')

