import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import dashboardVue from '../views/dashboard.vue'
import Home from "../layout/index.vue";
const routes = [
    {
        path: '/',
        redirect: '/fir'
    },
    {
        path: "/",
        name: "home",
        component: Home,
        children:[
            {
                path: "/fir",
                name: "fir",
                meta: {
                    title: "系统首页"
                },
                component: () => import("../view/Fir.vue")
            },
            {
                path: "/usermsg",
                name: "usermsg",
                meta: {
                    title: "消息中心"
                },
                component: () => import("../view/Usermsg.vue")
            },
            {
                path: "/user",
                name: "user",
                meta: {
                    title: "个人中心"
                },
                component: () => import("../view/User.vue")
            },
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Dashboard.vue")
            },
            {
                path: "/cluster",
                name: "cluster",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Cluster.vue")
            },
            {
                path: "/paint",
                name: "paint",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Paint.vue")
            },
            {
                path: "/fence",
                name: "fence",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Fence.vue")
            },
            {
                path: "/transform",
                name: "transform",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Transform.vue")
            },
            {
                path: "/mychart",
                name: "mychart",
                meta: {
                    title: "地图"
                },
                component: () => import("../view/Mychart.vue")
            },
        ]
    }, 
    {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ("../view/Login.vue")
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router


