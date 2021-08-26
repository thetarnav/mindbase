import { random, wait } from '@/utils/functions'
import { cloneDeep } from 'lodash'
import { loremIpsum } from 'lorem-ipsum'
import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import { FieldSettings, FieldType, RawFieldValues } from './fields/types'

const randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () =>
		`https://source.unsplash.com/${randomSize()}x${randomSize()}`

interface DummyField<T extends FieldType> {
	type: T
	id: string
	name: string
	settings: FieldSettings[T]
	value: RawFieldValues[T]
}

class DummyItem {
	id: string
	thumbnail?: string
	title: string
	description: string
	fields: DummyField<FieldType>[]

	constructor(
		title: string,
		description = '',
		fields: DummyField<FieldType>[] = [],
	) {
		this.id = nanoid()
		this.thumbnail = randomImg()
		this.title = title
		this.description = description.slice(0, 200)
		this.fields = fields
	}
}

const recentItems: Ref<DummyItem[]> = ref([])

for (let i = 0; i < 15; i++) {
	recentItems.value.push(
		new DummyItem(loremIpsum(), 'no description', [
			{
				type: 'text',
				id: 'sarghtjykdsgasdf',
				name: 'Test text field',
				settings: {
					multiline: true,
					rich: false,
				},
				value: 'lorem ipsum',
			},
			{
				type: 'number',
				id: 'sadfngmkjst',
				name: '',
				settings: {
					minmax: [0, 1000],
				},
				value: 235,
			},
		]),
	)
}

const allItems: Ref<DummyItem[]> = ref([])

allItems.value.push(...recentItems.value)

for (let i = 0; i < 10; i++) {
	allItems.value.push(new DummyItem(loremIpsum(), 'no description', []))
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
