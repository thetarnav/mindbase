import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import Tabs from '../views/Tabs.vue'
import authGuard from './authGuard'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/tabs/home',
	},
	{
		path: '/hello',
		name: 'Hello',
		component: () => import('../views/auth/Hello.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/auth/Login.vue'),
	},
	{
		path: '/sign-up',
		name: 'SignUp',
		component: () => import('../views/auth/SignUp.vue'),
	},
	{
		path: '/tabs/',
		component: Tabs,
		children: [
			{
				path: '',
				redirect: '/tabs/home',
			},
			{
				path: 'home',
				name: 'Home',
				component: () => import('../views/Home.vue'),
			},
			{
				path: 'library',
				name: 'Library',
				component: () => import('../views/Library.vue'),
			},
			{
				path: 'messages',
				name: 'Messages',
				component: () => import('../views/Messages.vue'),
			},
			{
				path: 'search',
				name: 'Search',
				component: () => import('../views/Search.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

router.beforeEach(authGuard)

export default router
