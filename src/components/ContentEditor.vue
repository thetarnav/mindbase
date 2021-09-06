<script lang="ts" setup>
import {} from 'ionicons/icons'
import { ContentEditor } from '@/modules/content/ContentEditor'
import { EditorContent } from '@tiptap/vue-3'

const props = defineProps({
	editor: { type: Object as () => ContentEditor, required: true },
})

props.editor.on('update', () => {
	console.log(props.editor.getHTML())
})
</script>

<template>
	<EditorContent :editor="editor" class="editor" />
</template>

<style lang="postcss" scoped>
.editor {
	&:deep(.ProseMirror) {
		@apply outline-none p-4;
	}
}
</style>
