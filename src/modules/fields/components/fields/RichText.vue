<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import { defineEmit, defineProps, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: String, required: true },
	disabled: { type: Boolean, default: false },
})

const emit = defineEmit(['update:modelValue'])

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
	],
	onUpdate: ({ editor }) => {
		emit('update:modelValue', editor.getHTML())
	},
	onFocus() {
		editorFocused.value = true
		fixedMenuFocused.value = true
	},
	onBlur() {
		editorFocused.value = false
	},
})

watch(
	() => props.disabled,
	() => editor.value?.setEditable(!props.disabled),
)

const editorFocused = ref(false),
	fixedMenuFocused = ref(false)

const clickAway = () =>
	setTimeout(
		() => (fixedMenuFocused.value = editorFocused.value ? true : false),
		1,
	)

interface MenuButton {
	action: () => any
	isActive: () => boolean | undefined
}

const menuButtons: Record<string, MenuButton> = {
	h1: {
		action: () =>
			editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
		isActive: () => editor.value?.isActive('heading', { level: 1 }),
	},
	h2: {
		action: () =>
			editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
		isActive: () => editor.value?.isActive('heading', { level: 2 }),
	},
	h3: {
		action: () =>
			editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
		isActive: () => editor.value?.isActive('heading', { level: 3 }),
	},
	bold: {
		action: () => editor.value?.chain().focus().toggleBold().run(),
		isActive: () => editor.value?.isActive('bold'),
	},
	italic: {
		action: () => editor.value?.chain().focus().toggleItalic().run(),
		isActive: () => editor.value?.isActive('italic'),
	},
}
</script>

<template>
	<EditorContent
		:editor="editor"
		class="field-input field-input--rich rich-text--input-container"
	/>
	<teleport to="body">
		<div
			v-if="editor"
			v-show="editorFocused || fixedMenuFocused"
			@click="fixedMenuFocused = true"
			v-click-away="clickAway"
			class="rich-text--fixed-menu"
		>
			<button
				v-for="({ action, isActive }, btn) in menuButtons"
				:key="btn"
				@click="action"
				:class="{ 'is-active': isActive() }"
			>
				{{ btn }}
			</button>
		</div>
	</teleport>
</template>

<style lang="postcss">
.rich-text {
	&--input-container {
		@apply w-full;

		> .ProseMirror {
			@apply py-2 min-h-[4rem];

			&:focus-visible {
				@apply outline-none;
			}
		}
	}

	&--fixed-menu {
		@apply fixed z-50 bottom-0 inset-x-0 h-12 px-4;
		@apply flex justify-center items-stretch divide-x divide-gray-400;
		@apply bg-gray-200 text-black;

		button {
			@apply min-w-[3rem];
			&.is-active {
				@apply bg-gray-900 text-white;
			}
		}
	}
}

.field-settings-open .field-input--rich {
	@apply opacity-50;
}
</style>
