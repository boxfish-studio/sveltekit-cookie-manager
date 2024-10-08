# React Cookie Manager 🍪

React Cookie Manager is a framework agnostic, easy-use package to help control the visitor's cookie consent.

## About 📝

**React Cookie Manager** reduces the workload of creating and mantaining multiple cookie consents by centralizing them into this package. Enables cookie management of following services:

- Google Analytics Universal. (Deprecated)
- Google Analytics 4.

## Features ✨

- Display a customizable popup to accept or reject cookies.
- Create a cookie library showing:
  - Tables with details about site's necessary cookies and additional cookies: cookie name, provider name and url, cookie category, purpose, expiry and type.
  - Radio inputs (allow or reject all cookies) and a button to update preferences.

## Installation 🧰

```shell
$ npm i @boxfish-studio/react-cookie-manager
```

yarn

```shell
$ yarn add @boxfish-studio/react-cookie-manager
```

pnpm

```shell
$ pnpm add @boxfish-studio/react-cookie-manager
```

<br/>

## How to use 📝

### Configure the Disclaimer

Import the `CookieManager` into a component in your React app and pass the configuration with your desired theme settings:

```tsx
// Disclaimer.tsx
'use client'

import { CookieManager, type SKCMConfiguration } from '@boxfish-studio/react-cookie-manager'

export default function Disclaimer(): React.JSX.Element {
	const configuration: SKCMConfiguration = {
		disclaimer: {
			title: 'This website uses cookies',
			body: 'By using this site, you agree with our use of cookies'
		},
		services: {
			googleAnalyticsUniversalId: 'UA-XXXXXXXX',
			googleAnalytics4Id: 'G-XXXXXXXX'
		},
		theme: {
			primary: '#14cabf',
			dark: '#131f37',
			medium: '#b0bfd9',
			light: '#fff'
		}
	}

	return <CookieManager configuration={configuration} />
}
```

### Control page navigation

Import the `useUpdatePathGA` hook and use it with your router of preference:

> Example for NextJS with the App router

```tsx
'use client'

import { useEffect } from 'react'
import {
	CookieManager,
	useUpdatePathGA,
	type SKCMConfiguration
} from '@boxfish-studio/react-cookie-manager'
import { usePathname } from 'next/navigation'

export default function Disclaimer(): React.JSX.Element {
	const pathname = usePathname()
	const updatePathGA = useUpdatePathGA()

	const configuration: SKCMConfiguration = {
		// ...
	}

	useEffect(() => {
		updatePathGA(pathname)
	}, [pathname])

	return <CookieManager configuration={configuration} />
}
```

### Add the CookieManagerProvider

Import the `CookieManagerProvider` and add it to the list of providers:

```tsx
// ContextProviders.tsx
'use client'

import { CookieManagerProvider } from '@boxfish-studio/react-cookie-manager'

export function ContextProviders({ children }: React.PropsWithChildren): React.JSX.Element {
	return <CookieManagerProvider>{children}</CookieManagerProvider>
}
```

Then import it to your layout and add the `<Disclaimer />` component:

```tsx
// layout.tsx

import { ContextProviders } from './ContextProviders.tsx'
import { Disclaimer } from './components'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>): React.JSX.Element {
	return (
		<ContextProviders>
			<html lang="en">
				<body>
					{children}
					<Disclaimer />
				</body>
			</html>
		</ContextProviders>
	)
}
```

### Show the cookie library

Import the `CookieLibrary` component to your svelte file and pass the configuration with your desired settings, as shown in the example below.

You can also use the library without any configuration or you can pass a `theme` to the configuration:

```tsx
'use client'

import { CookieLibrary, type SKCMConfiguration } from '@boxfish-studio/react-cookie-manager'

export default function CookieLibraryPage() {
	const configuration: SKCMConfiguration = {
		theme: {
			primary: '#14cabf',
			dark: '#131f37',
			medium: '#b0bfd9',
			light: '#fff'
		}
	}

	return <CookieLibrary configuration={configuration} />
}
```

### Using the internal store

You can use the `useCookieManagerContext` hook to know whether the services are running or not.

