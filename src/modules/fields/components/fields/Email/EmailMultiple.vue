<script lang="ts" setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import EmailHighlighter from '@/modules/tiptap/EmailHighlighter'

const props = defineProps({
	modelValue: { type: String, required: true },
	disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
	content: props.modelValue,
	editable: !props.disabled,
	extensions: [
		Placeholder.configure({
			placeholder: 'jane@gmail.com john@gmail.com ...',
		}),
		Document,
		Text,
		Paragraph,
		EmailHighlighter,
	],
	editorProps: {
		attributes: {
			autocomplete: 'email',
			autocorrect: 'on',
			type: 'email',
		},
	},
	onUpdate: ({ editor }) =>
		emit('update:modelValue', editor.state.doc.textContent),
})

watch(
	() => props.disabled,
	() => editor.value?.setEditable(!props.disabled),
)
</script>

<template>
	<EditorContent
		:editor="editor"
		class="field-input field-input--email field-input--email-multiple"
	/>
</template>

<style lang="postcss">
.field-input--email-multiple {
	.ProseMirror {
		@apply p-2 min-h-[3.5rem];
		line-height: 2.1;

		> * + * {
			margin-top: 0.75em;
		}

		&:focus-visible {
			@apply outline-none;
		}

		.email {
			@apply py-1 px-1.5 bg-gray-500 bg-opacity-5;
			@apply rounded border border-gray-300 dark:border-gray-600;
		}
	}

	.ProseMirror p.is-editor-empty:first-child::before {
		content: attr(data-placeholder);
		float: left;
		color: #ced4da;
		pointer-events: none;
		height: 0;
	}
}
.field-settings-open .field-input--email-multiple .ProseMirror {
	@apply opacity-40;
}
</style>
