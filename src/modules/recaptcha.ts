import router from '@/router'
import { IReCaptchaComposition, useReCaptcha } from 'vue-recaptcha-v3'

let recaptcha: IReCaptchaComposition | undefined

export const setupRecaptcha = async (): Promise<void> => {
	recaptcha = useReCaptcha()
	await recaptcha?.recaptchaLoaded()
	toggleBagdeAfterRouteChange()
}

export default async function runRecaptcha(
	action: string,
): Promise<string | undefined> {
	if (!recaptcha) return
	const { recaptchaLoaded, executeRecaptcha } = recaptcha
	await recaptchaLoaded()
	const token = await executeRecaptcha(action)
	return token
}

export function toggleBadge(show: boolean): void {
	if (!recaptcha) return
	const { instance } = recaptcha

	show ? instance.value?.showBadge() : instance.value?.hideBadge()
}

export function toggleBagdeAfterRouteChange(): void {
	const pageName = router.currentRoute.value.name
	if (['Hello', 'Login', 'SignUp'].includes(pageName as any)) toggleBadge(true)
	else toggleBadge(false)
}
