import { checkUser } from '@/modules/auth'
import router from '.'

window.onload = async () => {
	const isLoggedIn = !!(await checkUser()),
		currentRoute = router.currentRoute.value.name

	if (!isLoggedIn && currentRoute !== 'Hello')
		return router.push({ name: 'Hello' })
	if (isLoggedIn && currentRoute !== 'Home')
		return router.push({ name: 'Home' })
}
