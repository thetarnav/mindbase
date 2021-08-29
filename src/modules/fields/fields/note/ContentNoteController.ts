import FieldController from '../../FieldController'

// export const createTextFieldController = (
// 	id?: string,
// 	name?: string,
// 	settings = defaultSettings.text,
// 	value = defaultValues.text,
// ): TextFieldController => new TextFieldController(id, name, settings, value)

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
}
