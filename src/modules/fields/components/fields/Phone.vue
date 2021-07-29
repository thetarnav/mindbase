<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import type { FieldSettings, FieldValue } from '@/modules/fields/field'
import { defineEmit, defineProps, nextTick } from 'vue'
import { IonReorderGroup } from '@ionic/vue'
import { AsYouType } from 'libphonenumber-js'
import { useThrottleFn } from '@vueuse/core'

const props = defineProps({
	modelValue: { type: Array as () => FieldValue['phone'], required: true },
	settings: { type: Object as () => FieldSettings['phone'], required: true },
	settingsTeleport: { type: String, required: true },
})

interface Emits {
	(name: 'update:modelValue', payload: FieldValue['phone']): void
	(name: 'update:settings', payload: FieldSettings['phone']): void
}
const rawEmit = defineEmit(['update:modelValue', 'update:settings'])
const emit = rawEmit as Emits

const defaultCountryCode = 'US'

const value = ref(
	props.modelValue.map((phone, index) => ({
		...phone,
		id: index,
		code: defaultCountryCode,
		compact: phone.number,
	})),
)
// Format numbers initially
value.value.forEach(({ id }) => updateValue(id))

/**
 * Updates local phone values
 * @param id id of the phone value item
 */
function updateValue(id: number) {
	const phoneItem = value.value.find(p => p.id === id)
	if (!phoneItem) return

	try {
		const formatter = new AsYouType(defaultCountryCode),
			number = formatter.input(phoneItem.number),
			code = formatter.getCountry(),
			compact = formatter.getNumber()?.format('E.164')

		phoneItem.code = code ?? ''
		phoneItem.number = number
		phoneItem.compact = compact ?? ''
	} catch (error) {
		console.log(error)
	}
}

/**
 * **DEB**
 * Emits change of phone values to parent component.
 */
const emitValue = useThrottleFn(() => {
	const parsedValues: FieldValue['phone'] = value.value.map(phone => ({
		name: phone.name,
		number: phone.compact,
	}))
	emit('update:modelValue', parsedValues)
}, 1000)

const handlePhoneInput = (e: Event, id: number) => {
	const el: any = e.target
	if (!el) return

	const selectionStart: number | undefined = el.selectionStart
	updateValue(id)
	emitValue()

	// Changing v-model value makes the cursor to teleport to the end
	// This resets it to previous position if it were somewhere in the middle
	if (selectionStart && selectionStart !== el.value?.length)
		nextTick(() => (el.selectionStart = el.selectionEnd = selectionStart))
}
</script>

<template>
	<ion-reorder-group :disabled="true" class="phones-list">
		<div v-for="phone in value" :key="phone.id" class="phone-item">
			<ion-label>
				{{ phone.name }}
			</ion-label>
			<div class="country-code">
				{{ phone.code || defaultCountryCode }}
			</div>
			<input
				:name="phone.name"
				:disabled="Boolean($attrs.disabled)"
				v-model="phone.number"
				@input="handlePhoneInput($event, phone.id)"
				placeholder="(000) 000-0000"
				type="tel"
				inputmode="tel"
				class="field-input field-input--phone"
			/>
			<ion-reorder slot="end"></ion-reorder>
		</div>
	</ion-reorder-group>
</template>

<style lang="postcss" scoped>
.phones-list {
	@apply mt-4 space-y-4;
}

.phone-item {
	@apply flex items-center space-x-4;
}
.field-input--phone {
	@apply mt-0 py-2;
	&:disabled {
		@apply opacity-60;
	}
}
</style>
