<script lang="ts" setup>
import {
	ellipsisVertical,
	heartOutline,
	shareSocialOutline,
} from 'ionicons/icons'
import type { ComponentPublicInstance } from 'vue'
import contenteditable from 'vue-contenteditable'
import { clamp, valToP } from '@/utils/functions'
import { debounce } from 'lodash'
import displayItemOptionsSheet from '../actionsSheet'
import DOCUMENT from '../useDocument'

const props = defineProps({
	id: { type: String, required: true },
})
const { title, description: desc } = DOCUMENT.instance

const headerComponent = ref<ComponentPublicInstance>()

const collapseM = ref('0px'),
	collapseP = ref(0)

const contentScroll = debounce(calcCollapseMargin, 30, { maxWait: 60 })
defineExpose({
	contentScroll, // debounced function is exposed to the parent element, to be called by ion-contents scroll event
})

let lastScrollTop = 0
function calcCollapseMargin(e: CustomEvent) {
	const scrollTop: number | undefined = e?.detail?.scrollTop,
		headerEl: HTMLElement | undefined = headerComponent.value?.$el

	if (
		scrollTop === undefined ||
		!headerEl ||
		(collapseP.value === 1 && scrollTop > lastScrollTop)
	)
		return
	lastScrollTop = scrollTop
	const headerHeight = headerEl.clientHeight

	let p = valToP(scrollTop, 0, headerHeight)
	p = clamp(p, 0, 1)
	p = p * p

	collapseM.value = Math.round((headerHeight - 64) * -p) + 'px'
	collapseP.value = p
}
</script>

<template>
	<ion-header class="item-header" ref="headerComponent">
		<div class="item-header--wrapper">
			<div class="content">
				<h2 class="title">{{ title }}</h2>
				<p class="desc">{{ desc }}</p>
			</div>
			<div class="options">
				<ion-button>
					<ion-icon slot="icon-only" :icon="ellipsisVertical" />
				</ion-button>
				<ion-button>
					<ion-icon slot="icon-only" :icon="heartOutline" />
				</ion-button>
				<ion-button>
					<ion-icon slot="icon-only" :icon="shareSocialOutline" />
				</ion-button>
			</div>
		</div>
	</ion-header>

	<ion-header
		class="item-header fixed"
		:style="{
			'--collapse-m': collapseM,
			'--collapse-p': collapseP,
		}"
	>
		<!-- <ion-buttons slot="start">
			<ion-back-button default-href="/tabs/home"></ion-back-button>
		</ion-buttons> -->
		<div class="item-header--wrapper">
			<div class="content">
				<contenteditable
					tag="h2"
					class="title"
					:contenteditable="collapseP < 0.1"
					v-model="title"
					noNL
					noHTML
				/>
				<contenteditable
					tag="p"
					class="desc"
					:contenteditable="collapseP < 0.1"
					v-model="desc"
					noNL
					noHTML
				/>
			</div>
			<div class="options">
				<ion-button
					fill="clear"
					color="dark"
					@click="displayItemOptionsSheet"
				>
					<ion-icon slot="icon-only" :icon="ellipsisVertical" />
				</ion-button>
				<ion-button fill="clear" color="dark">
					<ion-icon slot="icon-only" :icon="heartOutline" />
				</ion-button>
				<ion-button fill="clear" color="dark">
					<ion-icon slot="icon-only" :icon="shareSocialOutline" />
				</ion-button>
			</div>
		</div>
		<ion-toolbar
			class="collapsed-content"
			:class="{ enabled: collapseP > 0.1 }"
		>
			<ion-buttons slot="start">
				<ion-back-button default-href="/tabs/home"></ion-back-button>
			</ion-buttons>
			<h3 class="title-collapsed">{{ title }}</h3>
			<ion-buttons slot="end">
				<ion-button @click="displayItemOptionsSheet">
					<ion-icon slot="icon-only" :icon="ellipsisVertical" />
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
</template>

<style lang="postcss">
.item-header {
	@apply bg-gray-100 dark:bg-[#242424];
	@apply border-b border-gray-300 dark:border-gray-700;

	&--wrapper {
		@apply flex items-stretch justify-between space-x-4 p-2 pl-4 pr-1;
		.options {
			@apply w-12 flex-shrink-0 flex flex-col justify-start items-center space-y-1;
			ion-button {
				@apply w-12 h-12 m-0;
				ion-icon {
					@apply min-w-[2rem];
				}
			}
		}
	}
	.title,
	.desc {
		word-break: break-word;
	}
	.desc {
		@apply my-4 text-gray-600 dark:text-gray-400;
	}

	/* Hidden - static header underneath */
	&:not(.fixed) {
		@apply static;
		> * {
			opacity: 0 !important;
			visibility: hidden;
		}
	}

	/* Visible - fixed header on top */
	&.fixed {
		@apply fixed z-30 top-0 inset-x-0;
		@apply overflow-hidden;

		.item-header--wrapper {
			margin-bottom: var(--collapse-m);
			transition: margin-bottom 0.12s;
		}

		.collapsed-content {
			@apply absolute -z-1 h-16 top-0 inset-x-0 flex items-center;
			--background: transparent;
			transform: translateY(calc((1 - var(--collapse-p)) * 3rem));
			opacity: calc(var(--collapse-p) * 2 - 0.5);
			transition: transform 0.12s, opacity 0.12s;

			&.enabled {
				@apply z-10;
			}
		}

		.title {
			opacity: calc(1 - var(--collapse-p) * 1.5);
			transition: opacity 0.12s;

			&-collapsed {
				@apply m-0;
				@add-mixin limit-lines 1;
			}
		}
		.desc {
			opacity: calc(1 - var(--collapse-p) * 2);
			transition: opacity 0.12s;
		}
		.options {
			opacity: calc(1 - var(--collapse-p) * 2);
			transition: opacity 0.12s;
		}
	}
}

ion-action-sheet.item-action-sheet {
	.action-sheet-group.sc-ion-action-sheet-md {
		@apply py-6;

		.action-sheet-destructive {
			@apply text-red-400 dark:text-red-600;
			--color: currentColor;
		}
	}
}
</style>
