import { random } from '@/utils/functions'
import { loremIpsum } from 'lorem-ipsum'

export interface ItemHead {
	id: string
	thumbnail: string
	title: string
	description?: string
}

const randomID = () => random(0, 1000000, 'round').toString(),
	randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`

const items = ref<ItemHead[]>([])

for (let i = 0; i < 30; i++) {
	items.value.push({
		id: randomID(),
		title: loremIpsum(),
		thumbnail: randomImg(),
		description: loremIpsum({ count: random(0, 2, 'round') }),
	})
}

export const getItems = computed<ItemHead[]>(() => items.value)

export const getItemDetails = (id: string): ItemHead | undefined =>
	items.value.find(item => item.id === id)

export function useItem(id: string) {
	const details = getItemDetails(id)

	if (!details)
		return {
			itemExists: false,
			title: '',
		}

	const title = computed({
		set: v => {
			details.title = v
			console.log('new Title:', v)
		},
		get: () => details.title,
	})

	const description = computed({
		set: v => {
			details.description = v
			console.log('new Description:', v)
		},
		get: () => details.description,
	})

	return {
		itemExists: true,
		title,
		description,
	}
}
