import { createRouter, createWebHistory } from 'vue-router';
import index from "@/components/index.vue";
import Login from "@/components/Login.vue";
import {useGlobalStore} from "@/store/globalStore";


const routes = [
    { path: '/app/', component: index },
    { path: '/app/login', component: Login}
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to,from,next)=>{
    const globalStore = useGlobalStore();
    if(to.path=='/app/login'){
        if (globalStore.loginUser === ''){
            return next();
        }else {
            next('/app/')
        }
    }
    if(to.path=='/register') return next();
    if(globalStore.loginUser === '') return next('/app/login')

    next()
})
