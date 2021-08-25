import FieldController from '../../FieldController'

// export const createTextFieldController = (
// 	id?: string,
// 	name?: string,
// 	settings = defaultSettings.text,
// 	value = defaultValues.text,
// ): TextFieldController => new TextFieldController(id, name, settings, value)

export interface TextFieldSettings {
	multiline: boolean
	rich: boolean
}

const defaultSettings: TextFieldSettings = {
	multiline: false,
	rich: false,
}

export default class TextFieldController extends FieldController<'text'> {
	constructor(
		id?: string,
		name?: string,
		settings = defaultSettings,
		value = '',
	) {
		super('text', id, name, settings, value)
	}
}
