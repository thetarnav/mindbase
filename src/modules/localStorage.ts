export interface LocalStorageValues {
	loginBlockTimestamp: number | undefined
	lastLoginAttempt: number
	loginAttempts: number
}

class TypedLocalStorage {
	get<K extends keyof LocalStorageValues>(key: K): string | undefined {
		return localStorage.getItem(key) ?? undefined
	}

	set<K extends keyof LocalStorageValues, V extends LocalStorageValues[K]>(
		key: K,
		value: V,
	): void {
		localStorage.setItem(key, String(value))
	}
}

const LocalStorage = new TypedLocalStorage()
export default LocalStorage
