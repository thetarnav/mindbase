<script lang="ts" setup>
import {} from 'ionicons/icons'
import { useNoteController } from '../../useController'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps({
	id: { type: String, required: true },
})

const { controller, value } = useNoteController(props.id)
</script>

<template>
	<div class="wrapper">
		<RichTextEditor v-model="value" />
	</div>
</template>

<style lang="postcss" scoped>
.wrapper {
	@apply p-4;
}
</style>
