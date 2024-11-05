import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router/router";
import 'ant-design-vue/dist/reset.css';
import antd from 'ant-design-vue'
import '@/css/CommonCss.css'
import {createPinia} from "pinia";
import Terminal from 'vue-web-terminal'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'



const app = createApp(App)
app.use(createPinia()).use(antd).use(router).use(Terminal).component('Splitpanes', Splitpanes).component('Pane', Pane)

app.mount('#app')

