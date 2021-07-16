import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/tabs/home',
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
				component: () => import('../views/Home.vue'),
			},
			{
				path: 'library',
				component: () => import('../views/Library.vue'),
			},
			{
				path: 'messages',
				component: () => import('../views/Messages.vue'),
			},
			{
				path: 'search',
				component: () => import('../views/Search.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router
