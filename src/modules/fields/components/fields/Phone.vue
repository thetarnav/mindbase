<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import type { FieldSettings, FieldValue } from '@/modules/fields/types'
import { nextTick } from 'vue'
import { IonReorderGroup } from '@ionic/vue'
import {
	addOutline,
	closeOutline,
	reorderTwoOutline,
	callOutline,
} from 'ionicons/icons'
import { AsYouType } from 'libphonenumber-js'
import { debounce } from 'lodash'
import { getRandom } from '@/utils/functions'
import copy from '@/modules/clipboard'

const props = defineProps({
	modelValue: {
		type: [Array as () => FieldValue['phone'], String],
		required: true,
	},
	settings: { type: Object as () => FieldSettings['phone'], required: true },
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

interface Emits {
	(name: 'update:modelValue', payload: FieldValue['phone']): void
	(name: 'update:settings', payload: FieldSettings['phone']): void
}
const rawEmit = defineEmits(['update:modelValue', 'update:settings'])
const emit = rawEmit as Emits

const defaultCountryCode = 'US'

interface Value {
	id: number
	label: string
	number: string
	compact: string
	code: string
}

let lastID = 0
const value = ref<Value[]>([])
/**
 * Prepare initial value by maping modelValue prop
 */
{
	const rawList = Array.isArray(props.modelValue)
		? props.modelValue
		: [{ label: 'Primary', number: props.modelValue }]
	rawList.forEach(phone => {
		const id = lastID++
		value.value.push({
			...phone,
			id,
			code: defaultCountryCode,
			compact: phone.number,
		})
		updateValue(id)
	})
}

watch(value, () => emitValue(), {
	deep: true,
})

/**
 * **DEB**
 * Emits change of phone values to parent component.
 */
const emitValue = debounce(() => {
	if (props.settings.multiple) {
		const parsedValues = value.value.map(phone => ({
			label: phone.label.trim() ?? 'Phone',
			number: phone.compact,
		}))
		emit('update:modelValue', parsedValues)
	} else {
		emit('update:modelValue', value.value[0]?.compact ?? '')
	}
}, 500)

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
 * Handles user input to one of phone numbers
 */
const handlePhoneInput = (e: Event, id: number) => {
	const el: any = e.target
	if (!el) return

	const selectionStart: number | undefined = el.selectionStart
	updateValue(id)

	// Changing v-model value makes the cursor to teleport to the end
	// This resets it to previous position if it were somewhere in the middle
	if (selectionStart && selectionStart !== el.value?.length)
		nextTick(() => (el.selectionStart = el.selectionEnd = selectionStart))
}

const addNumber = () => {
	const label = getRandom(['Mobile', 'Work', 'Secondary', 'Second', 'Home'])
	value.value.push({
		id: lastID++,
		label,
		number: '',
		compact: '',
		code: defaultCountryCode,
	})
}

const removeNumber = (id: number) => {
	const index = value.value.findIndex(p => p.id === id)
	value.value.splice(index, 1)
}
const handleNumberTap = (phoneID: number) => {
	if (props.settingsOpen) return
	const phone = value.value.find(p => p.id === phoneID)
	phone && copy(phone.compact)
}
const call = (number: string) => window.open(`tel:${number}`)

watch(
	() => props.settings.multiple,
	multiple => {
		if (!multiple) {
			if (value.value.length === 0) addNumber()
			value.value.splice(1)
		}
	},
)

// Finish reordering by updating value with new order
const doReorder = (e: CustomEvent) => {
	if (!e.detail.complete) return
	value.value = e.detail.complete(value.value)
}
const moreThanSingleEntry = computed(() => value.value.length > 1)
const reorderDisabled = computed(
	() =>
		!props.settingsOpen ||
		!props.settings.multiple ||
		!moreThanSingleEntry.value,
)
</script>

<template>
	<ion-reorder-group
		:disabled="reorderDisabled"
		@ionItemReorder="doReorder($event)"
		class="phones-list"
		:class="{ 'settings-open': settingsOpen }"
	>
		<div v-for="phone in value" :key="phone.id" class="phone-item">
			<label
				v-if="settings.multiple && !settingsOpen && moreThanSingleEntry"
			>
				{{ phone.label }}
			</label>
			<ion-input
				v-if="settings.multiple && settingsOpen && moreThanSingleEntry"
				v-model="phone.label"
				placeholder="Type the phone label"
				:maxlength="30"
			/>
			<!-- @input="log" -->
			<div class="input-group">
				<div class="country-code field-input">
					<span>
						{{ phone.code || defaultCountryCode }}
					</span>
				</div>
				<input
					:name="phone.label"
					:disabled="!settingsOpen"
					v-model="phone.number"
					@input="handlePhoneInput($event, phone.id)"
					placeholder="(000) 000-0000"
					type="tel"
					inputmode="tel"
					class="field-input field-input--phone"
					v-touch="() => handleNumberTap(phone.id)"
				/>

				<ion-button
					v-if="!settingsOpen && phone.compact.length > 6"
					fill="clear"
					color="medium"
					@click="call(phone.compact)"
				>
					<ion-icon slot="icon-only" :icon="callOutline" />
				</ion-button>
				<ion-reorder slot="end" :class="{ disabled: reorderDisabled }">
					<ion-icon :icon="reorderTwoOutline"></ion-icon>
				</ion-reorder>
				<ion-button
					v-if="settings.multiple"
					fill="clear"
					color="dark"
					@click="removeNumber(phone.id)"
					class="remove-btn"
				>
					<ion-icon slot="icon-only" :icon="closeOutline" />
				</ion-button>
			</div>
		</div>
	</ion-reorder-group>

	<CollapseTransition v-if="settings.multiple">
		<div v-show="settingsOpen" class="add-phone-wrapper">
			<ion-button
				size="small"
				color="light"
				class="add-phone-btn"
				@click="addNumber"
			>
				<ion-icon :icon="addOutline" slot="start" />{{
					value.length > 0 ? 'Add Another Number' : 'Add Number'
				}}
			</ion-button>
		</div>
	</CollapseTransition>

	<teleport :to="settingsTeleport">
		<ion-item class="settings-item">
			<ion-label>Multiple phone numbers</ion-label>
			<!-- eslint-disable-next-line vue/no-mutating-props -->
			<ion-checkbox slot="end" v-model="settings.multiple" />
		</ion-item>
	</teleport>
</template>

<style lang="postcss" scoped>
.phones-list {
	@apply space-y-3;
}

.phone-item {
	/* @apply flex items-center space-x-4; */
	@apply flex flex-col items-start space-y-1;

	> label,
	ion-input {
		@apply text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap;
		@apply overflow-hidden min-w-[4rem] max-w-[8rem] block p-0.5;
	}
	ion-input {
		@apply ring-1 ring-gray-200 dark:ring-gray-800 rounded box-border;
		@apply focus-within:ring-gray-500;
		$p: theme('spacing[0.5]');
		--padding-top: $p;
		--padding-end: $p;
		--padding-bottom: $p;
		--padding-start: $p;
	}
}
.input-group {
	@apply flex items-center space-x-3;

	ion-reorder {
		@apply h-12 w-12 flex justify-center items-center;

		ion-icon {
			@apply w-6 h-6;
		}
		&.disabled {
			@apply opacity-0 pointer-events-none;
		}
	}
}

.phones-list:not(.settings-open) .remove-btn {
	@apply opacity-0 pointer-events-none;
}

.country-code {
	@apply flex h-12 w-12 pointer-events-none;
	span {
		@apply m-auto;
	}
}

.field-input--phone {
	@apply mt-0 py-2 px-3 w-44 h-12 text-lg;
}
.add-phone-btn {
	@apply mt-6;
}
</style>
