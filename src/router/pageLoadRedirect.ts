import { checkUser } from '@/modules/auth'
import router from '.'

window.onload = async () => {
	const isLoggedIn = !!(await checkUser()),
		currentRoute = router.currentRoute.value.name,
		inHelloPage = ['Login', 'SignUp', 'Hello', undefined].includes(
			currentRoute as any,
		)

	if (!isLoggedIn && !inHelloPage) return router.push({ name: 'Hello' })
	if (isLoggedIn && inHelloPage) return router.push({ name: 'Home' })
}
