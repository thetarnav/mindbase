export type FieldType =
   | 'text'
   | 'number'
   | 'toggle'
   | 'email'
   | 'rich_text'
   | 'phone'

export type FieldEntry = Field<FieldType>

export interface FieldValue {
   text: string
   rich_text: string
   number: number
   toggle: boolean
   email: string
   phone:
      | string
      | {
           label: string
           number: string
        }[]
}

const defaultValues: FieldValue = {
   text: '',
   rich_text: 'Content of your Rich Text Field.',
   number: 0,
   toggle: false,
   email: '',
   phone: '',
}

export interface FieldSettings {
   text: {
      multiline: boolean
   }
   number: {
      minmax: [number, number] | [null, null]
   }
   email: { multiple: boolean }
   toggle: Record<string, never>
   rich_text: Record<string, never>
   phone: {
      multiple: boolean
   }
}

const defaultSettings: FieldSettings = {
   text: {
      multiline: true,
   },
   rich_text: {},
   number: {
      minmax: [null, null],
   },
   email: {
      multiple: false,
   },
   toggle: {},
   phone: {
      multiple: false,
   },
}

export default class Field<T extends FieldType> {
   /**
    * unique field name - shared between shape and item
    */
   id: string
   type: T
   title: string
   value: FieldValue[T]
   settings: FieldSettings[T]
   isRequired: boolean
   defaultValue: FieldValue[T]

   constructor(
      id: string,
      type: T,
      title = 'Title of new field.',
      value: FieldValue[T] = defaultValues[type],
      settings: FieldSettings[T] = defaultSettings[type],
      isRequired = false,
      defaultValue = defaultValues[type],
   ) {
      this.id = id
      this.type = type
      this.title = title
      this.value = value
      this.settings = settings
      this.isRequired = isRequired
      this.defaultValue = defaultValue
   }

   changeTitle(title: string): void {
      this.title = title
   }

   changeValue(value: FieldValue[T]): void {
      this.value = value
   }

   changeSettings(settings: FieldSettings[T]): void {
      this.settings = settings
   }
}
