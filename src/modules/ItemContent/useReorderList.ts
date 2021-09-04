import { ComponentPublicInstance, onMounted, onUnmounted, Ref } from 'vue'

export default function useReorderList(
	listRef: Ref<Element | ComponentPublicInstance>,
): void {
	onMounted(() => {
		console.log('mounted')
		console.log(listRef.value)
		if (listRef.value instanceof Element) console.log('is Element')
		else console.log('is compoennt')
	})

	onUnmounted(() => {
		console.log('unmounted')
	})
}
