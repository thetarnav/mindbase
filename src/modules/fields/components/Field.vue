<script lang="ts">
import {} from 'ionicons/icons'
import { nanoid } from 'nanoid'
import { defineAsyncComponent, defineComponent } from 'vue'
import { getFieldComponentImport } from '../fieldFactory'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ContentEditor } from '@/modules/content/ContentEditor'
import { useControllerName } from '../useControllerRefs'

export default defineComponent({
	components: { NodeViewWrapper },
	props: nodeViewProps,
	setup(props) {
		const dataTeleport = nanoid()
		const settingsOpen = false
		const FieldComponent = defineAsyncComponent(
			getFieldComponentImport(props.node?.attrs.type),
		)

		const controller = (props.editor as ContentEditor)?.getFieldController(
			props.node?.attrs.id,
		)
		const name = controller ? useControllerName(controller) : ''

		watch(props, () => {
			console.log('props changed')
			console.log(props)
		})

		return {
			controller,
			name,
			dataTeleport,
			settingsOpen,
			type: props.node?.attrs.type,
			id: props.node?.attrs.id,
			FieldComponent,
		}
	},
})
</script>

<template>
	<node-view-wrapper>
		<div
			v-if="controller"
			class="field-item--wrapper"
			:class="{ 'field-settings-open': settingsOpen }"
		>
			<div class="field-item--actions">
				<slot name="actions"></slot>
			</div>

			<div class="field-item" :class="`field-item--${type}`">
				<header data-drag-handle>
					<contenteditable
						tag="h6"
						class="title"
						v-model="name"
						:contenteditable="settingsOpen"
						noNL
						noHTML
					/>
					<p class="field-type">{{ id }}: {{ type }}</p>
				</header>

				<component
					:is="FieldComponent"
					:controller="controller"
					:settings-teleport="`[data-teleport='${dataTeleport}']`"
					:settings-open="settingsOpen"
				/>
			</div>
			<footer class="field-item--settings">
				<CollapseTransition>
					<div
						v-show="settingsOpen"
						class="settings-content"
						:data-teleport="dataTeleport"
					>
						<!-- <label>Settings</label> -->
					</div>
				</CollapseTransition>
			</footer>
		</div>
	</node-view-wrapper>
</template>

<style lang="postcss">
.field-item {
	@apply flex flex-col items-stretch;

	&--wrapper {
		@apply relative my-2 ring-1 ring-gray-600 dark:ring-gray-800;
	}

	/* background: var(--background); */

	&::part(native) {
		--inner-border-width: 0;
	}

	> header {
		@apply mb-2;
	}

	.title {
		@apply pr-4 my-0 py-1 text-gray-700 dark:text-gray-400;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600 dark:text-gray-500;
	}

	.field-input {
		@apply bg-gray-100 dark:bg-gray-800 px-2 rounded;
		@apply font-medium text-gray-800 dark:text-gray-100;
	}

	.field-input-error {
		@apply mt-1 text-sm text-yellow-500;
		ion-icon {
			@apply mb-0.5;
		}
		> * {
			@apply align-middle;
		}
	}

	&--toggle {
		@apply flex-row justify-between pr-24;
		.field-input {
			@apply ml-auto mt-0.5;
		}
	}
}

.field-item--settings {
	@apply w-full pt-0;
	.settings-content {
		@apply w-full bg-gray-100 dark:bg-gray-800 rounded-b-md;
		ion-item::part(native) {
			--background: transparent;
		}
	}
	ion-label {
		i {
			@apply text-sm text-gray-400;
		}
	}
}

.field-item--actions {
	@apply absolute top-3 right-3 p-1 flex;
	@apply transition-colors rounded;
	ion-button {
		@apply m-0 transition-opacity;

		&:not(.open-options-btn) {
			@apply opacity-0 pointer-events-none;
		}
		&.open-options-btn {
			@apply opacity-50;
		}
	}
}
.field-settings-open .field-item--actions {
	@apply z-10 bg-gray-100 dark:bg-gray-800 bg-opacity-50;
	ion-button {
		@apply opacity-100 pointer-events-auto;
	}
}
</style>
