import Field, { FieldEntry, FieldType } from '@/modules/field'
import { random } from '@/utils/functions'
import { loremIpsum } from 'lorem-ipsum'
import { Ref } from 'vue'

class Item {
	private lastFieldID = 0

	id: string
	thumbnail?: string
	title: string
	description: string
	fields: FieldEntry[]

	constructor(title: string, description = '', fields: FieldEntry[] = []) {
		this.id = genID()
		this.thumbnail = randomImg()
		this.title = title
		this.description = description
		this.fields = fields
	}

	addField(type: FieldType) {
		this.fields.push(new Field(`${this.lastFieldID++}`, type))
	}

	removeField(field: FieldEntry) {
		const i = this.fields.indexOf(field)
		this.fields.splice(i, 1)
	}
}

let lastID = 0

const genID = () => `${lastID++}`,
	randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`

const items: Ref<Item[]> = ref([])

for (let i = 0; i < 25; i++) {
	items.value.push(
		new Item(loremIpsum(), loremIpsum({ count: random(0, 2, 'round') }), [
			new Field(
				'test-field-1',
				'text',
				"Book's Author:",
				{ oneLine: true },
				loremIpsum({ count: 2, units: 'words' }),
			),
			new Field(
				'summary',
				'text',
				'Summary:',
				{ oneLine: false },
				loremIpsum({ count: random(1, 3, 'round') }),
			),
			new Field(
				'test-field-2',
				'number',
				'Number of pages:',
				{},
				random(50, 500, 'round'),
			),
			new Field(
				'email-test-field',
				'email',
				"Author's email:",
				{ multiple: false },
				loremIpsum({ count: 1, units: 'words' }) + '@gmail.com',
			),
			new Field('boolean-test-field', 'toggle', 'Is in store?', undefined),
		]),
	)
}

export const getItems = computed<Item[]>(() => items.value)

export const getItemDetails = (id: string): Item | undefined =>
	items.value.find(item => item.id === id)

export function useItem(id: string) {
	const item = getItemDetails(id)

	if (!item)
		return {
			itemExists: false,
			title: ref(''),
			fields: [] as FieldEntry[],
		}

	const title = computed({
		set: v => {
			item.title = v
			console.log('new Title:', v)
		},
		get: () => item.title,
	})

	const description = computed({
		set: v => {
			item.description = v
			console.log('new Description:', v)
		},
		get: () => item.description,
	})

	return {
		itemExists: true,
		title,
		description,
		fields: item.fields,
		addField: (type: FieldType) => item.addField.call(item, type),
		removeField: (field: FieldEntry) => item.removeField.call(item, field),
	}
}
