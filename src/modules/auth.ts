import router from '@/router'
import fb, { auth } from './firebase'

interface AuthState {
	uid: null | string
	username: null | string
	email: null | string
}
type UID = null | string

const state = reactive<AuthState>({
	uid: null,
	username: null,
	email: null,
})

auth.onAuthStateChanged(user => {
	if (user) {
		state.uid = user.uid
		state.email = user.email
	} else state.uid = null
})

/*
  GETTERS 
*/
export const uid = computed(() => state.uid)
export const username = computed(() => state.username)
export const email = computed(() => state.email)

export const isLoggedIn = (): boolean => Boolean(auth.currentUser)
export const checkUser = (): Promise<UID> => {
	let unsubscribe: fb.Unsubscribe
	return new Promise(resolve => {
		unsubscribe = auth.onAuthStateChanged(user => {
			user ? resolve(user.uid) : resolve(null)
			unsubscribe()
		})
	})
}

export async function emailSignIn(
	email: string,
	password: string,
	username: string,
): Promise<void | string> {
	try {
		const { user } = await auth.createUserWithEmailAndPassword(
			email,
			password,
		)
		if (!user) return auth.signOut()
		const { uid } = user

		console.log('Logged In:', email, uid)
		state.uid = uid
		state.email = email
		state.username = username
		// TODO: Send new user info (uid + username) to the API
		router.push({ name: 'Home' })
	} catch (error: any) {
		// TODO: Properly handle the error
		console.error(error?.code, error?.message)
		return (error as any)?.message
	}
}

export async function emailLogin(
	email: string,
	password: string,
): Promise<void | string> {
	try {
		const { user } = await auth.signInWithEmailAndPassword(email, password)
		if (!user) return auth.signOut()
		const { uid } = user

		console.log('Logged In:', email, uid)
		state.email = email
		state.uid = uid
		router.push({ name: 'Home' })
	} catch (error: any) {
		// TODO: Properly handle the error
		console.error(error?.code, error?.message)
		return (error as any)?.message
	}
}

export const googleSignIn = async (): Promise<void> => {
	const googleProvider = new fb.auth.GoogleAuthProvider()

	try {
		await auth.signInWithRedirect(googleProvider)
		router.push({ name: 'Home' })
	} catch (error) {
		console.error(error)
	}
}

export async function logOut(): Promise<void> {
	await auth.signOut()
	router.push({ name: 'Hello' })
}