```tsx
import { useCookieManagerContext } from '@boxfish-studio/react-cookie-manager'

export function Component() {
	const { servicesInitialized } = useCookieManagerContext()
	const isRunning = servicesInitialized.value

	// ...
}
```

## Configuration 🪛

Custom configuration must be of type `SKCMConfiguration`. All available props are shown below:

```ts
type SKCMConfiguration = {
	disclaimer: {
		title?: string
		body?: string
		policyText?: string
		policyUrl?: string
		acceptButtonText?: string
		rejectButtonText?: string
	}
	services: {
		googleAnalyticsUniversalId?: string
		googleAnalytics4Id?: string
		adCookiesEnabled?: boolean
		customNecessaryCookies?: {
			name: string
			provider: string
			providerUrl: string
			purpose: string
			expiry: string
			type: string
			showDisclaimerIfMissing?: boolean
		}[]
	}
	theme: {
		primary?: string
		dark?: string
		medium?: string
		light?: string
	}
}
```

### Disclaimer props

| Name             | Description                       | Default value                                            |
| ---------------- | --------------------------------- | -------------------------------------------------------- |
| title            | The title of the popup            | "Cookie Preferences"                                     |
| body             | Body message of the popup         | "By using this site, you agree with our use of cookies." |
| policyText       | Text that links to Privacy Policy | "Read our Cookie Policy"                                 |
| policyUrl        | Privacy Policy url                | "/privacy-policy"                                        |
| acceptButtonText | Text shown in 'Accept' button     | "Accept Additional Cookies"                              |
| rejectButtonText | Text shown in 'Reject' button     | "Reject Additional Cookies"                              |

### Services props

You must use `googleAnalyticsUniversalId` or `googleAnalytics4Id`.

| Name                       | Description                                                                                                               | Default value |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| googleAnalyticsUniversalId | Your Google Analytics Universal key                                                                                       |               |
| googleAnalytics4Id         | Your Google Analytics 4 key                                                                                               |               |
| adCookiesEnabled           | Whether cookies with the category Advertising should be set in the browser and shown in the library                       | true          |
| customNecessaryCookies     | Cookies that should be present in the Necessary Cookies table to inform the user their usage. To configure them see below |               |

### Custom necessary cookies

You can configure extra cookies that will also appear in the Cookie library by specifying them in the `customNecessaryCookies` property.
They accept the following options:

| Name                   | Description                                                                | Default value | Required | Example                     |
| ---------------------- | -------------------------------------------------------------------------- | ------------- | -------- | --------------------------- |
| name                   | Name of the cookie                                                         |               | Yes      | Boxfish Cookie              |
| provider               | Name of it's provider                                                      |               | No       | Boxfish                     |
| providerUrl            | URL of it's provider                                                       |               | No       | https://boxfish.studio      |
| purpose                | Usage of the cookie                                                        |               | Yes      | "Stores the user's consent" |
| expiry                 | Time that the cookie with remain in the user's browser since it's creation |               | Yes      | "30 days"                   |
| type                   | Type of cookie                                                             |               | Yes      | "HTTP"                      |
| showDisclamerIfMissing | Show the accept/reject popup if this cookie is missing                     | false         | No       | true                        |

### Theme props

A 4-colour palette has been predefined following a custom style guide. You may overwrite these values in your custom configuration variable.

| Name    | Description                                           | Default value   |
| ------- | ----------------------------------------------------- | --------------- |
| primary | Used in buttons backgrounds, anchors                  | #14cabf (teal)  |
| dark    | Used in headings, body                                | #131f37 (black) |
| medium  | Used in table headings, table borders                 | #b0bfd9 (gray)  |
| light   | Used in banner background colour, buttons text colour | #fff (white)    |

### Built with

- React.
- Typescript.
- Vite

## Release Package

`cd cookie-manager/{framework} && pnpm package && npm publish --access=public`

## License

[Apache 2.0](./LICENSE) &copy; [Boxfish Studio]

[Boxfish Studio]: https://boxfish.studio

<hr/>

<div align="center">
    Made with :heart: by Boxfish Studio. </br></br>
    <img src="https://avatars.githubusercontent.com/u/36508409?s=200&v=4" alt="Boxfish Logo" width="50" height="50"/>
</div>
