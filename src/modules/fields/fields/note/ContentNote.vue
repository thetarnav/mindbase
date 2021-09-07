<script lang="ts" setup>
import {} from 'ionicons/icons'
import { useNoteController } from '../../useController'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps({
	id: { type: String, required: true },
})
const { controller, value } = useNoteController(props.id)
const editor = ref<InstanceType<typeof RichTextEditor>>()

const handleEditorBlur = (content: string) => {
	// When user clicks away from the note leaving it empty,
	// then remove it from the DOCUMENT
	// if (content.length === 0) controller.removeNote()
}
</script>

<template>
	<div class="content-note">
		<RichTextEditor ref="editor" v-model="value" @blur="handleEditorBlur" />
	</div>
</template>

<style lang="postcss" scoped>
.content-note {
	@apply py-4;

	&:deep(.ProseMirror) {
		> * {
			@apply px-4;
		}
	}
}
</style>
