<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unsafe-argument */
	import { initServices, stopServices } from '$lib/app/services'
	import { showCookieDisclaimer, submitNecessaryCookies } from '$lib/app/store'
	import type { SKCMConfiguration } from '$core/types'
	import { getInlineStyle } from '$core/utils'
	import { AdditionalCookies, Button, NecessaryCookies } from '../'
	import { information } from '$core/cookies.json'

	export let configuration: SKCMConfiguration = {}

	let hasAllowedCookies: 'true' | 'false'
	let style: string = ''

	$: ({ theme } = configuration)
	$: style = getInlineStyle(theme)

	function updatePreferences(): void {
		if (hasAllowedCookies !== undefined) {
			submitNecessaryCookies(hasAllowedCookies)
			hasAllowedCookies === 'true' ? initServices() : stopServices()
			showCookieDisclaimer.set(false)
		}
	}
</script>

<div id="skcm-cookie-library" {style}>
	{#each information as section}
		<section id="skcm-cookie-library__{section?.id}">
			{#if section?.title}
				<h4>{section?.title}</h4>
			{/if}
			{#if section?.body}
				{#each section?.body as paragraphs}
					<p>
						{paragraphs?.paragraph}
					</p>
				{/each}
			{/if}
			{#if section?.id === 'necessary-cookies'}
				<NecessaryCookies />
			{:else if section?.id === 'additional-cookies'}
				<AdditionalCookies />
			{/if}
		</section>
	{/each}

	<div id="skcm-cookie-library__preferences">
		<label id="skcm-cookie-library__preferences--reject">
			<input type="radio" bind:group={hasAllowedCookies} value={'false'} />
			Reject all
		</label>
		<label id="skcm-cookie-library__preferences--allow">
			<input type="radio" bind:group={hasAllowedCookies} value={'true'} />
			Allow all
		</label>
		<Button
			onClick={updatePreferences}
			id="skcm-cookie-library__preferences__button"
			disabled={!hasAllowedCookies}>Update Cookie Preference</Button
		>
	</div>
</div>

<style lang="scss">
	#skcm-cookie-library__preferences {
		max-width: 250px;
	}
</style>
