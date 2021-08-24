import { defaultSettings, defaultValues } from '../../field'
import FieldController from '../../FieldController'

// export const createTextFieldController = (
// 	id?: string,
// 	name?: string,
// 	settings = defaultSettings.text,
// 	value = defaultValues.text,
// ): TextFieldController => new TextFieldController(id, name, settings, value)

export default class TextFieldController extends FieldController<'text'> {
	constructor(
		id?: string,
		name?: string,
		settings = defaultSettings.text,
		value = defaultValues.text,
	) {
		super('text', id, name, settings, value)
	}
}
