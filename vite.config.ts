import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		ViteComponents({
			globalComponentsDeclaration: true,
			customComponentResolvers: [
				name => {
					if (name.startsWith('Ion'))
						return { importName: name, path: '@ionic/vue' }
				},
			],
		}),
		// VitePWA({
		// 	manifest: {
		// 		name: 'Mindbase',
		// 		short_name: 'Mindbase',
		// 		icons: [
		// 			{
		// 				src: '/android-chrome-192x192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: '/android-chrome-256x256.png',
		// 				sizes: '256x256',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: '/splash.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'any maskable',
		// 			},
		// 		],
		// 		theme_color: '#f2f2f2',
		// 		background_color: '#f2f2f2',
		// 		start_url: 'https://mindbase.vercel.app/',
		// 		display: 'standalone',
		// 	},
		// 	workbox: {
		// 		// workbox options for generateSW
		// 	},
		// }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '/src'),
		},
	},
})
