<script lang="ts" setup>
/* eslint-disable no-unexpected-multiline */
import { Editor, UnionCommands } from '@tiptap/vue-3'
import {} from 'ionicons/icons'
import { toRef } from 'vue-demi'

interface MenuButton {
	action: () => any
	isActive: () => boolean | undefined
}
type MenuButtonsMap = Record<string, MenuButton>

const props = defineProps({
	editor: { type: Object as () => Editor, default: undefined },
	show: { type: Boolean, default: true },
	modelValue: { type: Boolean, default: false },
})

const emit = defineEmits<{
	(e: 'update:modelValue', focused: boolean): void
}>()

const editor = toRef(props, 'editor')

const onClickAway = () => emit('update:modelValue', false)
const onClick = () => emit('update:modelValue', true)

const editorCommand =
	<F extends keyof UnionCommands>(
		command: F,
		...params: Parameters<UnionCommands[F]>
	) =>
	() => {
		editor.value
			?.chain()
			.focus()
			// @ts-ignore
			[command](...params)
			// @ts-ignore
			.run()
	}

const isActive = (name: string, attrs?: Record<string, any>) => () =>
	!!editor.value?.isActive(name, attrs)

const menuButtons: MenuButtonsMap = {
	h1: {
		action: editorCommand('toggleHeading', { level: 1 }),
		isActive: isActive('heading', { level: 1 }),
	},
	h2: {
		action: editorCommand('toggleHeading', { level: 2 }),
		isActive: isActive('heading', { level: 2 }),
	},
	h3: {
		action: editorCommand('toggleHeading', { level: 3 }),
		isActive: isActive('heading', { level: 3 }),
	},
	bold: {
		action: editorCommand('toggleBold'),
		isActive: isActive('bold'),
	},
	italic: {
		action: editorCommand('toggleItalic'),
		isActive: isActive('italic'),
	},
	ul: {
		action: editorCommand('toggleBulletList'),
		isActive: isActive('bulletList'),
	},
	ol: {
		action: editorCommand('toggleOrderedList'),
		isActive: isActive('orderedList'),
	},
}
</script>

<template>
	<teleport to="body">
		<transition name="fixed-menu">
			<div
				v-if="editor"
				v-show="show"
				@click="onClick"
				v-click-away="onClickAway"
				class="fixed-menu"
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
		</transition>
	</teleport>
</template>

<style lang="postcss" scoped>
.fixed-menu {
	@apply fixed z-50 bottom-0 inset-x-0 h-12 px-4;
	@apply flex justify-center items-stretch divide-x divide-gray-400;
	@apply bg-gray-200 text-black;

	button {
		@apply min-w-[3rem];
		&.is-active {
			@apply bg-gray-900 text-white;
		}
	}

	&-leave-active,
	&-enter-active {
		@apply transition-transform delay-150;
	}
	&-leave-to,
	&-enter-from {
		@apply translate-y-full;
	}
}
</style>
