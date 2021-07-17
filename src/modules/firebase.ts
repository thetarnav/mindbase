import firebase from 'firebase/app'
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'
import 'firebase/auth'

const config = {
	apiKey: import.meta.env.VITE_FB_API_KEY,
	authDomain: 'mindbase-b72ed.firebaseapp.com',
	projectId: 'mindbase-b72ed',
	storageBucket: 'mindbase-b72ed.appspot.com',
	messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
	appId: import.meta.env.VITE_FB_APP_ID,
	measurementId: import.meta.env.VITE_FB_MEAS_ID,
}

firebase.initializeApp(config)

export const auth = firebase.auth()

export default firebase
