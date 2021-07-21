<script lang="ts" setup>
import { useItem } from '@/store/items'
import { ellipsisVertical } from 'ionicons/icons'
import { defineProps, onMounted, toRefs, useContext } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import contenteditable from 'vue-contenteditable'
import { clamp, valToP } from '@/utils/functions'
import { debounce } from 'lodash'

const ctx = useContext()

const props = defineProps({
	id: { type: String, required: true },
})
const { title, description: desc } = useItem(props.id)

const headerComponent = ref<ComponentPublicInstance>()

const calcCollapseMargin = (e: CustomEvent) => {
	const scrollTop: number | undefined = e?.detail?.scrollTop,
		headerEl: HTMLElement | undefined =
			headerComponent.value?.$el?.querySelector('.in-toolbar')

	if (scrollTop === undefined || !headerEl) return
	const headerHeight = headerEl.clientHeight

	let p = valToP(scrollTop, 0, headerHeight)
	p = clamp(p, 0, 1)

	margin.value = Math.round((headerHeight - 70) * -p) + 'px'
}

const margin = ref('0px'),
	contentScroll = debounce(calcCollapseMargin, 50, { maxWait: 100 })

ctx.expose({
	contentScroll,
})
</script>

<template>
	<ion-header
		class="item-header"
		ref="headerComponent"
		:style="{ '--collapse-margin': margin }"
	>
		<div class="header-content">
			<ion-toolbar>
				<contenteditable
					tag="h2"
					:contenteditable="true"
					v-model="title"
					:noNL="true"
					:noHTML="true"
				/>
				<contenteditable
					tag="p"
					class="desc"
					:contenteditable="true"
					v-model="desc"
					:noNL="true"
					:noHTML="true"
				/>
				<p>ID: {{ id }}</p>
				<ion-buttons slot="end">
					<ion-button>
						<ion-icon :icon="ellipsisVertical" />
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</div>
	</ion-header>
</template>

<style lang="postcss">
.item-header {
	@apply relative;
	--collapse-p: 0;

	.header-content {
		@apply overflow-hidden;
		/* margin-bottom: calc(var(--collapse-p) * (100% - 70px)); */
		margin-bottom: calc(var(--collapse-margin) * -1);
		transition: margin-bottom 0.2s;
	}

	ion-toolbar {
		/* margin-bottom: calc(var(--collapse-p) * (100% - 70px) * -1); */
		transition: margin-bottom 0.2s;
		margin-bottom: var(--collapse-margin);
		--padding-bottom: theme('spacing.4');
		--padding-top: theme('spacing.4');
		--padding-start: theme('spacing.4');
	}

	.desc {
		@apply my-4 text-gray-600 dark:text-gray-400;
	}
}
</style>
