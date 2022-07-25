import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import mySkills from './components/mySkills.vue';
import curriculum from './components/curriculum.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
    },{
        path: '/mySkills',
        name: 'mySkills',
        component: mySkills,
    },{
        path: '/curriculum',
        name: 'curriculum',
        component: curriculum,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })



export default router;
