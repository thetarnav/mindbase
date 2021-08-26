type OmitNullable<T> = T extends Record<string, any>
	? { [P in keyof T]: NonNullable<T[P]> }
	: T
