interface ItemHead {
	id: string
	title: string
	thumbnail: string
}

const randomID = () => Number.isInteger(Math.random() * 1000000).toString(),
	randomImg = 'https://source.unsplash.com/400x400'

const items = ref<ItemHead[]>([
	{
		id: randomID(),
		title: '13 Reasons Why',
		thumbnail: randomImg,
	},
	{
		id: randomID(),
		title: 'Random search term',
		thumbnail: randomImg,
	},
	{
		id: randomID(),
		title: 'What the dog doin',
		thumbnail: randomImg,
	},
	{
		id: randomID(),
		title: 'Vue3 + Ionic + Typescript + TailwindCSS',
		thumbnail: randomImg,
	},
	{
		id: randomID(),
		title: 'Cookies are stored on the server',
		thumbnail: randomImg,
	},
	{
		id: randomID(),
		title: 'Every user needs an account',
		thumbnail: randomImg,
	},
])

export const getItems = computed<ItemHead[]>(() => items.value)
