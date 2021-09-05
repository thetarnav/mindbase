<script lang="ts" setup>
import {} from 'ionicons/icons'
import { ContentEditor } from '@/modules/content/ContentEditor'
import { EditorContent } from '@tiptap/vue-3'

const props = defineProps({
	editorController: { type: Object as () => ContentEditor, required: true },
})
</script>

<template>
	<EditorContent :editor="editorController" class="editor" />
</template>

<style lang="postcss" scoped></style>
