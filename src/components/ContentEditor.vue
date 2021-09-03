<script lang="ts" setup>
import {} from 'ionicons/icons'
import { UnwrapRef } from 'vue'
import { ContentEditor } from '@/modules/editor/ContentEditor'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { editorExtensions } from '@/modules/tiptap/editorExtensions'

const props = defineProps({
	editorController: { type: Object as () => ContentEditor, required: true },
})

const editor = new Editor({
	content: '<p>Hello</p><field id="sdfghsgd" type="text"></field><p>After</p>',
	editable: true,
	extensions: editorExtensions,
	onUpdate({ editor }) {
		// emit('update:modelValue', editor.getHTML())
	},
	onFocus() {
		// editorFocus()
		// emit('focus')
	},
	onBlur({ transaction }) {
		// editorClickAway()
		// emit('blur', transaction.doc.textContent)
	},
})
</script>

<template>
	<EditorContent :editor="editor" class="editor" />
</template>

<style lang="postcss" scoped></style>
