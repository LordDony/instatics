import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Seguidores from './views/Seguidores.vue';
import Siguiendo from './views/Siguiendo.vue';
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import Fotos from './views/Fotos.vue';
import Dashboard from './views/Dashboard.vue';
import firebase from 'firebase';

Vue.use(Router);


const router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/login'
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/fotos',
            name: 'Fotos',
            component: Fotos,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/seguidores',
            name: 'Seguidores',
            component: Seguidores,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/siguiendo',
            name: 'Siguiendo',
            component: Siguiendo,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('login');
    else if (!requiresAuth && currentUser) next('home');
    else next();
});

export default router;