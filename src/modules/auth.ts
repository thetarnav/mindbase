import router from '@/router'
import fb, { auth } from '../services/firebase'
import LS from './localStorage'

{
	// Reset login attempts count if 30 min have passed
	const lastLoginAttempt = Number(LS.get('lastLoginAttempt')) || 0
	if (lastLoginAttempt < Date.now() - 30 * 60 * 100) LS.set('loginAttempts', 0)
}

interface AuthState {
	uid: null | string
	username: null | string
	email: null | string
	loginBlockTimestamp: number | undefined
	loginAttempts: number
}
type UID = null | string

const state = reactive<AuthState>({
	uid: null,
	username: null,
	email: null,
	loginBlockTimestamp: Number(LS.get('loginBlockTimestamp')) || undefined,
	loginAttempts: Number(LS.get('loginAttempts')) || 0,
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

export const isLoggedIn = (): boolean => !!auth.currentUser
export const checkUser = (): Promise<UID> => {
	let unsubscribe: fb.Unsubscribe
	return new Promise(resolve => {
		unsubscribe = auth.onAuthStateChanged(user => {
			user ? resolve(user.uid) : resolve(null)
			unsubscribe()
		})
	})
}

/**
 * Authentication Methods
 */
export async function emailSignIn(
	email: string,
	password: string,
	username: string,
): Promise<void | string> {
	email = email.toLowerCase()
	try {
		const { user } = await auth.createUserWithEmailAndPassword(
			email,
			password,
		)
		if (!user) return auth.signOut()
		const { uid } = user

		console.log('Logged In:', user)
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

const checkLoginLimit = (): boolean => {
	LS.set('lastLoginAttempt', Date.now())
	LS.set('loginAttempts', state.loginAttempts++)

	if (state.loginAttempts > 5) {
		state.loginBlockTimestamp = Date.now()
		LS.set('loginBlockTimestamp', state.loginBlockTimestamp)
	}
	// Prevent login attempt if in 15 min of the last Tieout
	if (
		state.loginBlockTimestamp === undefined ||
		state.loginBlockTimestamp < Date.now() - 15 * 60 * 100
	)
		return true
	return false
}

export async function emailLogin(
	email: string,
	password: string,
): Promise<void | string> {
	if (!checkLoginLimit())
		return "You've made too many login attempts, please come back later."

	email = email.toLowerCase()
	try {
		const { user } = await auth.signInWithEmailAndPassword(email, password)
		if (!user) return auth.signOut()
		const { uid } = user

		// Reset login attempts count on successful login
		LS.set('loginAttempts', 0)

		console.log('Logged In:', user)
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
