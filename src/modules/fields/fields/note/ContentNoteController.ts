import DOCUMENT from '@/modules/documents/useDocument'
import FieldController from '../../FieldController'
export default class ContentNoteController extends FieldController<'note'> {
	constructor(
		id?: string,
		name?: string,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		settings?: any,
		value = '',
	) {
		name = ''
		settings = {}
		super('note', id, name, settings, value)
	}

	removeNote(): void {
		DOCUMENT.instance.removeField(this.id)
	}
}
