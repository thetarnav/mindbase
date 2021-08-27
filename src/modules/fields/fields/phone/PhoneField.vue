<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import { ComponentPublicInstance, nextTick } from 'vue'
import { IonReorderGroup } from '@ionic/vue'
import {
	addOutline,
	closeOutline,
	reorderTwoOutline,
	callOutline,
} from 'ionicons/icons'
import { AsYouType } from 'libphonenumber-js'
import { getRandom } from '@/utils/functions'
import copy from '@/modules/clipboard'
import { injectController } from '../../injectController'
import { isElementFocused } from '@/utils/dom'

const props = defineProps({
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

const { value, settings } = injectController('phone')

const defaultCountryCode = 'US'

// In case of an empty list, add an empty item, if "multiple" settings is disabled (no option for user to add field)
if (value.value.length === 0 && !settings.multiple) addNumber()

/**
 * Updates local phone values
 * @param index index of item in the value list
 */
function formatItem(index: number) {
	const phoneItem = value.value[index]
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
const handlePhoneInput = (e: Event, index: number) => {
	const el: any = e.target
	if (!el) return

	const selectionStart: number | undefined = el.selectionStart
	formatItem(index)

	// Changing v-model value makes the cursor to teleport to the end
	// This resets it to previous position if it were somewhere in the middle
	if (selectionStart && selectionStart !== el.value?.length)
		nextTick(() => (el.selectionStart = el.selectionEnd = selectionStart))
}

function addNumber() {
	const label = getRandom(['Mobile', 'Work', 'Secondary', 'Second', 'Home'])
	value.value.push({
		label,
		number: '',
		compact: '',
		code: defaultCountryCode,
	})
}

const removeNumber = (index: number) => {
	value.value.splice(index, 1)
}
const handleNumberTap = (index: number) => {
	if (props.settingsOpen) return
	const phone = value.value[index]
	copy(phone.compact)
}
const call = (number: string) => window.open(`tel:${number}`)

watch(
	() => settings.multiple,
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
		!props.settingsOpen || !settings.multiple || !moreThanSingleEntry.value,
)

const listRef = ref<ComponentPublicInstance>()

const inputDisabled = (index: number): boolean => {
	const isInputFocused = (): boolean => {
		const list: HTMLElement | undefined = listRef.value?.$el
		if (!list) return false
		const input: HTMLInputElement | null = list.querySelector(
			`.phone-item[data-index="${index}"] .field-input--phone`,
		)
		return isElementFocused(input)
	}

	return (
		!isInputFocused() &&
		!props.settingsOpen &&
		value.value[index].number.length > 0
	)
}
</script>

<template>
	<ion-reorder-group
		ref="listRef"
		:disabled="reorderDisabled"
		@ionItemReorder="doReorder($event)"
		class="phones-list"
		:class="{ 'settings-open': settingsOpen }"
	>
		<div
			v-for="(phone, index) in value"
			:key="index"
			class="phone-item"
			:data-index="index"
		>
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
					:disabled="inputDisabled(index)"
					v-model="phone.number"
					@input="handlePhoneInput($event, index)"
					placeholder="(000) 000-0000"
					type="tel"
					inputmode="tel"
					class="field-input field-input--phone"
					v-touch="() => handleNumberTap(index)"
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
					@click="removeNumber(index)"
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
