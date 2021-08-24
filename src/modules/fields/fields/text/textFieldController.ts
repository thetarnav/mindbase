import { defaultSettings } from '../../field'
import FieldController from '../../FieldMeta'

export default class TextFieldController extends FieldController<'text'> {
	constructor(id?: string, title?: string, settings = defaultSettings.text) {
		super('text', id, title, settings)
	}
}
