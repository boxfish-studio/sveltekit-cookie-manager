import { COOKIE_EXPIRATION_DAYS, GOOGLE_ANALYTICS_EXPIRATION_DAYS } from './constants'
import { browser } from '$app/environment'
import { get } from 'svelte/store'
import { configuredServices, servicesInitialized } from './store'
import { SupportedService } from './types'
import { removeAdditionalCookies } from './utils'

export const initializeServices = (): void => {
	if (!get(servicesInitialized)) {
		const googleAnalyticsUniversalConfig = get(configuredServices)?.find(
			({ type }) => type === SupportedService.GoogleAnalyticsUniversal
		)
		const googleAnalytics4Config = get(configuredServices)?.find(
			({ type }) => type === SupportedService.GoogleAnalytics4
		)
		if (googleAnalyticsUniversalConfig?.enabled) {
			loadGoogleAnalytics(googleAnalyticsUniversalConfig.id)
		} else {
			if (googleAnalytics4Config?.enabled) {
				loadGoogleAnalytics(googleAnalytics4Config.id)
			}
		}
	}
}

export const stopServices = (): void => {
	const googleAnalyticsUniversalConfig = get(configuredServices)?.find(
		({ type }) => type === SupportedService.GoogleAnalyticsUniversal
	)
	const googleAnalytics4Config = get(configuredServices)?.find(
		({ type }) => type === SupportedService.GoogleAnalytics4
	)
	removeGoogleAnalytics(googleAnalytics4Config?.id)
	removeGoogleAnalytics(googleAnalyticsUniversalConfig?.id)
	removeAdditionalCookies()

	servicesInitialized.set(false)
}

export const loadGoogleAnalytics = (id: string): void => {
	function gtag(key: string, value: unknown, config?: { cookie_expires: number }) {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer.push(arguments)
	}
	if (browser) {
		window.dataLayer = window.dataLayer || []

		gtag('js', new Date())
		gtag('config', id, { cookie_expires: GOOGLE_ANALYTICS_EXPIRATION_DAYS * 24 * 60 * 60 })

		const script = document.createElement('script')
		script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
		document.body.appendChild(script)
		servicesInitialized.set(true)
	}
}

export const removeGoogleAnalytics = (id: string): void => {
	const scripts = Array.from(document.getElementsByTagName('script'))
	if (scripts && scripts.length) {
		scripts
			.find((script) => script?.src === `https://www.googletagmanager.com/gtag/js?id=${id}`)
			?.remove()
		scripts
			.find((script) => script?.src === 'https://www.google-analytics.com/analytics.js')
			?.remove()
	}
}

export const updatePathGA = (id: string, path: string): void => {
	function gtag(key: string, value: unknown, { page_path: string }) {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer.push(arguments)
	}
	if (browser) {
		window.dataLayer = window.dataLayer || []
		gtag('config', id, {
			page_path: path
		})
	}
}
