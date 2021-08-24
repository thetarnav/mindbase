import { defaultSettings } from '../../field'
import FieldController from '../../FieldMeta'

export default class NumberFieldController extends FieldController<'number'> {
	constructor(id?: string, title?: string, settings = defaultSettings.number) {
		super('number', id, title, settings)
	}
}
