import FieldController from '../../FieldController'

// export const createNumberFieldController = (
// 	id?: string,
// 	name?: string,
// 	settings = defaultSettings.number,
// 	value = defaultValues.number,
// ): NumberFieldController => new NumberFieldController(id, name, settings, value)

export interface NumberFieldSettings {
	minmax: [number, number] | [null, null]
}

const defaultSettings: NumberFieldSettings = {
	minmax: [null, null],
}

export default class NumberFieldController extends FieldController<'number'> {
	constructor(
		id?: string,
		name?: string,
		settings = defaultSettings,
		value = 0,
	) {
		super('number', id, name, settings, value)
	}
}
