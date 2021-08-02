export function random(
	min: number,
	max: number,
	math?: 'floor' | 'round' | 'ceil',
): number {
	const result = Math.random() * (max - min) + min
	if (math) {
		// eslint-disable-next-line default-case
		switch (math) {
			case 'floor':
				return Math.floor(result)
			case 'round':
				return Math.round(result)
			case 'ceil':
				return Math.ceil(result)
		}
	}
	return result
}

export const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max)

export const flipVal = (val: number, min: number, max: number): number =>
	Math.abs(val * (Math.sign(val) || 1) - max) + min

export function valToP(value: number, min: number, max: number): number {
	if (min > max) {
		;[min, max] = [max, min]
		value = flipVal(value, min, max)
	}
	return (value - min) / (max - min)
}

export function getRandom<T>(iterable: Array<T>): T
export function getRandom(iterable: string): string
export function getRandom(iterable: any[] | string): any {
	return iterable[random(0, iterable.length, 'floor')]
}

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
