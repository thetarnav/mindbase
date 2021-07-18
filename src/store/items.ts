interface ItemHead {
	id: string
	title: string
	thumbnail: string
}

const randomID = () => Number.parseInt(Math.random() * 1000000 + '').toString(),
	randomSize = () => 350 + Number.parseInt(Math.random() * 10 + '') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`,
	makeItem = (title: string) => ({
		id: randomID(),
		title: title,
		thumbnail: randomImg(),
	})

const items = ref<ItemHead[]>([])

;[
	'13 Reasons Why',
	'Random search term',
	'What the dog doin',
	'Vue3 + Ionic + Typescript + TailwindCSS',
	'Cookies are stored on the server',
	'Every user needs an account',
	'Każdy pies jechał koleją',
	'About how Items came to make a Shape',
	'Remember You are Item and to Shape You Shall Return',
	'This is extremely useful',
	'CSS Shadow Parts',
].forEach(title => items.value.push(makeItem(title)))

export const getItems = computed<ItemHead[]>(() => items.value)
