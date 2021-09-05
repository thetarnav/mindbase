import { AnyFieldRawData, DocumentMeta, DocumentRawData } from '@/types/api'
import { random, wait } from '@/utils/functions'
import { cloneDeep } from 'lodash'
import { loremIpsum } from 'lorem-ipsum'
import { nanoid } from 'nanoid'
import { Ref } from 'vue'

const randomSize = () => 350 + random(0, 10, 'round') * 10,
	randomImg = () => `https://source.unsplash.com/${randomSize()}x${randomSize()}`

class DummyItem implements DocumentMeta {
	id: string
	thumbnail: string

	constructor(
		public title: string,
		public description: string | null,
		public content: Array<AnyFieldRawData | string>,
	) {
		this.id = nanoid()
		this.thumbnail = randomImg()
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
			'<p>&#9;Hello!</p><p>This just some text</p>',
			{
				type: 'phone',
				id: 'wqertbj',
				name: 'My contacts',
				settings: {
					multiple: false,
				},
				value: [],
			},
			'<p><b>Bye bye!</b></p>',
		]),
	)
}

const allItems: Ref<DummyItem[]> = ref([])

allItems.value.push(...recentItems.value)

for (let i = 0; i < 10; i++) {
	allItems.value.push(new DummyItem(loremIpsum(), 'no description', []))
}

export async function getItems(which: 'all' | 'recent'): Promise<DocumentMeta[]> {
	await wait(random(100, 1500, 'ceil'))
	const items = cloneDeep(which === 'all' ? allItems.value : recentItems.value)
	return items.map(item => ({
		id: item.id,
		title: item.title,
		thumbnail: item.thumbnail,
		description: item.description,
	}))
}

export async function getItemDetails(id: string): Promise<DocumentRawData> {
	await wait(random(100, 1500, 'ceil'))
	const doc = allItems.value.find(item => item.id === id)
	if (!doc) return Promise.reject(`There is no document with this ID: ${id}`)
	return cloneDeep(doc)
}
