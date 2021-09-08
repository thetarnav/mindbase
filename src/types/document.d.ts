interface FieldData<T extends FieldType> {
	type: T
	id: FieldID
	name: string
	settings: FieldSettings[T]
	value: APIFieldValues[T]
}
type AnyFieldData = FieldData<FieldType>
type FieldsList = AnyFieldData[]

type APIFieldData<T extends APIFieldType> = FieldData<T>
type AnyAPIFieldData = APIFieldData<APIFieldType>

interface DocumentMeta {
	id: DocumentID
	title: string
	thumbnail: string | undefined
	description: string | undefined
}

type APIDocumentContent = Array<AnyAPIFieldData | string>

interface APIDocumentData extends DocumentMeta {
	content: APIDocumentContent
}
