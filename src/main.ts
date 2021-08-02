import '@/services/firebase'

// Global Composition API imports
import 'vue-global-api/ref'
import 'vue-global-api/reactive'
import 'vue-global-api/computed'
import 'vue-global-api/watch'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/router/pageLoadRedirect'

import { IonicVue } from '@ionic/vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import Vue3TouchEvents from 'vue3-touch-events'
import VueClickAway from 'vue3-click-away'
import CollapseTransition from '@/components/CollapseTransition.vue'
import Contenteditable from 'vue-contenteditable'

// import './modules/serviceWorker'

// /* Tailwind */
import './styles/tailwind.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
// import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Theme variables */
import './styles/variables.css'

import './styles/main.css'

const app = createApp(App)
	.use(IonicVue)
	.use(router)
	.use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_KEY })
	.use(Vue3TouchEvents)
	.use(VueClickAway)
	.component('CollapseTransition', CollapseTransition)
	.component('Contenteditable', Contenteditable)

router.isReady().then(() => {
	app.mount('#app')
})
