import Field, { FieldEntry } from '@/modules/field'
import { random } from '@/utils/functions'
import { loremIpsum } from 'lorem-ipsum'

export interface ItemHead {
	id: string
	thumbnail: string
	title: string
	description?: string
	fields: FieldEntry[]
}

let lastID = 0

const genID = () => `${lastID++}`,
	randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`

const items = ref<ItemHead[]>([])

for (let i = 0; i < 30; i++) {
	items.value.push({
		id: genID(),
		title: loremIpsum(),
		thumbnail: randomImg(),
		description: loremIpsum({ count: random(0, 2, 'round') }),
		fields: [
			new Field(
				'test-field-1',
				"Book's Author:",
				'text',
				{ oneLine: true },
				loremIpsum({ count: 2, units: 'words' }),
			),
			new Field(
				'summary',
				'Summary:',
				'text',
				{ oneLine: false },
				loremIpsum({ count: random(1, 3, 'round') }),
			),
			new Field(
				'test-field-2',
				'Number of pages:',
				'number',
				{},
				random(50, 500, 'round'),
			),
			new Field(
				'email-test-field',
				"Author's email:",
				'email',
				{ multiple: false },
				loremIpsum({ count: 1, units: 'words' }) + '@gmail.com',
			),
			new Field('boolean-test-field', 'Is in store?', 'toggle', undefined),
		],
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
			fields: [] as FieldEntry[],
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
		fields: details.fields,
	}
}
