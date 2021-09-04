<script lang="ts" setup>
import {} from 'ionicons/icons'
import { UnwrapRef } from 'vue'
import { ContentEditor } from '@/modules/editor/ContentEditor'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { editorExtensions } from '@/modules/tiptap/editorExtensions'

const props = defineProps({
	editorController: { type: Object as () => ContentEditor, required: true },
})
</script>

<template>
	<EditorContent :editor="editorController.editor" class="editor" />
</template>

<style lang="postcss" scoped></style>
