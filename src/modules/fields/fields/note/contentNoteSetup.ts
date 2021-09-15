import { generateJSON, JSONContent, generateHTML } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import { Indent } from '@/modules/tiptap/tabIndent'
import { Ref, toRef } from 'vue'
import useContent from '@/store/content'
import { biSyncSetSource } from '@/utils/reactivity'

export const defaultValue = '<p></p>'

export const generateNoteJSON = (html: string): JSONContent =>
	generateJSON(html, [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography,
		Document,
		Paragraph,
		Indent,
	]) as JSONContent

export const generateNoteHTML = (json: JSONContent | JSONContent[]): string => {
	const content = Array.isArray(json) ? { type: 'doc', content: json } : json
	return generateHTML(content, [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography,
		Document,
		Paragraph,
		Indent,
	])
}

/**
 * Removes line breaks from empty lines.
 *
 * e.g. `...<p><br></p>...` -> `...<p></p>...`
 */
function removeEmptyLineBreak(string: string): string {
	const rgx = new RegExp(/(<p[^>]*>)(?:<br[/\\]?>)+(<\/p>)/gi)

	let find: RegExpExecArray | null,
		last = 0,
		result = ''

	while ((find = rgx.exec(string))) {
		const before = string.slice(last, find.index)
		last = rgx.lastIndex
		// find[1] & find[2] are two capture regex capture groups
		result += before + find[1] + find[2]
	}
	// have to add the remaining text (the while loop stops at fast found match)
	return result + string.slice(last)
}

export const useNoteValue = (id: FieldID): Ref<string> => {
	const content = useContent()
	const rawValue = computed({
		get: () => content.getValue<'note'>(id) ?? defaultValue,
		set: v => content.setValue(id, v),
	})
	return biSyncSetSource(
		rawValue,
		raw => removeEmptyLineBreak(raw),
		local => local,
	)
}
