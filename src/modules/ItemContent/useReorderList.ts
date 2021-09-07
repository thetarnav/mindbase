import { ComponentPublicInstance, onMounted, onUnmounted, Ref } from 'vue'
import { Draggable, DragMoveEvent, DragOverEvent } from '@shopify/draggable'
import { cloneDeep, pull } from 'lodash'

interface DragOver {
	el: HTMLElement | null
	top: number
	h: number
	side: 'bottom' | 'top'
	entry: Entry | null
}

const initialDragOverState: DragOver = {
	el: null,
	top: 0,
	h: 100,
	side: 'bottom',
	entry: null,
}

type EntryType = 'field' | 'note-block'
interface Entry<T = EntryType> {
	is: T
	index: number
	noteIndex: T extends 'note-block' ? number : null
	id: string
	el: HTMLElement
}

const createDraggableInstance = (container: HTMLElement) =>
	new Draggable(container, {
		draggable:
			'.content-field-component, .content-note-component .ProseMirror > *',
		handle: '.reorder-handle',
		// delay: {
		// 	mouse: 50,
		// 	drag: 50,
		// 	touch: 100,
		// },
		// distance: 20,
		// mirror: {
		// 	constrainDimensions: true,
		// 	xAxis: false,
		// 	appendTo: 'body',
		// },
		// @ts-ignore
		exclude: {
			plugins: [Draggable.Plugins.Mirror],
		},
	})

const filterHTMLElements = (els: Element[]) =>
	els.filter(el => el instanceof HTMLElement) as HTMLElement[]

const filterFields = (els: HTMLElement[]) =>
	els.filter(el => el.classList.contains('content-field-component'))

const filterNoteBlocks = (entries: HTMLElement[]): HTMLElement[] =>
	entries.filter(el => !el.classList.contains('content-field-component'))

const getAllEntryElements = (parent: HTMLElement) =>
	filterHTMLElements([
		...parent.querySelectorAll(
			'.content-field-component, .content-note-component .ProseMirror > *',
		),
	])

const grabElementFieldID = (el: Element): string =>
	(el as HTMLElement)?.dataset.fieldId ?? ''

const getFieldEntries = (els: HTMLElement[]): Entry[] => {
	const fields: Entry[] = []
	filterFields(els).forEach(el => {
		fields.push({
			is: 'field',
			id: grabElementFieldID(el),
			el,
			index: els.indexOf(el),
			noteIndex: null,
		})
	})
	return fields
}

const getNoteBlocksEntries = (entries: HTMLElement[]): Entry[] =>
	filterNoteBlocks(entries).map(el => {
		const note = el.closest('.content-note-component')
		return {
			is: 'note-block',
			id: (note as HTMLElement)?.dataset?.fieldId ?? '',
			index: entries.indexOf(el),
			noteIndex: Array.from(el.parentElement?.children ?? []).indexOf(el),
			el,
		}
	})

const getEntriesInContainer = (
	parent: HTMLElement,
	omit: HTMLElement[] = [],
): Entry[] => {
	// Node List of all entries
	let els = getAllEntryElements(parent)
	els = pull(els, ...omit)
	const fields = getFieldEntries(els)
	const noteBlocks = getNoteBlocksEntries(els)
	return [...fields, ...noteBlocks].sort((a, b) => a.index - b.index)
}

const findEntryWithElement = (
	entries: Entry[],
	el: HTMLElement,
): Entry | null => entries.find(e => e.el === el) ?? null

export default function useReorderList(
	listRef: Ref<HTMLElement | ComponentPublicInstance>,
) {
	let draggable: Draggable
	let entries: Entry[] = []
	let sourceID: string | null = null
	const over = reactive<DragOver>(cloneDeep(initialDragOverState))

	const indicator = computed<[HTMLElement, 'drop-bottom' | 'drop-top'] | null>(
		() => {
			if (!over.el) return null
			if (over.side === 'bottom') return [over.el, 'drop-bottom']
			const prev = over.entry ? entries[over.entry.index - 1] : null
			return prev ? [prev.el, 'drop-bottom'] : [over.el, 'drop-top']
		},
	)

	const clearOverEl = () => Object.assign(over, initialDragOverState)

	const onDragMove = (e: DragMoveEvent) => {
		const { clientY: y } = (e.originalEvent as TouchEvent).touches[0]
		const fromTop = y - over.top
		const pastCenter = fromTop > over.h / 2
		over.side = pastCenter ? 'bottom' : 'top'
	}

	const onDragOver = (e: DragOverEvent) => {
		const bounds = e.over.getBoundingClientRect()
		over.el = e.over
		over.h = bounds.height
		over.top = bounds.top
		over.entry = findEntryWithElement(entries, e.over)
	}

	onMounted(() => {
		let container: HTMLElement
		if (listRef.value instanceof HTMLElement) container = listRef.value
		else container = listRef.value.$el
		draggable = createDraggableInstance(container)

		draggable.on('drag:start', e => {
			entries = getEntriesInContainer(container, [e.originalSource])
			sourceID = grabElementFieldID(e.source)
		})
		draggable.on('drag:move', onDragMove)
		draggable.on('drag:over', e => {
			onDragOver(e)
			onDragMove(e)
		})
		draggable.on('drag:out:container', clearOverEl)
		draggable.on('drag:stop', e => {
			// console.log(sourceID)

			// console.log(
			// 	sourceID,
			// 	'->',
			// 	over.side === 'bottom' ? over.entry?.index : over.entry?.index - 1,
			// )
			clearOverEl()
		})
	})
	onUnmounted(() => {
		draggable.destroy()
	})

	watch(indicator, (now, old) => {
		old && old[0].classList.remove(old[1])
		now && now[0].classList.add(now[1])
	})
}
