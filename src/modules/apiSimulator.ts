import { random, wait } from '@/utils/functions'
import { cloneDeep } from 'lodash'
import { loremIpsum } from 'lorem-ipsum'
import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import Field, { FieldEntry, FieldType } from './fields/field'

const randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`

class DummyItem {
	private lastFieldID = 0

	id: string
	thumbnail?: string
	title: string
	description: string
	fields: FieldEntry[]

	constructor(title: string, description = '', fields: FieldEntry[] = []) {
		this.id = nanoid()
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

const recentItems: Ref<DummyItem[]> = ref([])

for (let i = 0; i < 15; i++) {
	recentItems.value.push(
		new DummyItem(loremIpsum(), 'no description', [
			new Field('dfgerasfz', 'text', 'Test Text Field', 'qwerty'),
			// new Field(
			// 	'test-field-1',
			// 	'date',
			// 	'Year of Birth and Death',
			// 	{
			// 		start: new Date('1997-08-01T17:59:58.441Z'),
			// 		end: new Date('2021-12-17T18:58:44.414Z'),
			// 	},
			// 	{ range: true, multiple: false, mode: 'date' },
			// ),
			// new Field(
			// 	'fewwgaweggd',
			// 	'person',
			// 	'Name of the guy:',
			// 	`${loremIpsum({ count: 2, units: 'words' })} (${loremIpsum({
			// 		units: 'word',
			// 	})})`,
			// ),
			new Field(
				'test-field-2',
				'number',
				'Number of pages:',
				random(50, 500, 'round'),
				{ minmax: [0, 1000] },
			),
			// new Field(
			// 	'phone-field',
			// 	'phone',
			// 	'Contact phone number:',
			// 	'+48505689420',
			// 	{ multiple: true },
			// ),
			// new Field(
			// 	'email-test-field',
			// 	'email',
			// 	'Author email:',
			// 	loremIpsum({ count: 1, units: 'words' }) + '@gmail.com',
			// 	{ multiple: true },
			// ),
			// new Field('boolean-test-field', 'toggle', 'Is in store?', undefined),
		]),
	)
}

const allItems: Ref<DummyItem[]> = ref([])

allItems.value.push(...recentItems.value)

for (let i = 0; i < 10; i++) {
	allItems.value.push(
		new DummyItem(
			loremIpsum(),
			'no description',
			// [
			// 	new Field(
			// 		'test-field-1',
			// 		'date',
			// 		'Year of Birth and Death',
			// 		{
			// 			start: new Date('1997-08-01T17:59:58.441Z'),
			// 			end: new Date('2021-12-17T18:58:44.414Z'),
			// 		},
			// 		{ range: true, multiple: false, mode: 'date' },
			// 	),
			// 	new Field(
			// 		'fewwgaweggd',
			// 		'person',
			// 		'Name of the guy:',
			// 		`${loremIpsum({ count: 2, units: 'words' })} (${loremIpsum({
			// 			units: 'word',
			// 		})})`,
			// 	),
			// 	new Field(
			// 		'test-field-2',
			// 		'number',
			// 		'Number of pages:',
			// 		random(50, 500, 'round'),
			// 		{ minmax: [0, 1000] },
			// 	),
			// 	new Field(
			// 		'phone-field',
			// 		'phone',
			// 		'Contact phone number:',
			// 		'+48505689420',
			// 		{ multiple: true },
			// 	),
			// 	new Field(
			// 		'email-test-field',
			// 		'email',
			// 		'Author email:',
			// 		loremIpsum({ count: 1, units: 'words' }) + '@gmail.com',
			// 		{ multiple: true },
			// 	),
			// 	new Field('boolean-test-field', 'toggle', 'Is in store?', undefined),
			// ]
		),
	)
}

interface DummyItemMeta {
	id: string
	title: string
	thumbnail: string | undefined
	description: string
}

export async function getItems(
	which: 'all' | 'recent',
): Promise<DummyItemMeta[]> {
	await wait(random(100, 1500, 'ceil'))
	const items = cloneDeep(which === 'all' ? allItems.value : recentItems.value)
	return items.map(item => ({
		id: item.id,
		title: item.title,
		thumbnail: item.thumbnail,
		description: item.description,
	}))
}

export async function getItemDetails(id: string): Promise<DummyItem> {
	await wait(random(100, 1500, 'ceil'))
	const doc = allItems.value.find(item => item.id === id)
	if (!doc) return Promise.reject(`There is no document with this ID: ${id}`)
	return cloneDeep(doc)
}
