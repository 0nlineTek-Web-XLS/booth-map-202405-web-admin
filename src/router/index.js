import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/index.vue"
import CRUD from "@/views/crud.vue"
import CR from "@/views/cr.vue"

const routes = [
    { 
        path: '/',
        component: Home
    },
    { 
        path: '/crud', 
        component: CRUD
    },
    { 
        path: '/cr', 
        component: CR
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router