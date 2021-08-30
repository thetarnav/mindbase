<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import { Indent } from '@/modules/tiptap/tabIndent'
import RichTextFixedMenu from './RichTextFixedMenu.vue'

const props = defineProps({
	modelValue: { type: String, required: true },
	disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
	content: props.modelValue,
	editable: !props.disabled,
	extensions: [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography,
		Document,
		Paragraph,
		Indent,
	],
	onUpdate: ({ editor }) => {
		emit('update:modelValue', editor.getHTML())
	},
	onFocus() {
		editorFocus()
	},
	onBlur() {
		editorClickAway()
	},
})

watch(
	() => props.disabled,
	() => editor.value?.setEditable(!props.disabled),
)

const editorFocused = ref(false),
	fixedMenuFocused = ref(false)

const editorClickAway = () =>
	setTimeout(() => (editorFocused.value = false), 15)
const editorFocus = () => (editorFocused.value = true)
</script>

<template>
	<EditorContent :editor="editor" class="editor" @click="editorFocus" />
	<RichTextFixedMenu
		:editor="editor"
		:show="editorFocused || fixedMenuFocused"
		v-model="fixedMenuFocused"
	/>
</template>

<style lang="postcss" scoped>
.editor {
	>>> .ProseMirror {
		@apply py-2 min-h-[4rem];

		&:focus-visible {
			@apply outline-none;
		}
	}

	>>> ul {
		list-style: disc;
	}
	>>> ol {
		list-style: decimal;
	}
}
</style>
