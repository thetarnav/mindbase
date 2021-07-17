import { NavigationGuardWithThis } from 'vue-router'
import { checkUser, isLoggedIn } from '@/modules/auth'

const guard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
	// const toHelloPage = to.matched.some(route => route.name === 'Hello')
	const toHelloPage = ['Login', 'SignUp', 'Hello'].includes(to.name as any),
		isUser = isLoggedIn() || (await checkUser())

	!toHelloPage && !isUser ? next({ name: 'Hello' }) : next()
}

export default guard
