export const isElementFocused = (element: Element | string | null): boolean => {
	const el: Element | null =
		typeof element === 'string' ? document.querySelector(element) : element
	if (!el) return false
	return document.activeElement === el
}
