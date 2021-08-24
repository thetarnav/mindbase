import { defaultSettings, defaultValues } from '../../field'
import FieldController from '../../FieldController'

// export const createNumberFieldController = (
// 	id?: string,
// 	name?: string,
// 	settings = defaultSettings.number,
// 	value = defaultValues.number,
// ): NumberFieldController => new NumberFieldController(id, name, settings, value)

export default class NumberFieldController extends FieldController<'number'> {
	constructor(
		id?: string,
		name?: string,
		settings = defaultSettings.number,
		value = defaultValues.number,
	) {
		super('number', id, name, settings, value)
	}
}
