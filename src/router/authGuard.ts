import { NavigationGuardWithThis } from 'vue-router'
import router from '.'

const isLoggedIn = ref(false)

export const login = (): void => {
	isLoggedIn.value = true
	router.push({ name: 'Home' })
}

const guard: NavigationGuardWithThis<undefined> = (to, from, next) => {
	// const toHelloPage = to.matched.some(route => route.name === 'Hello')
	const toHelloPage = ['Login', 'SignUp', 'Hello'].includes(to.name as any)

	if (!toHelloPage && !isLoggedIn.value) next({ name: 'Hello' })
	else next()
}

export default guard
