import { createAnimation } from '@ionic/vue'

export const itemCollapseTransition = async (
	el: Element,
	done: () => void,
	childQuery = '.field-item',
): Promise<void> => {
	const { height } = el.getBoundingClientRect(),
		child = el.querySelector(childQuery)
	if (!child) return done()

	// If parent element normally doesn't have hidden overflow it should receive it for the animation
	{
		const htmlEl = el as HTMLElement
		if (htmlEl.style) htmlEl.style.overflow = 'hidden'
	}

	await createAnimation()
		.addElement(child)
		.duration(500)
		.fromTo('marginBottom', '0', -height + 'px')
		.fromTo('transform', 'translateX(0px)', 'translateX(100px)')
		.fromTo('opacity', '1', '0')
		.easing('ease-in-out')
		.play()

	done() // tell vue that the transition is over
}
