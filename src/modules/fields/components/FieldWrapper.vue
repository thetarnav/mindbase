<script lang="ts">
import { defineComponent } from 'vue-demi'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { ContentEditor } from '@/modules/content/ContentEditor'

export default defineComponent({
	components: {
		NodeViewWrapper,
	},
	props: {
		node: {
			type: Object,
			required: true,
		},
		editor: {
			type: Object as () => ContentEditor,
			required: true,
		},
	},
	setup(props) {
		console.log('CREATED', props.node.attrs.id)
		watch(
			() => props.node,
			(now, old) => console.log(old.attrs.id, '->', now.attrs.id),
		)
	},
})
</script>

<template>
	<node-view-wrapper class="vue-component-test">
		<span class="label" data-drag-handle>Drag Handle</span>
		<div class="content">
			{{ node.attrs.id }}
		</div>
	</node-view-wrapper>
</template>

<style lang="postcss">
.vue-component-test {
	background: #faf594;
	border: 3px solid #0d0d0d;
	border-radius: 0.5rem;
	margin: 1rem 0;
	position: relative;

	.label {
		margin-left: 1rem;
		background-color: #0d0d0d;
		font-size: 0.6rem;
		letter-spacing: 1px;
		font-weight: bold;
		text-transform: uppercase;
		color: #fff;
		position: absolute;
		top: 0;
		padding: 0.25rem 0.75rem;
		border-radius: 0 0 0.5rem 0.5rem;
	}

	.content {
		margin-top: 1.5rem;
		padding: 1rem;
		font-size: 3rem;
	}
}
</style>
