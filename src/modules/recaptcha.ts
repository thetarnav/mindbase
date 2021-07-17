import { IReCaptchaComposition, useReCaptcha } from 'vue-recaptcha-v3'

let recaptcha: IReCaptchaComposition | undefined

export const setupRecaptcha = (): void => {
	recaptcha = useReCaptcha()
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
