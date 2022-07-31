import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import mySkills from './components/mySkills.vue';
import Login from './components/Login.vue';
import store from "./store";
import register from "./components/Register.vue";
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
    },{
        path: '/login',
        name: 'login',
        component: Login
    },{
        path: '/mySkills',
        name: 'mySkills',
        component: mySkills,
    },{
        path: '/register',
        name: 'register',
        component: register,
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/login',"/register"];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.state.loggedIn;

    if (!authRequired) {
        next()
    } else if (authRequired && !loggedIn) {
        next('/login');
    }else{
        next()
    }

});


export default router;
