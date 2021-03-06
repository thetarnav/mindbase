import Field, { FieldEntry, FieldType } from '@/modules/fields/field'
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
		this.description = description.slice(0, 200)
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
		new Item(loremIpsum(), 'no description', [
			new Field(
				'test-field-1',
				'date',
				'Year of Birth and Death',
				{
					start: new Date('1997-08-01T17:59:58.441Z'),
					end: new Date('2021-12-17T18:58:44.414Z'),
				},
				{ range: true, multiple: false, mode: 'date' },
			),
			new Field(
				'fewwgaweggd',
				'person',
				'Name of the guy:',
				`${loremIpsum({ count: 2, units: 'words' })} (${loremIpsum({
					units: 'word',
				})})`,
			),
			new Field(
				'test-field-2',
				'number',
				'Number of pages:',
				random(50, 500, 'round'),
				{ minmax: [0, 1000] },
			),
			new Field(
				'phone-field',
				'phone',
				'Contact phone number:',
				'+48505689420',
				{ multiple: true },
			),
			new Field(
				'email-test-field',
				'email',
				'Author email:',
				loremIpsum({ count: 1, units: 'words' }) + '@gmail.com',
				{ multiple: true },
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
			item.description = v.slice(0, 200)
			console.log('new Description:', item.description)
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

// export function useItemField(item:id)
