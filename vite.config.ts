import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import path from 'path'

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
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '/src'),
		},
	},
})
